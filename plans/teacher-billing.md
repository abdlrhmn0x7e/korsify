# Korsify Teacher Billing System Plan

## Business Model

| Component | Details |
|-----------|---------|
| **Base Fee** | 500 EGP/month (fixed) |
| **Usage Fee** | 1 EGP per minute of Mux-hosted video playback (deferred - not in this plan) |
| **Billing Cycle** | Monthly (30-day frequency via Paymob Subscription Module) |
| **Payment Gateway** | Paymob (Egypt) — using their native Subscription Module |
| **Card Verification** | 1 EGP initial 3DS transaction to enroll in subscription |

> **Scope of this plan**: Subscription lifecycle, Paymob subscription integration, storefront gating, and Mux asset cleanup for non-paying teachers. Usage-based billing (playback tracking, per-minute charges) is a future phase built on top of this foundation.

---

## Architecture: Paymob Subscription Module

Paymob has a native Subscription Module that handles recurring billing automatically. Instead of building our own billing cron, retry logic, and MOTO charging, we delegate all of that to Paymob.

**What Paymob handles for us:**
- Automatic monthly charges on the saved card
- Built-in retry on failed payments (`retrial_days` parameter)
- Reminder emails to customers before billing (`reminder_days` parameter)
- Card tokenization during the initial 3DS transaction
- Subscription state management (active, suspended, cancelled)

**What we handle ourselves:**
- Subscription plan creation (one-time setup, or via API)
- Creating subscription enrollments per teacher (via Intention API)
- Webhook processing to sync Paymob subscription state → our DB
- Storefront gating based on subscription status
- Mux asset cleanup for non-paying teachers
- Dashboard UI for subscription management

### How It Works

```
ONE-TIME SETUP:
    Create a Subscription Plan on Paymob
    (500 EGP, 30-day frequency, MOTO integration, webhook URL)
    → Get back a plan_id (stored as env var)

PER-TEACHER ENROLLMENT:
    Teacher clicks "Subscribe"
        → We call Paymob Intention API with subscription_plan_id
        → Get back client_secret
        → Redirect teacher to Paymob Unified Checkout
        → Teacher enters card, completes 3DS (1 EGP charged)
        → Paymob creates subscription, tokenizes card
        → Webhook fires → we save subscription to our DB

RECURRING (handled by Paymob automatically):
    Every 30 days, Paymob charges teacher's card 500 EGP
        → Webhook fires on success/failure → we update our DB
    If payment fails, Paymob retries per retrial_days config
        → Webhook fires on each retry → we update status
```

---

## Simplified Subscription Lifecycle (Minimal)

### Core States (Keep It Simple)

```
completeOnboarding()
  │
  ▼
unsubscribed  ── dashboard build access, storefront draft (students blocked)
  │ subscribe (Paymob checkout success)
  ▼
active        ── storefront live
  │ payment failed (Paymob retries)
  ▼
past_due      ── storefront live, warning banner
  │ retries exhausted OR canceled
  ▼
suspended     ── storefront offline, dashboard read-only
```

### Answering the 3 Teacher Cases (What happens to courses)

1) **Onboarding complete + courses added + never adds card**
- Status stays `unsubscribed`
- Courses remain editable in dashboard
- Storefront stays in draft (students cannot access)
- Optional cleanup: after 60 days, delete Mux assets only (keep course structure)

2) **Card added but payment fails**
- Status moves to `past_due` on first failed payment
- Storefront stays live during Paymob retry window
- If retries are exhausted: move to `suspended`, storefront offline
- Optional cleanup: delete Mux assets after 30 days in `suspended`

3) **Never adds a card at all**
- Same as (1): `unsubscribed`, storefront draft, dashboard build access
- Optional cleanup after 60 days (Mux assets only)

**Simplest policy choice** (recommended):
- Do not delete anything for unsubscribed teachers
- Only gate storefront (draft vs live)
- Add cleanup later when storage costs become painful

### What "Mux Cleanup" Means

