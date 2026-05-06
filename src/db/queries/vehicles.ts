import { db } from "@/db";
import { vehicles, clients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getVehicles() {
  return db
    .select()
    .from(vehicles)
    .leftJoin(clients, eq(vehicles.client_id, clients.id))
    .orderBy(vehicles.created_at);
}

export async function getVehicleById(id: string) {
  const result = await db
    .select()
    .from(vehicles)
    .leftJoin(clients, eq(vehicles.client_id, clients.id))
    .where(eq(vehicles.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getVehiclesByClientId(clientId: string) {
  return db
    .select()
    .from(vehicles)
    .leftJoin(clients, eq(vehicles.client_id, clients.id))
    .where(eq(vehicles.client_id, clientId))
    .orderBy(vehicles.created_at);
}

export async function getVehicleByVinOrPlate(vinOrPlate: string) {
  const result = await db
    .select()
    .from(vehicles)
    .leftJoin(clients, eq(vehicles.client_id, clients.id))
    .where(eq(vehicles.vin_or_plate, vinOrPlate))
    .limit(1);
  return result[0] || null;
}
