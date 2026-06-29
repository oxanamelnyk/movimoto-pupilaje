import { query } from "@/db";

export async function getVehicleStorageRecords() {
  const sql = `
    SELECT vsr.*, v.id as vehicle_id_ref, l.name as location_name
    FROM vehicle_storage_records vsr
    LEFT JOIN vehicles v ON vsr.vehicle_id = v.id
    LEFT JOIN locations l ON vsr.location_id = l.id
    ORDER BY vsr.created_at DESC
  `;
  return query(sql);
}

export async function getVehicleStorageRecordById(id: string) {
  const sql = `
    SELECT vsr.*, v.id as vehicle_id_ref, l.name as location_name
    FROM vehicle_storage_records vsr
    LEFT JOIN vehicles v ON vsr.vehicle_id = v.id
    LEFT JOIN locations l ON vsr.location_id = l.id
    WHERE vsr.id = ?
    LIMIT 1
  `;
  const result = await query(sql, [id]);
  return result[0] || null;
}

export async function getStorageRecordsByVehicleId(vehicleId: number) {
  const sql = `
    SELECT vsr.*, v.id as vehicle_id_ref, l.name as location_name
    FROM vehicle_storage_records vsr
    LEFT JOIN vehicles v ON vsr.vehicle_id = v.id
    LEFT JOIN locations l ON vsr.location_id = l.id
    WHERE vsr.vehicle_id = ?
    ORDER BY vsr.entry_date DESC
  `;
  return query(sql, [vehicleId]);
}

export async function getStorageRecordsByLocationId(locationId: number) {
  const sql = `
    SELECT vsr.*, v.id as vehicle_id_ref, l.name as location_name
    FROM vehicle_storage_records vsr
    LEFT JOIN vehicles v ON vsr.vehicle_id = v.id
    LEFT JOIN locations l ON vsr.location_id = l.id
    WHERE vsr.location_id = ?
    ORDER BY vsr.entry_date DESC
  `;
  return query(sql, [locationId]);
}

export async function getActiveStorageRecords() {
  const sql = `
    SELECT vsr.*, v.id as vehicle_id_ref, l.name as location_name
    FROM vehicle_storage_records vsr
    LEFT JOIN vehicles v ON vsr.vehicle_id = v.id
    LEFT JOIN locations l ON vsr.location_id = l.id
    WHERE vsr.exit_date IS NULL
    ORDER BY vsr.entry_date DESC
  `;
  return query(sql);
}
