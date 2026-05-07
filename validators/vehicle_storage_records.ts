import { z } from "zod";

export const vehicleStorageRecordCreateSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle ID is required"),
  status: z.string().min(1, "Status is required").max(255),
  entry_date: z.string().date("Invalid entry date format"),
  exit_date: z.string().date("Invalid exit date format").optional().nullable(),
  location_id: z.string().min(1, "Location ID is required"),
  destination: z.string().max(255).optional().nullable(),
  request_date: z
    .string()
    .date("Invalid request date format")
    .optional()
    .nullable(),
  requested_by: z.string().max(255).optional().nullable(),
  unpacking_date: z
    .string()
    .date("Invalid unpacking date format")
    .optional()
    .nullable(),
  unpacking_type: z.string().max(255).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const vehicleStorageRecordUpdateSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle ID is required").optional(),
  status: z.string().min(1, "Status is required").max(255).optional(),
  entry_date: z.string().date("Invalid entry date format").optional(),
  exit_date: z.string().date("Invalid exit date format").optional().nullable(),
  location_id: z.string().min(1, "Location ID is required").optional(),
  destination: z.string().max(255).optional().nullable(),
  request_date: z
    .string()
    .date("Invalid request date format")
    .optional()
    .nullable(),
  requested_by: z.string().max(255).optional().nullable(),
  unpacking_date: z
    .string()
    .date("Invalid unpacking date format")
    .optional()
    .nullable(),
  unpacking_type: z.string().max(255).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const vehicleStorageRecordSchema = z.object({
  id: z.string(),
  vehicle_id: z.string(),
  status: z.string(),
  entry_date: z.string(),
  exit_date: z.string().nullable(),
  location_id: z.string(),
  destination: z.string().nullable(),
  request_date: z.string().nullable(),
  requested_by: z.string().nullable(),
  unpacking_date: z.string().nullable(),
  unpacking_type: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
});

export type VehicleStorageRecordCreate = z.infer<
  typeof vehicleStorageRecordCreateSchema
>;
export type VehicleStorageRecordUpdate = z.infer<
  typeof vehicleStorageRecordUpdateSchema
>;
export type VehicleStorageRecord = z.infer<typeof vehicleStorageRecordSchema>;
