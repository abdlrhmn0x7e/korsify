import { defineApp } from "convex/server";
import betterAuth from "./components/betterAuth/convex.config";
import studentAuth from "./components/studentAuth/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(studentAuth);

export default app;
