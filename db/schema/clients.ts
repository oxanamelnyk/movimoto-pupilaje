import {
  mysqlTable,
  varchar,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const clients = mysqlTable("clients", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 50 }),
  email: varchar({ length: 255 }),
  created_at: timestamp().defaultNow(),
});
