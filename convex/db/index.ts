import { accessTokensDAL, accessTokensTable } from "./accessTokens";
import { earlyAccessRequestsDAL, earlyAccessRequestsTable } from "./requests";

const db = {
  accessTokens: accessTokensDAL,
  earlyAccessRequests: earlyAccessRequestsDAL,
};

const tables = {
  accessTokens: accessTokensTable,
  earlyAccessRequests: earlyAccessRequestsTable,
};

export { tables, db };
