import { accessTokensDAL, accessTokensTable } from "./accessTokens";
import { earlyAccessRequestsDAL, earlyAccessRequestsTable } from "./requests";
import { teachersDAL, teachersTable } from "./teachers";
import { coursesDAL, coursesTable } from "./courses";
import { sectionsDAL, sectionsTable } from "./sections";
import { lessonsDAL, lessonsTable } from "./lessons";
import { muxAssetsDAL, muxAssetsTable } from "./muxAssets";
import { storefrontsDAL, storefrontsTable } from "./storefronts";
import { subscriptionsDAL, subscriptionsTable } from "./subscriptions";

const db = {
  accessTokens: accessTokensDAL,
  earlyAccessRequests: earlyAccessRequestsDAL,
  teachers: teachersDAL,
  courses: coursesDAL,
  sections: sectionsDAL,
  lessons: lessonsDAL,
  muxAssets: muxAssetsDAL,
  storefronts: storefrontsDAL,
  subscriptions: subscriptionsDAL,
};

const tables = {
  accessTokens: accessTokensTable,
  earlyAccessRequests: earlyAccessRequestsTable,
  teachers: teachersTable,
  courses: coursesTable,
  sections: sectionsTable,
  lessons: lessonsTable,
  muxAssets: muxAssetsTable,
  storefronts: storefrontsTable,
  subscriptions: subscriptionsTable,
};

export { tables, db };
