import { query, execute } from "@/db";

export async function createVehicleStorage(data: {
  vehicle_id: number;
  entry_date: string;
  exit_date?: string;
  location_id: number;
  delivery_place?: string;
}) {
  const sql =
    "INSERT INTO vehicle_storage (vehicle_id, entry_date, exit_date, location_id, delivery_place, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
  const [result] = await execute(sql, [
    data.vehicle_id,
    data.entry_date,
    data.exit_date || null,
    data.location_id,
    data.delivery_place || null,
  ]);
  const storageId = (result as { insertId: number }).insertId;
  if (!storageId) return null;
  const storage = await query("SELECT * FROM vehicle_storage WHERE id = ?", [
    storageId,
  ]);
  return storage[0] || null;
}

export async function updateVehicleStorage(id: number, data: unknown) {
  const typedData = data as Record<string, unknown>;
  const fields = [];
  const values: unknown[] = [];
  if (typedData.vehicle_id !== undefined) {
    fields.push("vehicle_id = ?");
    values.push(typedData.vehicle_id);
  }
  if (typedData.entry_date !== undefined) {
    fields.push("entry_date = ?");
    values.push(typedData.entry_date);
  }
  if (typedData.exit_date !== undefined) {
    fields.push("exit_date = ?");
    values.push(typedData.exit_date);
  }
  if (typedData.location_id !== undefined) {
    fields.push("location_id = ?");
    values.push(typedData.location_id);
  }
  if (typedData.delivery_place !== undefined) {
    fields.push("delivery_place = ?");
    values.push(typedData.delivery_place);
  }
  if (fields.length === 0) return null;
  values.push(id);
  const sql = `UPDATE vehicle_storage SET ${fields.join(", ")} WHERE id = ?`;
  await execute(sql, values as Parameters<typeof execute>[1]);
  const result = await query("SELECT * FROM vehicle_storage WHERE id = ?", [
    id,
  ]);
  return result[0] || null;
}

export async function deleteVehicleStorage(id: number) {
  await execute("DELETE FROM vehicle_storage WHERE id = ?", [id]);
}
