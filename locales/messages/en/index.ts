import { auth } from "./auth";
import { landing, notFound, globalError } from "./landing";

export default { auth, landing, notFound, globalError } as const;
