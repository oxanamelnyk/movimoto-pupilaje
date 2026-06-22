import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const models = mysqlTable("models", {
  id: int().primaryKey().autoincrement(),
  brand_id: int().notNull(),
  name: varchar({ length: 100 }).notNull(),
});
