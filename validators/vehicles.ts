import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const vehicleCreateSchema = z.object({
  client_id: z.number().int().min(1, "Client ID is required"),
  brand_id: z.number().int().min(1, "Brand ID is required"),
  model_id: z.number().int().min(1, "Model ID is required"),
  color_id: z.number().int().optional().nullable(),
  status_id: z.number().int().min(1, "Status ID is required"),
  vin: z.string().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  // Storage info
  entry_date: z.string().regex(dateRegex, "Entry date must be in YYYY-MM-DD format"),
  exit_date: z.string().regex(dateRegex, "Exit date must be in YYYY-MM-DD format").optional().nullable(),
  location_id: z.number().int().min(1, "Location ID is required"),
  delivery_place: z.string().optional().nullable(),
  // Preparation info
  request_date: z.string().regex(dateRegex, "Request date must be in YYYY-MM-DD format").optional().nullable(),
  requested_by: z.string().optional().nullable(),
  preparation_date: z.string().regex(dateRegex, "Preparation date must be in YYYY-MM-DD format").optional().nullable(),
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