- Delete the Mux asset via Mux API (`mux.video.assets.delete(assetId)`)
- Delete the `muxAssets` record in Convex
- Update affected lessons: change `hosting` from `{ type: "mux", videoId }` to `{ type: "mux_removed" }`
- **Preserve**: course record, section structure, lesson titles/descriptions, PDFs, all text content
- If teacher resubscribes later, they see their courses intact but with "Video removed - please re-upload" on each affected lesson

---

## Minimal Database Requirements (Simplest Possible)

You only need two places to store data. Everything else is optional.

### 1) `teachers` (add subscription fields)

```typescript
// Minimal fields added to existing teachers table
subscriptionStatus: v.union(
  v.literal("unsubscribed"),
  v.literal("active"),
  v.literal("past_due"),
  v.literal("suspended"),
),
subscriptionId: v.optional(v.number()), // Paymob subscription id
subscriptionUpdatedAt: v.number(),
onboardingCompletedAt: v.optional(v.number()),
```

### 2) Optional `billingEvents` (only if you want a history list)

```typescript
defineTable({
  teacherId: v.id("teachers"),
  paymobTransactionId: v.optional(v.number()),
  paymobSubscriptionId: v.optional(v.number()),
  status: v.union(v.literal("success"), v.literal("failed")),
  amountCents: v.number(),
  createdAt: v.number(),
})
.index("by_teacherId", ["teacherId"])
```

**That is enough** to gate the storefront and show billing status. You can skip `billingEvents` entirely and rely on Paymob's dashboard during early stages.

### Mux Cleanup Data (Only If You Implement Cleanup)

If you do cleanup later, add a single timestamp:

```typescript
muxCleanedAt: v.optional(v.number())
```

---

## Core Workflows (Minimal)

### 1. One-Time Setup: Create Subscription Plan

Before any teacher can subscribe, create a single subscription plan on Paymob (done once, via API or Paymob dashboard).

```
POST https://accept.paymob.com/api/acceptance/subscription-plans
Authorization: Bearer {auth_token}
Body: {
  "frequency": 30,                          // Monthly
  "name": "Korsify Teacher Plan",
  "reminder_days": 3,                       // Email reminder 3 days before billing
  "retrial_days": 7,                        // Retry failed payment every 7 days
  "plan_type": "rent",
  "number_of_deductions": null,             // Unlimited (no end)
  "amount_cents": 50000,                    // 500 EGP
  "use_transaction_amount": false,          // Use plan amount, not initial 1 EGP
  "is_active": true,
  "integration": PAYMOB_MOTO_INTEGRATION_ID,
  "webhook_url": "https://<convex-deployment>.convex.site/paymob-subscription-webhook"
}
```

Store the returned `plan_id` as `PAYMOB_SUBSCRIPTION_PLAN_ID` env variable.

### 2. Subscribe (Teacher Enrollment)

```
Teacher clicks "Subscribe" on dashboard
    │
    ▼
Convex action: createSubscription()
    │  1. Call Paymob Intention API:
    │     POST https://accept.paymob.com/v1/intention/
    │     Authorization: Token {PAYMOB_SECRET_KEY}
    │     Body: {
    │       "amount": 100,                        // 1 EGP verification
    │       "currency": "EGP",
    │       "payment_methods": [PAYMOB_3DS_INTEGRATION_ID],
    │       "subscription_plan_id": PAYMOB_SUBSCRIPTION_PLAN_ID,
    │       "items": [{ "name": "Card verification", "amount": 100, ... }],
    │       "billing_data": { teacher's name, email, phone },
    │       "notification_url": "https://<convex>.convex.site/paymob-subscription-webhook",
    │       "redirection_url": "https://korsify.com/dashboard/payments/callback"
    │     }
    │
    │  2. Get back: { "client_secret": "egy_csk_...", ... }
    │  3. Return checkout URL to client
    │
    ▼
Client redirects teacher to Paymob Unified Checkout:
    https://accept.paymob.com/unifiedcheckout/?publicKey={PUBLIC_KEY}&clientSecret={client_secret}
    │
    │  Teacher enters card details, completes 3DS
    │  1 EGP charged for verification
    │  Card tokenized, subscription created on Paymob's side
    │
    ▼
Paymob sends webhook to /paymob-subscription-webhook
    │  Contains: subscription ID, state, transaction details
    │
    │  On success:
    │    - Create `teacherSubscription` record (status: "active")
    │    - Store paymobSubscriptionId
    │    - Log transaction to `paymentTransactions`
    │
    ▼
Teacher redirected to /dashboard/payments/callback
    │  Page checks subscription status in DB
    │  Shows success/failure message
```

