import {
  mysqlTable,
  varchar,
  int,
  date,
  text,
  timestamp,
  mysqlEnum,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { clients } from "./clients";

export const tariffPlans = mysqlTable(
  "tariff_plans",
  {
    id: int().primaryKey().autoincrement(),
    client_id: int().notNull(),
    name: varchar({ length: 255 }).notNull(),
    valid_from: date().notNull(),
    valid_to: date(),
    status: mysqlEnum("status", ["Active", "Archived"]).default("Active"),
    description: text(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().onUpdateNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.client_id],
      foreignColumns: [clients.id],
    }),
  ],
);
