import { mysqlTable, varchar, int, text, timestamp } from "drizzle-orm/mysql-core";

export const vehicles = mysqlTable("vehicles", {
  id: int().primaryKey().autoincrement(),
  client_id: int(),
  brand_id: int(),
  model_id: int(),
  color_id: int(),
  status_id: int(),
  vin: varchar({ length: 50 }),
  plate_number: varchar({ length: 50 }),
  notes: text(),
  created_at: timestamp().defaultNow(),
});
