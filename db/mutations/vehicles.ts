import { withTransaction } from "@/db/transaction";
import { VehicleCreate, VehicleUpdate } from "@/validators/vehicles";

export async function createVehicle(data: VehicleCreate) {
  // Wrap all operations in a transaction
  return withTransaction(async ({ execute }) => {
    // Insert vehicle record
    const vehicleResult = await execute(
      `INSERT INTO vehicles (client_id, brand_id, model_id, color_id, status_id, registration_identity, notes, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.client_id,
        data.brand_id,
        data.model_id,
        data.color_id || null,
        data.status_id,
        data.registration_identity || null,
        data.notes || null,
      ],
    );

    const vehicleId = (vehicleResult as any).insertId;

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
        ],
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
        ],
      );
    }

    return { id: vehicleId };
  });
}

export async function updateVehicle(id: string | number, data: any) {
  return withTransaction(async ({ execute, query }) => {
    const vehicleFields: Record<string, any> = {};
    const storageData: Record<string, any> = {};
    const preparationData: Record<string, any> = {};

    // Separate vehicle, storage, and preparation data
    const vehicleKeys = [
      "client_id",
      "brand_id",
      "model_id",
      "color_id",
      "status_id",
      "registration_identity",
      "notes",
    ];
    const storageKeys = [
      "entry_date",
      "exit_date",
      "location_id",
      "delivery_place",
    ];
    const preparationKeys = [
      "request_date",
      "requested_by",
      "preparation_date",
      "preparation_type_id",
    ];

    Object.entries(data).forEach(([key, value]) => {
      // Skip undefined or null values for id-based fields
      if (
        (key === "location_id" || key === "preparation_type_id") &&
        (value === null || value === undefined || value === 0)
      ) {
        return;
      }

      if (vehicleKeys.includes(key)) {
        vehicleFields[key] = value;
      } else if (storageKeys.includes(key)) {
        storageData[key] = value;
      } else if (preparationKeys.includes(key)) {
        preparationData[key] = value;
      }
    });

    // Update vehicle table
    if (Object.keys(vehicleFields).length > 0) {
      const fields = Object.keys(vehicleFields)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = Object.values(vehicleFields);

      await execute(`UPDATE vehicles SET ${fields} WHERE id = ?`, [
        ...values,
        id,
      ]);
    }

    // Update or insert vehicle_storage
    if (Object.keys(storageData).length > 0) {
      const storageRecord = await query(
        `SELECT id FROM vehicle_storage WHERE vehicle_id = ? LIMIT 1`,
        [id],
      );

      if ((storageRecord as any[]).length > 0) {
        // Update existing record
        const fields = Object.keys(storageData)
          .map((key) => `${key} = ?`)
          .join(", ");
        const values = Object.values(storageData);

        await execute(
          `UPDATE vehicle_storage SET ${fields} WHERE vehicle_id = ?`,
          [...values, id],
        );
      } else if (storageData.entry_date && storageData.location_id) {
        // Insert new record
        await execute(
          `INSERT INTO vehicle_storage (vehicle_id, entry_date, exit_date, location_id, delivery_place, created_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            id,
            storageData.entry_date,
            storageData.exit_date || null,
            storageData.location_id,
            storageData.delivery_place || null,
          ],
        );
      }
    }

    // Update or insert vehicle_preparation
    if (Object.keys(preparationData).length > 0) {
      const prepRecord = await query(
        `SELECT id FROM vehicle_preparation WHERE vehicle_id = ? LIMIT 1`,
        [id],
      );

      if ((prepRecord as any[]).length > 0) {
        // Update existing record
        const fields = Object.keys(preparationData)
          .map((key) => `${key} = ?`)
          .join(", ");
        const values = Object.values(preparationData);

        await execute(
          `UPDATE vehicle_preparation SET ${fields} WHERE vehicle_id = ?`,
          [...values, id],
        );
      } else if (
        Object.values(preparationData).some(
          (v) => v !== null && v !== undefined,
        )
      ) {
        // Insert new record if any field is set
        await execute(
          `INSERT INTO vehicle_preparation (vehicle_id, request_date, requested_by, preparation_date, preparation_type_id, created_at) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            id,
            preparationData.request_date || null,
            preparationData.requested_by || null,
            preparationData.preparation_date || null,
            preparationData.preparation_type_id || null,
          ],
        );
      }
    }

    const result = await query(`SELECT * FROM vehicles WHERE id = ?`, [id]);
    return (result as any[])[0] || null;
  });
}

export async function deleteVehicle(id: number) {
  await execute(`DELETE FROM vehicles WHERE id = ?`, [id]);
}
