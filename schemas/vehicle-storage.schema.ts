import { z } from "zod";

export const vehicleStorageFormSchema = z.object({
  client_id: z.string().min(1, "Se requiere cliente"),
  brand: z.string().min(1, "Se requiere marca"),
  model: z.string().min(1, "Se requiere modelo"),
  vin_or_plate: z.string().min(1, "Se requiere VIN o placa"),
  color: z.string().optional(),
  estado: z.enum(["entrega", "preparacion", "salida"]),
  status: z.enum(["IN", "OUT"]),
  entry_date: z.string().min(1, "Se requiere fecha de entrada"),
  exit_date: z.string().optional(),
  location_id: z.string().min(1, "Se requiere ubicación"),
  destination: z.string().optional(),
  request_date: z.string().optional(),
  requested_by: z.string().optional(),
  unpacking_date: z.string().optional(),
  unpacking_type: z.string().optional(),
  notes: z.string().optional(),
});

export type VehicleStorageFormData = z.infer<typeof vehicleStorageFormSchema>;
