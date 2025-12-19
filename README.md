# Korsify

A Shopify-like platform for secure course selling. Korsify enables teachers to create their own branded storefronts with custom subdomains, sell courses with video lessons, and manage students with secure, watermarked video delivery.

## Development

### Getting Started

1. **Install dependencies**

```bash
bun install
```

2. **Set up Convex**

```bash
# Login to Convex (first time only)
bunx convex login

# Initialize Convex dev server (creates .env.local with CONVEX_URL)
bunx convex dev
```

3. **Run the Next.js dev server** (in a separate terminal)

```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.


## MVP Todo

### Teacher Onboarding

- [ ] Teacher signup & subdomain provisioning (`teachername.yoursite.com`)
- [ ] Teacher branding (logo, primary color, cover image)

### Course Management

- [ ] Course creation (title, price, description, thumbnail)
- [ ] Lesson upload (video + PDF)
- [ ] Bunny.net integration for HLS video streaming

### Secure Video Player

- [ ] Watermarked video player (dynamic watermark: student name/phone + timestamp)
- [ ] Secure media delivery (HLS + disabled downloads/right-click protections)

### Student Management

- [ ] Student signup (name + phone + email)
- [ ] Student management list (name, phone, enrolled courses, status)
- [ ] Manual student add/override (teacher can grant access without payment)
- [ ] Block/ban student action (revoke access)

### Payment & Access Control

- [ ] Checkout flow with manual-payment option (show payment instructions: Vodafone Cash / InstaPay)
- [ ] Receipt upload & pending-payment queue (student uploads screenshot)
- [ ] Teacher approval UI (view receipt → Approve / Reject → grant access)
- [ ] Access control (locked lessons until approved; instant unlock on approve)

### Analytics

- [ ] Basic analytics/dashboard (pending payments, active students, revenue total)
