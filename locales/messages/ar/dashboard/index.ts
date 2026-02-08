import { courses } from "./courses";
import { payments } from "./payments";
import { settings } from "./settings";

export const dashboard = {
  sidebar: {
    title: "لوحة التحكم",
    home: "الرئيسية",
    courses: "الدورات",
    students: "الطلاب",
    payments: "المدفوعات",
    storefront: "المتجر",
    settings: "الإعدادات",
  },
  courses,
  payments,
  settings,
  home: {
    title: "مرحباً بعودتك",
    description: "إليك نظرة عامة على متجرك",
    stats: {
      courses: "الدورات",
      students: "الطلاب",
      revenue: "الإيرادات",
      pendingPayments: "المدفوعات المعلقة",
    },
    empty: {
      title: "ابدأ الآن",
      description: "أنشئ دورتك الأولى لبدء البيع",
      createCourse: "إنشاء دورة",
    },
  },
} as const;
