import {
  mysqlTable,
  varchar,
  timestamp,
  date,
  text,
} from "drizzle-orm/mysql-core";
import { vehicles } from "./vehicles";
import { locations } from "./locations";

export const vehicle_storage_records = mysqlTable("vehicle_storage_records", {
  id: varchar({ length: 255 }).primaryKey(),
  vehicle_id: varchar({ length: 255 })
    .notNull()
    .references(() => vehicles.id),
  status: varchar({ length: 255 }).notNull(),
  entry_date: date().notNull(),
  exit_date: date(),
  location_id: varchar({ length: 255 })
    .notNull()
    .references(() => locations.id),
  destination: varchar({ length: 255 }),
  request_date: date(),
  requested_by: varchar({ length: 255 }),
  unpacking_date: date(),
  unpacking_type: varchar({ length: 255 }),
  notes: text(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow().onUpdateNow(),
});
