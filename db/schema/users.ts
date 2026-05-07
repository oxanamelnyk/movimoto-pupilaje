import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar({ length: 255 }).primaryKey(),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }),
  email_verified: timestamp(),
  image: varchar({ length: 255 }),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow().onUpdateNow(),
});
