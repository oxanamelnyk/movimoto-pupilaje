import { db } from "@/db";
import {
  vehicles,
  clients,
  brands,
  models,
  colors,
  vehicle_statuses,
  vehicle_storage,
  vehicle_preparation,
  storage_locations,
  preparation_types,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getVehicles() {
  return db
    .select()
    .from(vehicles)
    .leftJoin(clients, eq(vehicles.client_id, clients.id))
    .leftJoin(brands, eq(vehicles.brand_id, brands.id))
    .leftJoin(models, eq(vehicles.model_id, models.id))
    .leftJoin(colors, eq(vehicles.color_id, colors.id))
    .leftJoin(vehicle_statuses, eq(vehicles.status_id, vehicle_statuses.id))
    .orderBy(vehicles.created_at);
}

export async function getVehicleById(id: number) {
  const result = await db
    .select()
    .from(vehicles)
    .leftJoin(clients, eq(vehicles.client_id, clients.id))
    .leftJoin(brands, eq(vehicles.brand_id, brands.id))
    .leftJoin(models, eq(vehicles.model_id, models.id))
    .leftJoin(colors, eq(vehicles.color_id, colors.id))
    .leftJoin(vehicle_statuses, eq(vehicles.status_id, vehicle_statuses.id))
    .leftJoin(
      vehicle_storage,
      eq(vehicles.id, vehicle_storage.vehicle_id),
    )
    .leftJoin(
      storage_locations,
      eq(vehicle_storage.location_id, storage_locations.id),
    )
    .leftJoin(
      vehicle_preparation,
      eq(vehicles.id, vehicle_preparation.vehicle_id),
    )
    .leftJoin(
      preparation_types,
      eq(vehicle_preparation.preparation_type_id, preparation_types.id),
    )
    .where(eq(vehicles.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getVehiclesByClientId(clientId: number) {
  return db
    .select()
    .from(vehicles)
    .leftJoin(clients, eq(vehicles.client_id, clients.id))
    .leftJoin(brands, eq(vehicles.brand_id, brands.id))
    .leftJoin(models, eq(vehicles.model_id, models.id))
    .where(eq(vehicles.client_id, clientId))
    .orderBy(vehicles.created_at);
}

export async function getVehicleByVinOrPlate(vin: string, plate: string) {
  const result = await db
    .select()
    .from(vehicles)
    .leftJoin(clients, eq(vehicles.client_id, clients.id))
    .where(
      // Check either VIN or plate number
      db.or(eq(vehicles.vin, vin), eq(vehicles.plate_number, plate))
    )
    .limit(1);
  return result[0] || null;
}
