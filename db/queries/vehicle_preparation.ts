import { query } from "@/db";

export async function getVehiclePreparation(vehicleId: number) {
  const sql = `
    SELECT vp.*, pt.name as preparation_type_name
    FROM vehicle_preparation vp
    LEFT JOIN preparation_types pt ON vp.preparation_type_id = pt.id
    WHERE vp.vehicle_id = ?
  `;
  return query(sql, [vehicleId]);
}

export async function getVehiclePreparationById(id: number) {
  const sql = `
    SELECT vp.*, pt.name as preparation_type_name
    FROM vehicle_preparation vp
    LEFT JOIN preparation_types pt ON vp.preparation_type_id = pt.id
    WHERE vp.id = ?
    LIMIT 1
  `;
  const result = await query(sql, [id]);
  return result[0] || null;
}
