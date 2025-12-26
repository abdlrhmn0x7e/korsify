import { tokensDAL, tokensTable } from "./tokens";

const db = {
  tokens: tokensDAL,
};

const tables = {
  tokens: tokensTable,
};

export { tables, db };
