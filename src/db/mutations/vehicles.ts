import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { VehicleCreate, VehicleUpdate } from "@/validators/vehicles";

export async function createVehicle(data: VehicleCreate) {
  const id = crypto.randomUUID();
  const result = await db
    .insert(vehicles)
    .values({
      id,
      ...data,
    })
    .returning();
  return result[0];
}

export async function updateVehicle(id: string, data: VehicleUpdate) {
  const result = await db
    .update(vehicles)
    .set(data)
    .where(eq(vehicles.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteVehicle(id: string) {
  await db.delete(vehicles).where(eq(vehicles.id, id));
}
