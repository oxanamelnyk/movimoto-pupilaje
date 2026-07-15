import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const clients = mysqlTable("clients", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 50 }),
  email: varchar({ length: 255 }),
  status: mysqlEnum("status", ["Active", "Inactive"]).default("Active"),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow().onUpdateNow(),
});
