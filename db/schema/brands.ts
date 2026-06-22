import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const brands = mysqlTable("brands", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull().unique(),
});
