import {
  mysqlTable,
  varchar,
  decimal,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";

export const pricing_tiers = mysqlTable("pricing_tiers", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }).notNull().unique(),
  daily_rate: decimal({ precision: 10, scale: 2 }).notNull(), // €/day
  handling_in_out: decimal({ precision: 10, scale: 2 }).notNull(), // €
  disassembly_without_wheels: decimal({ precision: 10, scale: 2 }).notNull(), // €
  disassembly_with_wheels: decimal({ precision: 10, scale: 2 }).notNull(), // €
  waste_disposal: decimal({ precision: 10, scale: 2 }).notNull(), // €
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow().onUpdateNow(),
});

export const invoices = mysqlTable("invoices", {
  id: varchar({ length: 255 }).primaryKey(),
  client_id: int().notNull(),
  invoice_number: varchar({ length: 50 }).notNull().unique(),
  invoice_date: varchar({ length: 10 }).notNull(), // YYYY-MM-DD
  period_type: varchar({ length: 20 }).notNull(), // "period" | "monthly"
  period_start: varchar({ length: 10 }).notNull(),
  period_end: varchar({ length: 10 }).notNull(),
  subtotal: decimal({ precision: 12, scale: 2 }).notNull(),
  tax_percentage: decimal({ precision: 5, scale: 2 }).default("21"), // VAT
  tax_amount: decimal({ precision: 12, scale: 2 }).notNull(),
  total: decimal({ precision: 12, scale: 2 }).notNull(),
  notes: varchar({ length: 500 }),
  status: varchar({ length: 20 }).default("draft"), // draft, issued, paid, cancelled
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow().onUpdateNow(),
});

export const invoice_items = mysqlTable("invoice_items", {
  id: varchar({ length: 255 }).primaryKey(),
  invoice_id: varchar({ length: 255 }).notNull(),
  vehicle_id: int().notNull(),
  registration_identity: varchar({ length: 50 }),
  description: varchar({ length: 255 }).notNull(),
  quantity: decimal({ precision: 10, scale: 2 }).notNull(), // days or count
  unit_price: decimal({ precision: 10, scale: 2 }).notNull(),
  amount: decimal({ precision: 12, scale: 2 }).notNull(), // quantity * unit_price
  created_at: timestamp().defaultNow(),
});
