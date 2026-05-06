import { z } from "zod";

export const vehicleCreateSchema = z.object({
  client_id: z.string().min(1, "Client ID is required"),
  brand: z.string().min(1, "Vehicle brand is required").max(255),
  model: z.string().min(1, "Vehicle model is required").max(255),
  vin_or_plate: z.string().min(1, "VIN or plate is required").max(255),
  color: z.string().max(255).optional().nullable(),
});

export const vehicleUpdateSchema = z.object({
  client_id: z.string().min(1, "Client ID is required").optional(),
  brand: z.string().min(1, "Vehicle brand is required").max(255).optional(),
  model: z.string().min(1, "Vehicle model is required").max(255).optional(),
  vin_or_plate: z
    .string()
    .min(1, "VIN or plate is required")
    .max(255)
    .optional(),
  color: z.string().max(255).optional().nullable(),
});

export const vehicleSchema = z.object({
  id: z.string(),
  client_id: z.string(),
  brand: z.string(),
  model: z.string(),
  vin_or_plate: z.string(),
  color: z.string().nullable(),
  created_at: z.date().nullable(),
});

export type VehicleCreate = z.infer<typeof vehicleCreateSchema>;
export type VehicleUpdate = z.infer<typeof vehicleUpdateSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
