import { v, ConvexError } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY!;
const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY!;
const PAYMOB_INTEGRATION_ID = Number(process.env.PAYMOB_INTEGRATION_ID!);

const PAYMOB_API_URL = "https://accept.paymob.com/api";
const PAYMOB_REDIRECTION_URL = `${process.env.SITE_URL!}/dashboard/payments/redirect`;
const PAYMOB_SUBSCRIPTION_WEBHOOK_URL =
  "https://grand-rabbit-635.convex.site/paymob-subscription-webhook";
const PAYMOB_INTENTION_WEBHOOK_URL =
  "https://grand-rabbit-635.convex.site/paymob-intention-webhook";

const AMOUNT_CENTS = 50000; // 500 EGP
const PLAN_FREQUENCY = 30; // Monthly
const REMINDER_DAYS = 3;
const RETRIAL_DAYS = 7;

export const checkout = action({
  args: {},
  returns: v.object({
    clientSecret: v.string(),
  }),
  handler: async (ctx) => {
    const teacher = await ctx.runQuery(api.teachers.queries.getTeacher, {});

    if (!teacher) {
      throw new ConvexError("Teacher not found");
    }

    // 1. Get auth token
    const authToken = await getPaymobAuthToken();

    // 2. Create a subscription plan for this teacher
    const planId = await createSubscriptionPlan({
      teacher: {
        id: teacher._id,
        name: teacher.name,
      },
      authToken,
    });

    // 3. Create an intention with the new plan
    const [firstName, ...lastParts] = teacher.name.split(" ");
    const lastName = lastParts.join(" ") || firstName;

    const response = await fetch("https://accept.paymob.com/v1/intention/", {
      method: "POST",
      headers: {
        Authorization: `Token ${PAYMOB_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 100,
        currency: "EGP",
        payment_methods: [PAYMOB_INTEGRATION_ID],
        subscription_plan_id: planId,
        items: [
          {
            name: "Card Validation Fees",
            amount: 100,
          },
        ],
        billing_data: {
          first_name: firstName,
          last_name: lastName,
          phone_number: teacher.phone || "NA",
          email: teacher.email,
        },
        extras: {
          teacherId: teacher._id,
        },
        notification_url: PAYMOB_INTENTION_WEBHOOK_URL,
        redirection_url: PAYMOB_REDIRECTION_URL,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Paymob intention API error:", errorText);
      throw new ConvexError("Failed to create subscription checkout");
    }

    const data = await response.json();
    const clientSecret = data.client_secret as string;

    return { clientSecret };
  },
});

async function getPaymobAuthToken() {
  const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });

  if (!response.ok) {
    throw new ConvexError("Failed to get Paymob auth token");
  }

  const data = await response.json();
  return data.token as string;
}

export const cancelSubscription = action({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const teacher = await ctx.runQuery(api.teachers.queries.getTeacher, {});
    if (!teacher) {
      throw new ConvexError("Teacher not found");
    }

    const subscription = await ctx.runQuery(
      api.teachers.subscriptions.queries.get,
      {}
    );
    if (!subscription) {
      throw new ConvexError("No active subscription found");
    }

    // Cancel the subscription on Paymob
    const authToken = await getPaymobAuthToken();

    const response = await fetch(
      `${PAYMOB_API_URL}/acceptance/subscriptions/${subscription.paymobSubscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Paymob cancel subscription error:", errorText);
      throw new ConvexError("Failed to cancel subscription");
    }

    // Remove subscription from DB (cancellation is permanent)
    await ctx.runMutation(internal.teachers.subscriptions.mutations.remove, {
      subscriptionId: subscription._id,
    });

    return null;
  },
});

async function createSubscriptionPlan({
  teacher,
  authToken,
}: {
  teacher: {
    id: Id<"teachers">;
    name: string;
  };
  authToken: string;
}) {
  const response = await fetch(
    "https://accept.paymob.com/api/acceptance/subscription-plans",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frequency: PLAN_FREQUENCY,
        name: `${teacher.name}-${teacher.id}`,
        reminder_days: REMINDER_DAYS,
        retrial_days: RETRIAL_DAYS,
        plan_type: "rent",
        number_of_deductions: null,
        amount_cents: AMOUNT_CENTS,
        use_transaction_amount: false,
        is_active: true,
        integration: PAYMOB_INTEGRATION_ID,
        webhook_url: PAYMOB_SUBSCRIPTION_WEBHOOK_URL,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Paymob create plan error:", errorText);
    throw new ConvexError("Failed to create subscription plan");
  }

  const data = await response.json();
  return data.id as number;
}
