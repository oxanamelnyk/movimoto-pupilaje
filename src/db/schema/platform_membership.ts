import { mysqlTable, varchar, timestamp, int } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const platformMemberships = mysqlTable("platform_memberships", {
  id: int().autoincrement().primaryKey(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: varchar({ length: 50 }).notNull(), // 'ADMIN' or 'MANAGER'
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().onUpdateNow(),
});
