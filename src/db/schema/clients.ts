import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

export const clients = mysqlTable("clients", {
  id: varchar({ length: 255 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
});
