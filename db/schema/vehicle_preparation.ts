import { mysqlTable, varchar, int, date, timestamp } from "drizzle-orm/mysql-core";

export const vehicle_preparation = mysqlTable("vehicle_preparation", {
  id: int().primaryKey().autoincrement(),
  vehicle_id: int().notNull(),
  request_date: date(),
  requested_by: varchar({ length: 150 }),
  preparation_date: date(),
  preparation_type_id: int(),
  created_at: timestamp().defaultNow(),
});
