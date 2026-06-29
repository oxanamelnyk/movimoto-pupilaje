import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const vehicle_statuses = mysqlTable("vehicle_statuses", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull().unique(),
});
