import { db } from "@/db";
import {
  vehicle_storage,
  storage_locations,
  vehicles,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getVehicleStorage(vehicleId: string) {
  return db
    .select()
    .from(vehicle_storage)
    .leftJoin(
      storage_locations,
      eq(vehicle_storage.location_id, storage_locations.id),
    )
    .where(eq(vehicle_storage.vehicle_id, vehicleId));
}

export async function getVehicleStorageById(id: string) {
  const result = await db
    .select()
    .from(vehicle_storage)
    .leftJoin(
      storage_locations,
      eq(vehicle_storage.location_id, storage_locations.id),
    )
    .where(eq(vehicle_storage.id, id))
    .limit(1);
  return result[0] || null;
}
