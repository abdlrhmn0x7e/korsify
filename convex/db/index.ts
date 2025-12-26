import { accessTokensDAL, accessTokensTable } from "./accessTokens";

const db = {
  accessTokens: accessTokensDAL,
};

const tables = {
  accessTokens: accessTokensTable,
};

export { tables, db };
