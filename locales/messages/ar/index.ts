import { auth } from "./auth";
import { dashboard } from "./dashboard";
import { landing, notFound, globalError } from "./landing";
import { onboarding } from "./onboarding";

export default { auth, dashboard, landing, notFound, globalError, onboarding } as const;
