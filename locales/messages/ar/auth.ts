export const auth = {
  layout: {
    terms:
      "بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية الخاصة بـ Korsify",
  },
  login: {
    title: "تسجيل الدخول إلى حسابك في كورسيفاي",
    noAccount: "ليس لديك حساب؟",
    requestEarlyAccess: "اطلب حسابك",
    withGoogle: "تسجيل الدخول باستخدام Google",
  },
  signup: {
    title: "إنشاء حساب Korsify الخاص بك",
    hasAccount: "لديك حساب بالفعل؟",
    login: "تسجيل الدخول",
    withGoogle: "المتابعة باستخدام Google",
  },
  redirect: {
    verifying: {
      title: "جاري التحقق من رمز الوصول",
      description:
        "يرجى الانتظار بينما نتحقق من رمز الوصول الخاص بك. لا تقم بتحديث الصفحة.",
    },
    error: {
      title: "حدث خطأ ما!",
      description: "يرجى المحاولة مرة أخرى لاحقًا.",
      goHome: "الرئيسية",
    },
  },
} as const;
