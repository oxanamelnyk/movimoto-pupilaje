import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { VehicleCreate, VehicleUpdate } from "@/validators/vehicles";

export async function createVehicle(data: VehicleCreate) {
  const id = crypto.randomUUID();
  const vehicle = {
    id,
    ...data,
    created_at: new Date(),
  };
  await db.insert(vehicles).values(vehicle);
  return vehicle;
}

export async function updateVehicle(id: string, data: VehicleUpdate) {
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
  // Fetch the updated vehicle
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id));
  return result[0] || null;
}

export async function deleteVehicle(id: string) {
  await db.delete(vehicles).where(eq(vehicles.id, id));
}