### 3. Recurring Billing (Handled by Paymob)

Paymob automatically charges the teacher's card every 30 days.

```
Paymob charges card → webhook fires
    │
    ▼
Our webhook handler receives transaction data
    │
    ├─ If success:
    │    - Update subscription nextBillingDate
    │    - Ensure status = "active"
    │    - Log transaction to `paymentTransactions`
    │
    └─ If failure:
         - Set status = "past_due" (if first failure)
         - Log failed transaction
         - Paymob will retry per retrial_days config
         - If Paymob exhausts retries → subscription state becomes "suspended"
         - Our webhook updates status = "suspended", sets suspendedAt
```

### 4. Cancel Subscription (Optional)

```
Teacher clicks "Cancel Subscription"
    │
    ▼
Convex action: cancelSubscription()
    │  1. Call Paymob Cancel API:
    │     POST https://accept.paymob.com/api/acceptance/subscriptions/{id}/cancel
    │     Authorization: Bearer {auth_token}
    │
    │  2. Update local record:
    │     - status = "cancelled"
    │     - cancelledAt = now
    │
    ▼
Storefront goes offline (Paymob stops billing immediately)
```

**Note**: Paymob cancellation is permanent — the teacher must create a new subscription to re-enroll.

### 5. Resubscribe (After Suspension)

Same as workflow #2 (Subscribe). A new Paymob subscription is created, new `teacherSubscription` record (or update existing).

### 6. Mux Asset Cleanup (Optional)

This is the only cron we need to build ourselves — Paymob handles billing.

```
Daily cron
    │
    ▼
Find teachers where:
    - No subscription exists AND onboardingCompletedAt < (now - 60 days)
    - OR status = "suspended" AND suspendedAt < (now - 30 days)
    - OR status = "cancelled" AND cancelledAt < (now - 30 days)
    AND muxCleanedAt is not set
    │
    ▼
For each teacher:
    1. Query all muxAssets by teacherId
    2. For each asset: call Mux API to delete
    3. Delete muxAssets records in Convex
    4. Update affected lessons: hosting → { type: "mux_removed" }
    5. Set muxCleanedAt on subscription/teacher record
```

---

## Paymob Integration Details

### Environment Variables

```
PAYMOB_API_KEY                  - API key (for auth token generation)
PAYMOB_SECRET_KEY               - Secret key (for Intention API auth)
PAYMOB_PUBLIC_KEY               - Public key (for checkout URL)
PAYMOB_HMAC_SECRET              - Webhook HMAC verification
PAYMOB_3DS_INTEGRATION_ID       - Online 3DS integration (initial enrollment)
PAYMOB_MOTO_INTEGRATION_ID      - MOTO integration (recurring auto-deductions)
PAYMOB_SUBSCRIPTION_PLAN_ID     - The plan ID created in one-time setup
```

### API Endpoints Used

| Purpose | Method | Endpoint |
|---------|--------|----------|
| Auth token | POST | `/api/auth/tokens` |
| Create subscription plan (one-time) | POST | `/api/acceptance/subscription-plans` |
| Create subscription (per teacher) | POST | `/v1/intention/` |
| Get subscription details | GET | `/api/acceptance/subscriptions/{id}` |
| Suspend subscription | POST | `/api/acceptance/subscriptions/{id}/suspend` |
| Resume subscription | POST | `/api/acceptance/subscriptions/{id}/resume` |
| Cancel subscription | POST | `/api/acceptance/subscriptions/{id}/cancel` |
| Update subscription amount | PUT | `/api/acceptance/subscriptions/{id}` |

### Checkout URL Construction

