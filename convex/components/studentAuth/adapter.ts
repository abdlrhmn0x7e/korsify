import { createApi } from "@convex-dev/better-auth";
import schema from "./schema";
import { createStudentAuthOptions } from "../../studentAuth";

export const {
  create,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} = createApi(schema, createStudentAuthOptions);
