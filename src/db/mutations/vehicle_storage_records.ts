import { db } from "@/db";
import { vehicle_storage_records } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  VehicleStorageRecordCreate,
  VehicleStorageRecordUpdate,
} from "@/validators/vehicle_storage_records";

export async function createVehicleStorageRecord(
  data: VehicleStorageRecordCreate,
) {
  const id = crypto.randomUUID();
  const result = await db
    .insert(vehicle_storage_records)
    .values({
      id,
      ...data,
    })
    .returning();
  return result[0];
}

export async function updateVehicleStorageRecord(
  id: string,
  data: VehicleStorageRecordUpdate,
) {
  const result = await db
    .update(vehicle_storage_records)
    .set(data)
    .where(eq(vehicle_storage_records.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteVehicleStorageRecord(id: string) {
  await db
    .delete(vehicle_storage_records)
    .where(eq(vehicle_storage_records.id, id));
}
