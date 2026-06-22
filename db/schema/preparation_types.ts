import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const preparation_types = mysqlTable("preparation_types", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull().unique(),
});
