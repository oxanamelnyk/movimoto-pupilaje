import { query, execute } from "@/db";

export async function createVehiclePreparation(data: {
  vehicle_id: number;
  request_date?: string;
  requested_by?: string;
  preparation_date?: string;
  preparation_type_id?: number;
}) {
  const sql = "INSERT INTO vehicle_preparation (vehicle_id, request_date, requested_by, preparation_date, preparation_type_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
  const [result] = await execute(sql, [
    data.vehicle_id,
    data.request_date || null,
    data.requested_by || null,
    data.preparation_date || null,
    data.preparation_type_id || null,
  ]);
  const prepId = (result as any).insertId;
  if (!prepId) return null;
  const prep = await query("SELECT * FROM vehicle_preparation WHERE id = ?", [prepId]);
  return prep[0] || null;
}

export async function updateVehiclePreparation(id: number, data: any) {
  const fields = [];
  const values: any[] = [];
  if (data.vehicle_id !== undefined) {
    fields.push("vehicle_id = ?");
    values.push(data.vehicle_id);
  }
  if (data.request_date !== undefined) {
    fields.push("request_date = ?");
    values.push(data.request_date);
  }
  if (data.requested_by !== undefined) {
    fields.push("requested_by = ?");
    values.push(data.requested_by);
  }
  if (data.preparation_date !== undefined) {
    fields.push("preparation_date = ?");
    values.push(data.preparation_date);
  }
  if (data.preparation_type_id !== undefined) {
    fields.push("preparation_type_id = ?");
    values.push(data.preparation_type_id);
  }
  if (fields.length === 0) return null;
  values.push(id);
  const sql = `UPDATE vehicle_preparation SET ${fields.join(", ")} WHERE id = ?`;
  await execute(sql, values);
  const result = await query("SELECT * FROM vehicle_preparation WHERE id = ?", [id]);
  return result[0] || null;
}

export async function deleteVehiclePreparation(id: number) {
  await execute("DELETE FROM vehicle_preparation WHERE id = ?", [id]);
}
