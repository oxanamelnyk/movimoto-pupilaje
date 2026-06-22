import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

export const locations = mysqlTable("locations", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
});
