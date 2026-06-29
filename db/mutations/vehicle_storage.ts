import { query, execute } from "@/db";

export async function createVehicleStorage(data: {
  vehicle_id: number;
  entry_date: string;
  exit_date?: string;
  location_id: number;
  delivery_place?: string;
}) {
  const sql = "INSERT INTO vehicle_storage (vehicle_id, entry_date, exit_date, location_id, delivery_place, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
  const [result] = await execute(sql, [
    data.vehicle_id,
    data.entry_date,
    data.exit_date || null,
    data.location_id,
    data.delivery_place || null,
  ]);
  const storageId = (result as any).insertId;
  if (!storageId) return null;
  const storage = await query("SELECT * FROM vehicle_storage WHERE id = ?", [storageId]);
  return storage[0] || null;
}

export async function updateVehicleStorage(id: number, data: any) {
  const fields = [];
  const values: any[] = [];
  if (data.vehicle_id !== undefined) { fields.push("vehicle_id = ?"); values.push(data.vehicle_id); }
  if (data.entry_date !== undefined) { fields.push("entry_date = ?"); values.push(data.entry_date); }
  if (data.exit_date !== undefined) { fields.push("exit_date = ?"); values.push(data.exit_date); }
  if (data.location_id !== undefined) { fields.push("location_id = ?"); values.push(data.location_id); }
  if (data.delivery_place !== undefined) { fields.push("delivery_place = ?"); values.push(data.delivery_place); }
  if (fields.length === 0) return null;
  values.push(id);
  const sql = `UPDATE vehicle_storage SET ${fields.join(", ")} WHERE id = ?`;
  await execute(sql, values);
  const result = await query("SELECT * FROM vehicle_storage WHERE id = ?", [id]);
  return result[0] || null;
}

export async function deleteVehicleStorage(id: number) {
  await execute("DELETE FROM vehicle_storage WHERE id = ?", [id]);
}
