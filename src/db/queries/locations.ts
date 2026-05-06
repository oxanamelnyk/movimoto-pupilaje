import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getLocations() {
  return db.select().from(locations).orderBy(locations.created_at);
}

export async function getLocationById(id: string) {
  const result = await db
    .select()
    .from(locations)
    .where(eq(locations.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getLocationByName(name: string) {
  const result = await db
    .select()
    .from(locations)
    .where(eq(locations.name, name))
    .limit(1);
  return result[0] || null;
}
