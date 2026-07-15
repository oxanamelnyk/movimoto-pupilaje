import {
  mysqlTable,
  varchar,
  int,
  text,
  timestamp,
} from "drizzle-orm/mysql-core";

export const vehicles = mysqlTable("vehicles", {
  id: int().primaryKey().autoincrement(),
  client_id: int(),
  brand_id: int().notNull(),
  model_id: int().notNull(),
  color_id: int(),
  status_id: int().notNull(),
  identifier: varchar({ length: 50 }),
  notes: text(),
  registration_identity: varchar({ length: 255 }),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow().onUpdateNow(),
});
