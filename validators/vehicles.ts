import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Transform ISO dates to YYYY-MM-DD format, then validate
const dateField = z
  .string()
  .transform((val) => {
    if (val.match(dateRegex)) {
      return val; // Already in correct format
    }
    // Try to parse ISO format and convert to YYYY-MM-DD
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
    return val;
  })
  .pipe(z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"));

const optionalDateField = dateField.optional().nullable();

export const vehicleCreateSchema = z.object({
  client_id: z.number().int().min(1, "Client ID is required"),
  brand_id: z.number().int().min(1, "Brand ID is required"),
  model_id: z.number().int().min(1, "Model ID is required"),
  color_id: z.number().int().optional().nullable(),
  status_id: z.number().int().min(1, "Status ID is required"),
  registration_identity: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // Storage info
  entry_date: dateField,
  exit_date: optionalDateField,
  location_id: z.number().int().min(1, "Location ID is required"),
  delivery_place: z.string().optional().nullable(),
  // Preparation info
  request_date: optionalDateField,
  requested_by: z.string().optional().nullable(),
  preparation_date: optionalDateField,
  preparation_type_id: z.number().int().optional().nullable(),
});

export const vehicleUpdateSchema = z
  .object({
    client_id: z.number().int().positive().optional(),
    brand_id: z.number().int().positive().optional(),
    model_id: z.number().int().positive().optional(),
    color_id: z.number().int().positive().optional().nullable(),
    status_id: z.number().int().positive().optional(),
    registration_identity: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    // Storage info
    entry_date: optionalDateField,
    exit_date: optionalDateField,
    location_id: z.number().int().positive().optional().nullable(),
    delivery_place: z.string().optional().nullable(),
    // Preparation info
    request_date: optionalDateField,
    requested_by: z.string().optional().nullable(),
    preparation_date: optionalDateField,
    preparation_type_id: z.number().int().positive().optional().nullable(),
  })
  .passthrough();

export const vehicleSchema = z.object({
  id: z.number().int(),
  client_id: z.number().int(),
  brand_id: z.number().int(),
  model_id: z.number().int(),
  color_id: z.number().int().nullable(),
  status_id: z.number().int(),
  registration_identity: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.date().nullable(),
});

export type VehicleCreate = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdate = z.infer<typeof vehicleUpdateSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
