import { defineApp } from "convex/server";
import betterAuth from "./components/betterAuth/convex.config";

const app = defineApp();
app.use(betterAuth);

export default app;
