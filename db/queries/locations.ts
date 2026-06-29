import { query } from "@/db";

export async function getLocations() {
  return query("SELECT * FROM locations ORDER BY created_at DESC");
}

export async function getLocationById(id: number) {
  const result = await query("SELECT * FROM locations WHERE id = ? LIMIT 1", [id]);
  return result[0] || null;
}

export async function getLocationByName(name: string) {
  const result = await query("SELECT * FROM locations WHERE name = ? LIMIT 1", [name]);
  return result[0] || null;
}
