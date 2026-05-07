import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LocationCreate, LocationUpdate } from "@/validators/locations";

export async function createLocation(data: LocationCreate) {
  const id = crypto.randomUUID();
  const result = await db
    .insert(locations)
    .values({
      id,
      ...data,
    })
    .returning();
  return result[0];
}

export async function updateLocation(id: string, data: LocationUpdate) {
  const result = await db
    .update(locations)
    .set(data)
    .where(eq(locations.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteLocation(id: string) {
  await db.delete(locations).where(eq(locations.id, id));
}
