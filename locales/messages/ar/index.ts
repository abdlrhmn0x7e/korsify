import { auth } from "./auth";
import { dashboard } from "./dashboard/index";
import { landing, notFound, globalError } from "./landing";
import { onboarding } from "./onboarding";
import { components } from "./components";
import { storefront } from "./storefront";

export default {
  auth,
  dashboard,
  landing,
  notFound,
  globalError,
  onboarding,
  components,
  storefront,
} as const;
