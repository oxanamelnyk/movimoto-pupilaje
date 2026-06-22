import { mysqlTable, varchar, int, date, timestamp } from "drizzle-orm/mysql-core";

export const vehicle_storage = mysqlTable("vehicle_storage", {
  id: int().primaryKey().autoincrement(),
  vehicle_id: int().notNull(),
  location_id: int(),
  entry_date: date().notNull(),
  exit_date: date(),
  delivery_place: varchar({ length: 255 }),
  created_at: timestamp().defaultNow(),
});
