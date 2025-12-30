import { accessTokensDAL, accessTokensTable } from "./accessTokens";
import { earlyAccessRequestsDAL, earlyAccessRequestsTable } from "./requests";
import { teachersDAL, teachersTable } from "./teachers";
import { coursesDAL, coursesTable } from "./courses";
import { sectionsDAL, sectionsTable } from "./sections";
import { lessonsDAL, lessonsTable } from "./lessons";

const db = {
  accessTokens: accessTokensDAL,
  earlyAccessRequests: earlyAccessRequestsDAL,
  teachers: teachersDAL,
  courses: coursesDAL,
  sections: sectionsDAL,
  lessons: lessonsDAL,
};

const tables = {
  accessTokens: accessTokensTable,
  earlyAccessRequests: earlyAccessRequestsTable,
  teachers: teachersTable,
  courses: coursesTable,
  sections: sectionsTable,
  lessons: lessonsTable,
};

export { tables, db };
