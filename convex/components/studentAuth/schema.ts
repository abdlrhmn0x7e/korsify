import { defineSchema } from "convex/server";
import { tables } from "./generatedSchema";

const schema = defineSchema({
  ...tables,

  user: tables.user
    .index("by_teacherId", ["teacherId"])
    .index("by_teacherId_email", ["teacherId", "email"]),
});

export default schema;
