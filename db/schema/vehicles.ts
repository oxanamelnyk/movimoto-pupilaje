import { mysqlTable, varchar, int, text, timestamp } from "drizzle-orm/mysql-core";

export const vehicles = mysqlTable("vehicles", {
  id: int().primaryKey().autoincrement(),
  client_id: int(),
  brand_id: int().notNull(),
  model_id: int().notNull(),
  color_id: int(),
  status_id: int().notNull(),
  vin: varchar({ length: 255 }),
  plate_number: varchar({ length: 255 }),
  notes: varchar({ length: 1000 }),
  created_at: timestamp().defaultNow(),
});
