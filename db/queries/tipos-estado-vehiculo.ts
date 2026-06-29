import { query } from "@/db";

export async function getEstadoVehiculo() {
  const sql = "SELECT id_tipo_estado_vehiculo as id, nombre_estado_vehiculo as nombre FROM tipos_estado_vehiculo ORDER BY id_tipo_estado_vehiculo";
  return query(sql);
}
