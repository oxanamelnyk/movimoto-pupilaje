import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const storage_locations = mysqlTable("storage_locations", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull().unique(),
});
