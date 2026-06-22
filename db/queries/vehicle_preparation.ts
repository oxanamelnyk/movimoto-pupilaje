import { db } from "@/db";
import {
  vehicle_preparation,
  preparation_types,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getVehiclePreparation(vehicleId: string) {
  return db
    .select()
    .from(vehicle_preparation)
    .leftJoin(
      preparation_types,
      eq(vehicle_preparation.preparation_type_id, preparation_types.id),
    )
    .where(eq(vehicle_preparation.vehicle_id, vehicleId));
}

export async function getVehiclePreparationById(id: string) {
  const result = await db
    .select()
    .from(vehicle_preparation)
    .leftJoin(
      preparation_types,
      eq(vehicle_preparation.preparation_type_id, preparation_types.id),
    )
    .where(eq(vehicle_preparation.id, id))
    .limit(1);
  return result[0] || null;
}
