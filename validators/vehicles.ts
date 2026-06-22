import { z } from "zod";

export const vehicleCreateSchema = z.object({
  client_id: z.number().int("Client ID must be a number"),
  brand_id: z.number().int("Brand ID must be a number"),
  model_id: z.number().int("Model ID must be a number"),
  color_id: z.number().int().optional().nullable(),
  status_id: z.number().int("Status ID must be a number"),
  vin: z.string().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // Storage info
  entry_date: z.string().min(1, "Entry date is required"),
  exit_date: z.string().optional().nullable(),
  location_id: z.number().int("Location ID must be a number"),
  delivery_place: z.string().optional().nullable(),
  // Preparation info
  request_date: z.string().optional().nullable(),
  requested_by: z.string().optional().nullable(),
  preparation_date: z.string().optional().nullable(),
  preparation_type_id: z.number().int().optional().nullable(),
});

export const vehicleUpdateSchema = z.object({
  client_id: z.number().int().optional(),
  brand_id: z.number().int().optional(),
  model_id: z.number().int().optional(),
  color_id: z.number().int().optional().nullable(),
  status_id: z.number().int().optional(),
  vin: z.string().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const vehicleSchema = z.object({
  id: z.number().int(),
  client_id: z.number().int(),
  brand_id: z.number().int(),
  model_id: z.number().int(),
  color_id: z.number().int().nullable(),
  status_id: z.number().int(),
  vin: z.string().nullable(),
  plate_number: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.date().nullable(),
});

export type VehicleCreate = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdate = z.infer<typeof vehicleUpdateSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
