export const payments = {
  title: "Payments & Subscription",
  plan: {
    title: "Plan",
    description: "Quick view of your current plan and account limits.",
    current: "Current",
    free: "Free",
    pro: "Pro",
    table: {
      free: {
        courses: "Up to 3 courses",
        uploads: "YouTube links only",
      },
      pro: {
        courses: "Unlimited courses",
        uploads: "Video uploads with hosting",
      },
    },
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
    highlight: "Billing is monthly and renews automatically while active.",
    storageNotice:
      "If your subscription is canceled or remains inactive, hosted videos are scheduled for deletion after 30 days.",
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
        deletion:
          "Hosted videos are deleted 30 days after cancellation or prolonged inactive status.",
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
      "Your subscription is inactive. If it stays inactive, your hosted videos will be deleted after 30 days.",
  },
  card: {
    title: "Payment Method",
    endingIn: "ending in {pan}",
    noCard: "No card on file",
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
    description: "End your subscription and move back to the free plan.",
    warning:
      "After cancellation or inactive status, hosted videos are deleted after 30 days.",
    cta: "Cancel Subscription",
    confirmDescription:
      "This action is permanent. You will move to the free plan, and hosted videos are deleted after 30 days.",
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
