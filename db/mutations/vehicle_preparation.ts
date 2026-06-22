import { db } from "@/db";
import { vehicle_preparation } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createVehiclePreparation(data: {
  vehicle_id: number;
  request_date?: string;
  requested_by?: string;
  preparation_date?: string;
  preparation_type_id?: number;
}) {
  // Let database auto-generate ID
  const result = await db
    .insert(vehicle_preparation)
    .values({
      ...data,
      created_at: new Date(),
    })
    .$returningId();
  
  return result[0] || null;
}

export async function updateVehiclePreparation(id: number, data: any) {
  await db
    .update(vehicle_preparation)
    .set(data)
    .where(eq(vehicle_preparation.id, id));
  const result = await db
    .select()
    .from(vehicle_preparation)
    .where(eq(vehicle_preparation.id, id));
  return result[0] || null;
}

export async function deleteVehiclePreparation(id: number) {
  await db.delete(vehicle_preparation).where(eq(vehicle_preparation.id, id));
}
