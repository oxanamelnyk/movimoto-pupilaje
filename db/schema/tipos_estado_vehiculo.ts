import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";

export const tipos_estado_vehiculo = mysqlTable("tipos_estado_vehiculo", {
  id_tipo_estado_vehiculo: int().primaryKey().autoincrement(),
  nombre_estado_vehiculo: varchar({ length: 50 }).notNull(),
});
