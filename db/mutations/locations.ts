import { query, execute } from "@/db";
import { LocationCreate, LocationUpdate } from "@/validators/locations";

export async function createLocation(data: LocationCreate) {
  const sql = "INSERT INTO locations (name, created_at) VALUES (?, NOW())";
  const [result] = await execute(sql, [data.name]);
  const locationId = (result as any).insertId;

  if (!locationId) return null;

  const location = await query("SELECT * FROM locations WHERE id = ?", [locationId]);
  return location[0] || null;
}

export async function updateLocation(id: number, data: LocationUpdate) {
  if (data.name) {
    const sql = "UPDATE locations SET name = ? WHERE id = ?";
    await execute(sql, [data.name, id]);
  }

  const location = await query("SELECT * FROM locations WHERE id = ?", [id]);
  return location[0] || null;
}

export async function deleteLocation(id: number) {
  await execute("DELETE FROM locations WHERE id = ?", [id]);
}
