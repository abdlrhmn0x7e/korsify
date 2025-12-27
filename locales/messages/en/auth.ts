export const auth = {
  layout: {
    terms: "By continuing, you agree to Korsify's Terms of Service and Privacy Policy",
  },
  login: {
    title: "Log in to your Korsify account",
    noAccount: "Don't have an account?",
    requestEarlyAccess: "Request early access",
    withGoogle: "Log in with Google",
  },
  signup: {
    title: "Create your Korsify account",
    hasAccount: "Already have an account?",
    login: "Log in",
    withGoogle: "Continue with Google",
  },
  redirect: {
    verifying: {
      title: "Verifying your access token",
      description: "Please wait while we verify your access token. Do not refresh the page.",
    },
    error: {
      title: "Something went wrong!",
      description: "Please try again later.",
      goHome: "Go home",
    },
  },
} as const;
