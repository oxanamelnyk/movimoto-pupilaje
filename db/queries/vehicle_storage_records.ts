import { db } from "@/db";
import { vehicle_storage_records, vehicles, locations } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";

export async function getVehicleStorageRecords() {
  return db
    .select()
    .from(vehicle_storage_records)
    .leftJoin(vehicles, eq(vehicle_storage_records.vehicle_id, vehicles.id))
    .leftJoin(locations, eq(vehicle_storage_records.location_id, locations.id))
    .orderBy(vehicle_storage_records.created_at);
}

export async function getVehicleStorageRecordById(id: string) {
  const result = await db
    .select()
    .from(vehicle_storage_records)
    .leftJoin(vehicles, eq(vehicle_storage_records.vehicle_id, vehicles.id))
    .leftJoin(locations, eq(vehicle_storage_records.location_id, locations.id))
    .where(eq(vehicle_storage_records.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getStorageRecordsByVehicleId(vehicleId: string) {
  return db
    .select()
    .from(vehicle_storage_records)
    .leftJoin(vehicles, eq(vehicle_storage_records.vehicle_id, vehicles.id))
    .leftJoin(locations, eq(vehicle_storage_records.location_id, locations.id))
    .where(eq(vehicle_storage_records.vehicle_id, vehicleId))
    .orderBy(vehicle_storage_records.entry_date);
}

export async function getStorageRecordsByLocationId(locationId: string) {
  return db
    .select()
    .from(vehicle_storage_records)
    .leftJoin(vehicles, eq(vehicle_storage_records.vehicle_id, vehicles.id))
    .leftJoin(locations, eq(vehicle_storage_records.location_id, locations.id))
    .where(eq(vehicle_storage_records.location_id, locationId))
    .orderBy(vehicle_storage_records.entry_date);
}

export async function getActiveStorageRecords() {
  return db
    .select()
    .from(vehicle_storage_records)
    .leftJoin(vehicles, eq(vehicle_storage_records.vehicle_id, vehicles.id))
    .leftJoin(locations, eq(vehicle_storage_records.location_id, locations.id))
    .where(isNull(vehicle_storage_records.exit_date))
    .orderBy(vehicle_storage_records.entry_date);
}
