export const storefront = {
  auth: {
    login: {
      title: "Log in to your account",
      phoneNumber: "Phone Number",
      password: "Password",
      submit: "Log in",
      success: "Logged in successfully",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      errors: {
        phoneRequired: "Phone number is required",
        invalidPhone: "Please enter a valid phone number",
        passwordRequired: "Password is required",
      },
    },
    signup: {
      title: "Create your account",
      phoneNumber: "Phone Number",
      name: "Full Name",
      password: "Password",
      confirmPassword: "Confirm Password",
      createAccount: "Create account",
      success: "Account created successfully",
      hasAccount: "Already have an account?",
      login: "Log in",
      errors: {
        phoneRequired: "Phone number is required",
        invalidPhone: "Please enter a valid phone number",
        nameRequired: "Name is required",
        passwordRequired: "Password is required",
        confirmPasswordRequired: "Please confirm your password",
        passwordMismatch: "Passwords do not match",
      },
    },
  },
} as const;
