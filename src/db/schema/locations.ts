import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

export const locations = mysqlTable("locations", {
  id: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
});
