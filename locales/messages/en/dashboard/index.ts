import { courses } from "./courses";
import { payments } from "./payments";
import { settings } from "./settings";

export const dashboard = {
  sidebar: {
    title: "Dashboard",
    home: "Home",
    courses: "Courses",
    students: "Students",
    payments: "Payments",
    storefront: "Storefront",
    settings: "Settings",
  },
  courses,
  payments,
  settings,
  home: {
    title: "Welcome back",
    description: "Here's an overview of your store",
    stats: {
      courses: "Courses",
      students: "Students",
      revenue: "Revenue",
      pendingPayments: "Pending Payments",
    },
    empty: {
      title: "Get started",
      description: "Create your first course to start selling",
      createCourse: "Create Course",
    },
  },
} as const;
