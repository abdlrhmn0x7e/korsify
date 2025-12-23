import { defineSchema } from "convex/server";
import db from "./db";

export default defineSchema({
  tokens: db.admin.tokens.table,
});
