export const storefront = {
  auth: {
    login: {
      title: "تسجيل الدخول إلى حسابك",
      phoneNumber: "رقم الهاتف",
      password: "كلمة المرور",
      submit: "تسجيل الدخول",
      success: "تم تسجيل الدخول بنجاح",
      noAccount: "ليس لديك حساب؟",
      signUp: "إنشاء حساب",
      errors: {
        phoneRequired: "رقم الهاتف مطلوب",
        invalidPhone: "يرجى إدخال رقم هاتف صحيح",
        passwordRequired: "كلمة المرور مطلوبة",
      },
    },
    signup: {
      title: "إنشاء حسابك",
      phoneNumber: "رقم الهاتف",
      name: "الاسم الكامل",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      createAccount: "إنشاء الحساب",
      success: "تم إنشاء الحساب بنجاح",
      hasAccount: "لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
      errors: {
        phoneRequired: "رقم الهاتف مطلوب",
        invalidPhone: "يرجى إدخال رقم هاتف صحيح",
        nameRequired: "الاسم مطلوب",
        passwordRequired: "كلمة المرور مطلوبة",
        confirmPasswordRequired: "يرجى تأكيد كلمة المرور",
        passwordMismatch: "كلمتا المرور غير متطابقتين",
      },
    },
  },
} as const;
