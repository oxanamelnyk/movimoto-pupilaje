import { query } from "@/db";

export async function getVehicleStorage(vehicleId: number) {
  const sql = `
    SELECT vs.*, sl.name as location_name
    FROM vehicle_storage vs
    LEFT JOIN storage_locations sl ON vs.location_id = sl.id
    WHERE vs.vehicle_id = ?
  `;
  return query(sql, [vehicleId]);
}

export async function getVehicleStorageById(id: number) {
  const sql = `
    SELECT vs.*, sl.name as location_name
    FROM vehicle_storage vs
    LEFT JOIN storage_locations sl ON vs.location_id = sl.id
    WHERE vs.id = ?
    LIMIT 1
  `;
  const result = await query(sql, [id]);
  return result[0] || null;
}
