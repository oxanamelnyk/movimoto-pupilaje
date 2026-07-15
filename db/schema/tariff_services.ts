import {
  mysqlTable,
  varchar,
  int,
  decimal,
  timestamp,
  mysqlEnum,
  foreignKey,
} from "drizzle-orm/mysql-core";
import { tariffPlans } from "./tariff_plans";

export const tariffServices = mysqlTable(
  "tariff_services",
  {
    id: int().primaryKey().autoincrement(),
    tariff_id: int().notNull(),
    name: varchar({ length: 255 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).default("0.00"),
    unit: varchar({ length: 50 }).notNull(),
    type: mysqlEnum("type", ["Fixed", "Variable"]).default("Fixed"),
    discount: decimal("discount", { precision: 5, scale: 2 }),
    category: mysqlEnum("category", ["Delivery", "Storage"]).notNull(),
    created_at: timestamp().defaultNow(),
    updated_at: timestamp().defaultNow().onUpdateNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.tariff_id],
      foreignColumns: [tariffPlans.id],
    }),
  ],
);
