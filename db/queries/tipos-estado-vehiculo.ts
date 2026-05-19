import { db } from "@/lib/db";
import { tipos_estado_vehiculo } from "@/db/schema";

export async function getEstadoVehiculo() {
  return await db
    .select({
      id: tipos_estado_vehiculo.id_tipo_estado_vehiculo,
      nombre: tipos_estado_vehiculo.nombre_estado_vehiculo,
    })
    .from(tipos_estado_vehiculo)
    .orderBy(tipos_estado_vehiculo.id_tipo_estado_vehiculo);
}
