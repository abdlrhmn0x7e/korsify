import { accessTokensDAL, accessTokensTable } from "./accessTokens";
import { earlyAccessRequestsDAL, earlyAccessRequestsTable } from "./requests";
import { teachersDAL, teachersTable } from "./teachers";

const db = {
  accessTokens: accessTokensDAL,
  earlyAccessRequests: earlyAccessRequestsDAL,
  teachers: teachersDAL,
};

const tables = {
  accessTokens: accessTokensTable,
  earlyAccessRequests: earlyAccessRequestsTable,
  teachers: teachersTable,
};

export { tables, db };
