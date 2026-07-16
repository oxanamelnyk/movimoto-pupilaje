import { query } from "@/db";

export async function getVehicles(offset: number = 0, limit: number = 10) {
  const sql = `
    SELECT 
      v.*,
      c.id as client_id, c.name as client_name,
      b.id as brand_id, b.name as brand_name,
      m.id as model_id, m.name as model_name,
      col.id as color_id, col.name as color_name,
      vs.id as status_id, vs.name as status_name,
      vst.entry_date, vst.exit_date, vst.delivery_place, vst.location_id,
      sl.name as location_name,
      vp.preparation_date, vp.request_date,
      pt.name as preparation_type_name
    FROM vehicles v
    LEFT JOIN clients c ON v.client_id = c.id
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN models m ON v.model_id = m.id
    LEFT JOIN colors col ON v.color_id = col.id
    LEFT JOIN vehicle_statuses vs ON v.status_id = vs.id
    LEFT JOIN vehicle_storage vst ON v.id = vst.vehicle_id
    LEFT JOIN storage_locations sl ON vst.location_id = sl.id
    LEFT JOIN vehicle_preparation vp ON v.id = vp.vehicle_id
    LEFT JOIN preparation_types pt ON vp.preparation_type_id = pt.id
    ORDER BY v.created_at DESC
    LIMIT ? OFFSET ?
  `;
  return query(sql, [limit, offset]);
}

export async function getVehicleCount() {
  const sql = `SELECT COUNT(*) as count FROM vehicles`;
  const result = await query(sql);
  return result[0]?.count || 0;
}

export async function getVehicleById(id: number) {
  const sql = `
    SELECT 
      v.*,
      c.id as client_id, c.name as client_name,
      b.id as brand_id, b.name as brand_name,
      m.id as model_id, m.name as model_name,
      col.id as color_id, col.name as color_name,
      vs.id as status_id, vs.name as status_name,
      vs2.id as vehicle_storage_id, vs2.entry_date, vs2.exit_date, vs2.location_id,
      sl.name as location_name,
      vp.id as vehicle_preparation_id, vp.request_date, vp.requested_by, vp.preparation_date, vp.preparation_type_id,
      pt.name as preparation_type_name
    FROM vehicles v
    LEFT JOIN clients c ON v.client_id = c.id
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN models m ON v.model_id = m.id
    LEFT JOIN colors col ON v.color_id = col.id
    LEFT JOIN vehicle_statuses vs ON v.status_id = vs.id
    LEFT JOIN vehicle_storage vs2 ON v.id = vs2.vehicle_id
    LEFT JOIN storage_locations sl ON vs2.location_id = sl.id
    LEFT JOIN vehicle_preparation vp ON v.id = vp.vehicle_id
    LEFT JOIN preparation_types pt ON vp.preparation_type_id = pt.id
    WHERE v.id = ?
    LIMIT 1
  `;
  const results = await query(sql, [id]);
  return results[0] || null;
}

export async function getVehiclesByClientId(clientId: number) {
  const sql = `
    SELECT 
      v.*,
      c.id as client_id, c.name as client_name,
      b.id as brand_id, b.name as brand_name,
      m.id as model_id, m.name as model_name
    FROM vehicles v
    LEFT JOIN clients c ON v.client_id = c.id
    LEFT JOIN brands b ON v.brand_id = b.id
    LEFT JOIN models m ON v.model_id = m.id
    WHERE v.client_id = ?
    ORDER BY v.created_at DESC
  `;
  return query(sql, [clientId]);
}

export async function getVehicleByRegistrationIdentity(
  registrationIdentity: string,
) {
  const sql = `
    SELECT 
      v.*,
      c.id as client_id, c.name as client_name
    FROM vehicles v
    LEFT JOIN clients c ON v.client_id = c.id
    WHERE v.registration_identity = ?
    LIMIT 1
  `;
  const results = await query(sql, [registrationIdentity]);
  return results[0] || null;
}
