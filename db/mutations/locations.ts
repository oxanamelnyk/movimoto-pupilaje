import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LocationCreate, LocationUpdate } from "@/validators/locations";

export async function createLocation(data: LocationCreate) {
  const id = crypto.randomUUID();
  const location = {
    id,
    ...data,
    created_at: new Date(),
  };
  await db.insert(locations).values(location);
  return location;
}

export async function updateLocation(id: string, data: LocationUpdate) {
  await db.update(locations).set(data).where(eq(locations.id, id));
  // Fetch the updated location
  const result = await db.select().from(locations).where(eq(locations.id, id));
  return result[0] || null;
}

export async function deleteLocation(id: string) {
  await db.delete(locations).where(eq(locations.id, id));
}
