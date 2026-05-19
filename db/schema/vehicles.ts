import { mysqlTable, varchar, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { clients } from "./clients";

export const vehicles = mysqlTable("vehicles", {
  id: varchar({ length: 255 }).primaryKey(),
  client_id: varchar({ length: 255 })
    .notNull()
    .references(() => clients.id),
  brand: varchar({ length: 255 }).notNull(),
  model: varchar({ length: 255 }).notNull(),
  vin_or_plate: varchar({ length: 255 }).notNull(),
  color: varchar({ length: 255 }),
  estado: mysqlEnum(["entrega", "preparacion", "salida"]).default("preparacion"),
  created_at: timestamp().defaultNow(),
});
