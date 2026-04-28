import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  decimal,
} from "drizzle-orm/mysql-core";

// Example schema - uncomment and modify as needed
/*
export const invoices = mysqlTable("invoices", {
  id: int().primaryKey().autoincrement(),
  number: varchar({ length: 50 }).notNull().unique(),
  clientId: int().notNull(),
  amount: decimal({ precision: 10, scale: 2 }).notNull(),
  status: varchar({ length: 20 }).notNull().default("draft"),
  description: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().onUpdateNow(),
});

export const clients = mysqlTable("clients", {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }),
  phone: varchar({ length: 20 }),
  address: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().onUpdateNow(),
});
*/
