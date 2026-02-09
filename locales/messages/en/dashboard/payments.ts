export const payments = {
  title: "Payments & Subscription",
  plan: {
    currentPlan: "Current Plan",
    free: "Free",
    pro: "Pro",
    limits: {
      maxCourses: "Max Courses",
      unlimited: "Unlimited",
      muxHosting: "Video Uploads",
      enabled: "Enabled",
      disabled: "YouTube only",
    },
    usage: {
      courses: "{count} / {max} courses used",
      coursesUnlimited: "{count} courses",
    },
  },
  subscribe: {
    title: "Upgrade to Pro",
    description:
      "Unlock unlimited courses, video uploads, and more for 500 EGP/month.",
    cta: "Subscribe Now",
    termsDialog: {
      title: "Terms & Conditions",
      description:
        "Please review and accept the following terms before proceeding.",
      terms: {
        billing:
          "You will be charged 500 EGP monthly. A 1 EGP card validation fee applies at checkout.",
        renewal:
          "Your subscription renews automatically each billing cycle unless cancelled.",
        cancellation:
          "You can cancel anytime. Cancellation is permanent and cannot be reversed.",
        refund: "No refunds are provided for partial billing periods.",
        downgrade:
          "Upon cancellation, your plan reverts to the free tier at the end of the current period.",
      },
      accept: "I Accept",
      cancel: "Cancel",
    },
  },
  subscription: {
    title: "Subscription",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    nextBilling: "Next Billing",
    lastRenewal: "Last Renewal",
    amount: "500 EGP / month",
    inactiveWarning:
      "Your subscription is inactive. Your plan will revert to the free tier. Please update your payment method or contact support.",
  },
  card: {
    title: "Payment Method",
    endingIn: "ending in {pan}",
    noCard: "No card on file",
  },
  transactions: {
    title: "Transaction History",
    empty: "No transactions yet",
    headers: {
      date: "Date",
      amount: "Amount",
      status: "Status",
      card: "Card",
    },
    status: {
      success: "Paid",
      pending: "Pending",
      failed: "Failed",
      refunded: "Refunded",
      voided: "Voided",
    },
  },
  billing: {
    title: "Billing Breakdown",
    base: "Base Subscription",
    course: "{title}",
    minutes: "{count} min",
    total: "Total",
    noExtras: "No video hosting charges",
  },
  cancel: {
    title: "Cancel Subscription",
    description:
      "Are you sure you want to cancel? This action is permanent and cannot be reversed.",
    cta: "Cancel Subscription",
    confirm: "Yes, Cancel",
    back: "Keep Subscription",
    success: "Subscription cancelled successfully",
  },
  redirect: {
    success: {
      title: "You're all set",
      description: "Your subscription is now active. Welcome to Pro.",
      cta: "Go to Dashboard",
    },
    failed: {
      title: "Payment failed",
      description:
        "Something went wrong with your payment. No charges were made.",
      cta: "Try Again",
    },
    card: "Visa ending in {pan}",
    amount: "{amount} {currency}",
    transactionId: "Transaction #{id}",
  },
  loading: "Loading subscription details...",
  error: "Failed to load subscription details",
} as const;
