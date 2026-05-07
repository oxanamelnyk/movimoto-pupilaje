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
  const record = {
    id,
    vehicle_id: data.vehicle_id,
    status: data.status,
    entry_date: new Date(data.entry_date),
    exit_date: data.exit_date ? new Date(data.exit_date) : null,
    location_id: data.location_id,
    destination: data.destination || null,
    request_date: data.request_date ? new Date(data.request_date) : null,
    requested_by: data.requested_by || null,
    unpacking_date: data.unpacking_date ? new Date(data.unpacking_date) : null,
    unpacking_type: data.unpacking_type || null,
    notes: data.notes || null,
    created_at: new Date(),
    updated_at: new Date(),
  };
  await db.insert(vehicle_storage_records).values(record);
  return record;
}

export async function updateVehicleStorageRecord(
  id: string,
  data: VehicleStorageRecordUpdate,
) {
  const updateData: any = { ...data };
  // Convert date strings to Date objects
  if (updateData.entry_date) {
    updateData.entry_date = new Date(updateData.entry_date);
  }
  if (updateData.exit_date) {
    updateData.exit_date = new Date(updateData.exit_date);
  }
  if (updateData.request_date) {
    updateData.request_date = new Date(updateData.request_date);
  }
  if (updateData.unpacking_date) {
    updateData.unpacking_date = new Date(updateData.unpacking_date);
  }
  updateData.updated_at = new Date();

  await db
    .update(vehicle_storage_records)
    .set(updateData)
    .where(eq(vehicle_storage_records.id, id));
  // Fetch the updated record
  const result = await db
    .select()
    .from(vehicle_storage_records)
    .where(eq(vehicle_storage_records.id, id));
  return result[0] || null;
}

export async function deleteVehicleStorageRecord(id: string) {
  await db
    .delete(vehicle_storage_records)
    .where(eq(vehicle_storage_records.id, id));
}
