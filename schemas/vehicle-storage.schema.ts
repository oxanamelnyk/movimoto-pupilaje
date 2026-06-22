import { z } from "zod";

export const vehicleStorageFormSchema = z.object({
  // Vehicle info
  client_id: z.number().int("Se requiere cliente"),
  brand_id: z.number().int("Se requiere marca"),
  model_id: z.number().int("Se requiere modelo"),
  color_id: z.number().int().optional().nullable(),
  status_id: z.number().int("Se requiere estado"),
  vin: z.string().optional().nullable(),
  plate_number: z.string().optional().nullable(),
  
  // Storage info
  entry_date: z.string().min(1, "Se requiere fecha de entrada"),
  exit_date: z.string().optional().nullable(),
  location_id: z.number().int("Se requiere ubicación"),
  delivery_place: z.string().optional().nullable(),
  
  // Preparation info
  request_date: z.string().optional().nullable(),
  requested_by: z.string().optional().nullable(),
  preparation_date: z.string().optional().nullable(),
  preparation_type_id: z.number().int().optional().nullable(),
  
  // Notes
  notes: z.string().optional().nullable(),
});

export type VehicleStorageFormData = z.infer<typeof vehicleStorageFormSchema>;
