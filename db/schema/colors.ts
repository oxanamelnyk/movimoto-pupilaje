import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const colors = mysqlTable("colors", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 50 }).notNull().unique(),
});
