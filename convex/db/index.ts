import { accessTokensDAL, accessTokensTable } from "./accessTokens";
import { earlyAccessRequestsDAL, earlyAccessRequestsTable } from "./requests";
import { teachersDAL, teachersTable } from "./teachers";
import { coursesDAL, coursesTable } from "./courses";

const db = {
  accessTokens: accessTokensDAL,
  earlyAccessRequests: earlyAccessRequestsDAL,
  teachers: teachersDAL,
  courses: coursesDAL,
};

const tables = {
  accessTokens: accessTokensTable,
  earlyAccessRequests: earlyAccessRequestsTable,
  teachers: teachersTable,
  courses: coursesTable,
};

export { tables, db };
