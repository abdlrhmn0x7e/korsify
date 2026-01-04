import { defineSchema } from "convex/server";
import { tables } from "./generatedSchema";

const schema = defineSchema({
  ...tables,

  user: tables.user
    .index("by_teacherId", ["teacherId"])
    .index("by_teacherId_email", ["teacherId", "email"]),

  session: tables.session
    .index("by_teacherId", ["teacherId"])
    .index("by_teacherId_token", ["teacherId", "token"]),

  account: tables.account.index("by_teacherId_providerId_accountId", [
    "teacherId",
    "providerId",
    "accountId",
  ]),
});

export default schema;
