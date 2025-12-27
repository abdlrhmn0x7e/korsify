export const notFound = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has been moved.",
  goBack: "Go back",
  goHome: "Go home",
} as const;

export const globalError = {
  title: "Something went wrong",
  description: "An unexpected error occurred. Please try again.",
  tryAgain: "Try again",
  goHome: "Go home",
} as const;

export const landing = {
  badge: "We're onboarding a limited number of teachers.",
  headline: {
    prefix: "Professional websites for",
    highlight: "Teachers",
    suffix: "selling online",
  },
  subheadline:
    "Create your own branded site for videos, PDFs, and quizzes. Reach more students and sell with confidence without relying on Telegram or WhatsApp.",
  whoItsFor:
    "Built for teachers who already sell online and want a more professional, reliable setup.",
  cta: {
    placeholder: "Your phone number",
    button: "Request Early Access",
    sent: "Sent",
    hint: "We'll contact you on your phone number.",
  },
  navbar: {
    login: "Log In",
    signup: "Sign Up",
    dashboard: "Dashboard",
    admin: "Admin Panel",
  },
  footer: {
    copyright: "© {year} Korsify, All rights reserved.",
  },
  logo: {
    alt: "Korsify",
    text: "Korsify",
  },
} as const;
