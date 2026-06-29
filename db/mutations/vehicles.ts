import { execute, query } from "@/db";
import { VehicleCreate, VehicleUpdate } from "@/validators/vehicles";

export async function createVehicle(data: VehicleCreate) {
  // Insert vehicle record
  const vehicleResult = await execute(
    `INSERT INTO vehicles (client_id, brand_id, model_id, color_id, status_id, vin, plate_number, notes, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      data.client_id,
      data.brand_id,
      data.model_id,
      data.color_id || null,
      data.status_id,
      data.vin || null,
      data.plate_number || null,
      data.notes || null,
    ]
  );
  
  const vehicleId = (vehicleResult as any)[0].insertId;
  
  // Create storage record if provided
  if (data.entry_date && data.location_id) {
    await execute(
      `INSERT INTO vehicle_storage (vehicle_id, entry_date, exit_date, location_id, delivery_place, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        vehicleId,
        data.entry_date,
        data.exit_date || null,
        data.location_id,
        data.delivery_place || null,
      ]
    );
  }

  // Create preparation record if provided
  if (
    data.request_date ||
    data.requested_by ||
    data.preparation_date ||
    data.preparation_type_id
  ) {
    await execute(
      `INSERT INTO vehicle_preparation (vehicle_id, request_date, requested_by, preparation_date, preparation_type_id, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        vehicleId,
        data.request_date || null,
        data.requested_by || null,
        data.preparation_date || null,
        data.preparation_type_id || null,
      ]
    );
  }

  return { id: vehicleId };
}

export async function updateVehicle(id: number, data: VehicleUpdate) {
  const fields = Object.keys(data)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = Object.values(data);
  
  await execute(
    `UPDATE vehicles SET ${fields}, updated_at = NOW() WHERE id = ?`,
    [...values, id]
  );

  const result = await query(
    `SELECT * FROM vehicles WHERE id = ?`,
    [id]
  );
  return (result as any[])[0] || null;
}

export async function deleteVehicle(id: number) {
  await execute(
    `DELETE FROM vehicles WHERE id = ?`,
    [id]
  );
}
