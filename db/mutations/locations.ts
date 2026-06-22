import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LocationCreate, LocationUpdate } from "@/validators/locations";

export async function createLocation(data: LocationCreate) {
  // Let database auto-generate ID
  const result = await db
    .insert(locations)
    .values(data)
    .$returningId();
  
  return result[0] || null;
}

export async function updateLocation(id: number, data: LocationUpdate) {
  await db.update(locations).set(data).where(eq(locations.id, id));
  // Fetch the updated location
  const result = await db.select().from(locations).where(eq(locations.id, id));
  return result[0] || null;
}

export async function deleteLocation(id: number) {
  await db.delete(locations).where(eq(locations.id, id));
}
