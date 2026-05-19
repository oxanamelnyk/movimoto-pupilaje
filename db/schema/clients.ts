import {
  mysqlTable,
  varchar,
  int,
  boolean,
  date,
  text,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const clients = mysqlTable("clientes", {
  id_cliente: int().primaryKey().autoincrement(),
  tipo_cliente: mysqlEnum("tipo_cliente", ["empresa", "particular"]).notNull(),
  nombre_comercial: varchar({ length: 50 }),
  nombre_fiscal: varchar({ length: 50 }),
  dni_nif: varchar({ length: 12 }),
  email: varchar({ length: 75 }),
  telefono: varchar({ length: 20 }),
  notas: text(),
  calle: varchar({ length: 100 }),
  provincia: varchar({ length: 50 }),
  pais: varchar({ length: 50 }),
  codigo_postal: varchar({ length: 10 }),
  ciudad: varchar({ length: 50 }),
  fecha_registro: date(),
  ocultar_info_econ: boolean().notNull().default(true),
  es_pupilaje: boolean().notNull().default(false),
});