After creating an intention, redirect the teacher to:
```
https://accept.paymob.com/unifiedcheckout/?publicKey={PAYMOB_PUBLIC_KEY}&clientSecret={client_secret}
```

### Webhook Handler

Route: `POST /paymob-subscription-webhook` (registered in `convex/http.ts`)

The subscription plan's `webhook_url` is set to this endpoint. Paymob sends events for:
- Initial subscription creation (successful 3DS transaction)
- Each recurring charge (success or failure)
- Subscription state changes

**HMAC Verification** (critical - never skip):
```typescript
function verifyPaymobHMAC(body: any, receivedHMAC: string, secret: string): boolean {
  const fields = [
    body.obj.amount_cents, body.obj.created_at, body.obj.currency,
    body.obj.error_occured, body.obj.has_parent_transaction, body.obj.id,
    body.obj.integration_id, body.obj.is_3d_secure, body.obj.is_auth,
    body.obj.is_capture, body.obj.is_refunded, body.obj.is_standalone_payment,
    body.obj.is_voided, body.obj.order.id, body.obj.owner, body.obj.pending,
    body.obj.source_data.pan, body.obj.source_data.sub_type,
    body.obj.source_data.type, body.obj.success,
  ].join("");

  const calculated = crypto.createHmac("sha512", secret).update(fields).digest("hex");
  return calculated === receivedHMAC;
}
```

**Webhook Processing Logic**:

```typescript
// Determine what happened based on webhook payload
if (transaction.success) {
  // Check if this is the initial 3DS transaction (subscription creation)
  // or a recurring MOTO charge
  if (transaction.is_3d_secure) {
    // Initial enrollment — create teacherSubscription record
    // Map teacher via billing_data.email or special_reference
  } else {
    // Recurring charge success — update subscription, log transaction
  }
} else {
  // Payment failed
  if (hasActiveSubscription) {
    // Set status = "past_due"
    // Paymob will retry automatically
  }
}

// Also handle subscription state changes from Paymob:
// If Paymob sends subscription state = "suspended" → set our status = "suspended"
// If Paymob sends subscription state = "canceled" → set our status = "cancelled"
```

### Mapping Teacher to Paymob Subscription

When creating the intention, use `special_reference` to pass the teacher's Convex ID:
```json
{
  "special_reference": "teacher_<teacherConvexId>"
}
```
This comes back in the webhook as `merchant_order_id`, allowing us to link the subscription to the right teacher.

---

## Dashboard UX

### Banner System (shown at top of dashboard)

| Subscription State | Banner |
|---|---|
| `unsubscribed` (< 30 days) | "Your storefront is in draft mode. Subscribe to go live." **[Subscribe]** |
| `unsubscribed` (30-60 days) | "Subscribe within {X} days. After that, uploaded videos will be removed to free up resources." **[Subscribe]** |
| `unsubscribed` (60+ days, videos cleaned) | "Your videos have been removed. Subscribe and re-upload to go live." **[Subscribe]** |
| `past_due` | "Your last payment failed. Update your payment method to avoid service interruption." **[Fix Payment]** |
| `suspended` | "Your account is suspended due to unpaid invoices. Pay now to restore access." **[Pay Now]** |
| `cancelled` | "Your subscription has been cancelled. Resubscribe to go live again." **[Resubscribe]** |

### Payments Page (`/dashboard/payments`)

#### When Unsubscribed

```
┌─────────────────────────────────────────────────────────┐
│  Subscribe to Korsify                                    │
│                                                          │
│  500 EGP/month base fee                                  │
│  + usage-based video playback fees (coming soon)         │
│                                                          │
│  What you get:                                           │
│  - Your storefront goes live at {subdomain}.korsify.com  │
│  - Students can browse and enroll in your courses        │
│  - Access to all platform features                       │
│                                                          │
│  [Add Payment Method & Subscribe]                        │
│                                                          │
│  A 1 EGP verification charge will be made to register    │
│  your card. Your first 500 EGP charge will occur 30      │
│  days after subscribing.                                 │
└─────────────────────────────────────────────────────────┘
```

