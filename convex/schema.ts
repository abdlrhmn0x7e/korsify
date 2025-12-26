import { defineSchema } from "convex/server";
import { tables } from "./db";

export default defineSchema({
  ...tables,
});
