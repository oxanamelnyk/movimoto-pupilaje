import { db } from "@/db";
import { vehicle_storage } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createVehicleStorage(data: {
  vehicle_id: number;
  entry_date: string;
  exit_date?: string;
  location_id: number;
  delivery_place?: string;
}) {
  // Let database auto-generate ID
  const result = await db
    .insert(vehicle_storage)
    .values({
      ...data,
      created_at: new Date(),
    })
    .$returningId();
  
  return result[0] || null;
}

export async function updateVehicleStorage(id: number, data: any) {
  await db.update(vehicle_storage).set(data).where(eq(vehicle_storage.id, id));
  const result = await db
    .select()
    .from(vehicle_storage)
    .where(eq(vehicle_storage.id, id));
  return result[0] || null;
}

export async function deleteVehicleStorage(id: number) {
  await db.delete(vehicle_storage).where(eq(vehicle_storage.id, id));
}