#### When Subscribed (Active)

```
┌─────────────────────────────────────────────────────────┐
│  Subscription                                            │
│                                                          │
│  Status: Active                                          │
│  Next billing: March 1, 2026 — 500 EGP                   │
├──────────────────────────────────────────────────────────┤
│  Payment History                                         │
│                                                          │
│  Mar 2026    500 EGP    Paid    ✓                        │
│  Feb 2026    500 EGP    Paid    ✓                        │
│  Jan 2026    500 EGP    Paid    ✓                        │
├──────────────────────────────────────────────────────────┤
│  [Cancel Subscription]                                   │
└─────────────────────────────────────────────────────────┘
```

**Note**: Card management (change card, add secondary card) is not natively supported by Paymob's subscription module. To change cards, the teacher must cancel and resubscribe. This is a Paymob limitation — we can revisit if they add card update APIs later.

---

## Storefront Gating (Minimal)

The storefront (`/storefront/[subdomain]`) must check subscription status:

| Teacher status | Storefront behavior |
|---|---|
| `unsubscribed` | Show "Coming Soon" page. Students cannot access. |
| `active` | Fully accessible |
| `past_due` | Fully accessible (grace period while Paymob retries) |
| `suspended` | Show "This storefront is temporarily unavailable" |

This is enforced at the storefront layout level, not per-page.

---

## File Structure (Minimal)

```
convex/
├── billing/
│   ├── queries.ts             # getSubscriptionStatus
│   └── mutations.ts           # updateSubscriptionFromWebhook
│
├── paymob/
│   ├── actions.ts             # createSubscription (Intention API call)
│   └── internal.ts            # verifyWebhook, processWebhookEvent
│
├── http.ts                    # /paymob-subscription-webhook route

app/[locale]/(main)/dashboard/
├── _components/
│   └── subscription-banner.tsx       # Top banner based on status
├── payments/
│   ├── page.tsx                      # Main payments page
│   ├── callback/
│   │   └── page.tsx                  # Paymob redirect callback
│   └── _components/
│       ├── subscribe-card.tsx        # Unsubscribed state
│       ├── subscription-status.tsx   # Active state header
│       └── payment-history.tsx       # Past transactions list (optional)
```

---

## Implementation Phases (Minimal)

### Phase 1: Schema & Foundation
- [ ] Add subscription fields to `teachers` table
- [ ] Add `onboardingCompletedAt` to teachers table

### Phase 2: Paymob Integration
- [ ] Set up all Paymob env variables in Convex
- [ ] Create the subscription plan on Paymob (one-time, store plan ID)
- [ ] Build `paymob/actions.ts` — `createSubscription` (Intention API call)
- [ ] Build webhook handler in `http.ts` with HMAC verification
- [ ] Build `paymob/internal.ts` — process webhook events, update DB

### Phase 3: Subscription Flow
- [ ] Build subscribe action (creates intention, returns checkout URL)
- [ ] Handle webhook: set `teachers.subscriptionStatus` + `subscriptionId`
- [ ] Handle webhook: update status on recurring charge success/failure
- [ ] Handle webhook: mark suspended when Paymob exhausts retries

### Phase 4: Mux Cleanup Cron (Optional)
- [ ] Create daily cleanup cron
- [ ] Find unsubscribed teachers past 60-day window
- [ ] Find suspended teachers past 30-day window
- [ ] Delete Mux assets via API, update lessons to `mux_removed`

### Phase 5: Dashboard UI
- [ ] Build subscription banner component (all states)
- [ ] Build payments page (unsubscribed view + subscribed view)
- [ ] Build Paymob callback page (success/failure redirect handling)
- [ ] (Optional) Build payment history list

### Phase 6: Storefront Gating
- [ ] Add subscription check to storefront layout
- [ ] Build "coming soon" / "unavailable" pages
- [ ] Ensure `past_due` teachers' storefronts stay live

### Phase 7: Polish
- [ ] Arabic translations for all billing UI
- [ ] Error handling (Paymob API failures, webhook edge cases)
- [ ] Mobile responsiveness for payments page
