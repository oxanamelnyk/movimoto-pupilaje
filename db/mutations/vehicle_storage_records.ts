import type { ExecuteValues } from "mysql2";
import { query, execute } from "@/db";
import {
  VehicleStorageRecordCreate,
  VehicleStorageRecordUpdate,
} from "@/validators/vehicle_storage_records";

export async function createVehicleStorageRecord(
  data: VehicleStorageRecordCreate,
) {
  const id = crypto.randomUUID();
  const sql = `
    INSERT INTO vehicle_storage_records 
    (id, vehicle_id, status, entry_date, exit_date, location_id, destination, request_date, requested_by, unpacking_date, unpacking_type, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  await execute(sql, [
    id,
    data.vehicle_id,
    data.status,
    data.entry_date,
    data.exit_date || null,
    data.location_id,
    data.destination || null,
    data.request_date || null,
    data.requested_by || null,
    data.unpacking_date || null,
    data.unpacking_type || null,
    data.notes || null,
  ]);

  const record = await query(
    "SELECT * FROM vehicle_storage_records WHERE id = ?",
    [id],
  );
  return record[0] || null;
}

export async function updateVehicleStorageRecord(
  id: string,
  data: VehicleStorageRecordUpdate,
) {
  const fields = [];
  const values: unknown[] = [];

  if (data.vehicle_id !== undefined) {
    fields.push("vehicle_id = ?");
    values.push(data.vehicle_id);
  }
  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }
  if (data.entry_date !== undefined) {
    fields.push("entry_date = ?");
    values.push(data.entry_date);
  }
  if (data.exit_date !== undefined) {
    fields.push("exit_date = ?");
    values.push(data.exit_date);
  }
  if (data.location_id !== undefined) {
    fields.push("location_id = ?");
    values.push(data.location_id);
  }
  if (data.destination !== undefined) {
    fields.push("destination = ?");
    values.push(data.destination);
  }
  if (data.request_date !== undefined) {
    fields.push("request_date = ?");
    values.push(data.request_date);
  }
  if (data.requested_by !== undefined) {
    fields.push("requested_by = ?");
    values.push(data.requested_by);
  }
  if (data.unpacking_date !== undefined) {
    fields.push("unpacking_date = ?");
    values.push(data.unpacking_date);
  }
  if (data.unpacking_type !== undefined) {
    fields.push("unpacking_type = ?");
    values.push(data.unpacking_type);
  }
  if (data.notes !== undefined) {
    fields.push("notes = ?");
    values.push(data.notes);
  }

  fields.push("updated_at = NOW()");
  values.push(id);

  const sql = `UPDATE vehicle_storage_records SET ${fields.join(", ")} WHERE id = ?`;
  await execute(sql, values as (ExecuteValues | null)[]);

  const result = await query(
    "SELECT * FROM vehicle_storage_records WHERE id = ?",
    [id],
  );
  return result[0] || null;
}

export async function deleteVehicleStorageRecord(id: string) {
  await execute("DELETE FROM vehicle_storage_records WHERE id = ?", [id]);
}
