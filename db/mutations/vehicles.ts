import { db } from "@/db";
import { vehicles, vehicle_storage, vehicle_preparation } from "@/db/schema";
import { eq } from "drizzle-orm";
import { VehicleCreate, VehicleUpdate } from "@/validators/vehicles";

export async function createVehicle(data: VehicleCreate) {
  // Let the database generate the ID via autoincrement
  const vehicleData = {
    client_id: data.client_id,
    brand_id: data.brand_id,
    model_id: data.model_id,
    color_id: data.color_id || null,
    status_id: data.status_id,
    vin: data.vin || null,
    plate_number: data.plate_number || null,
    notes: data.notes || null,
    created_at: new Date(),
  };
  
  const result = await db.insert(vehicles).values(vehicleData);
  const vehicleId = result.insertId; // Get the auto-generated ID
  
  return { ...vehicleData, id: vehicleId };
}

export async function updateVehicle(id: number, data: VehicleUpdate) {
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
  // Fetch the updated vehicle
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id));
  return result[0] || null;
}

export async function deleteVehicle(id: number) {
  await db.delete(vehicles).where(eq(vehicles.id, id));
}
