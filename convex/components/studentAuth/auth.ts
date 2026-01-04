import { createStudentAuth } from "../../studentAuth";

// Export a static instance for Better Auth schema generation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const auth = createStudentAuth({} as any);
