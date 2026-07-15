import { z } from "zod";

export const tariffServiceCreateSchema = z.object({
  tariff_id: z.number().int().positive(),
  name: z.string().min(1, "Service name is required").max(255),
  price: z.string().or(z.number()).default("0.00"),
  unit: z.string().min(1, "Unit is required").max(50),
  type: z.enum(["Fixed", "Variable"]).default("Fixed"),
  discount: z.string().or(z.number()).optional().nullable(),
  category: z.enum(["Delivery", "Storage"]),
});

export const tariffServiceUpdateSchema = z.object({
  name: z.string().min(1, "Service name is required").max(255).optional(),
  price: z.string().or(z.number()).optional(),
  unit: z.string().min(1, "Unit is required").max(50).optional(),
  type: z.enum(["Fixed", "Variable"]).optional(),
  discount: z.string().or(z.number()).optional().nullable(),
  category: z.enum(["Delivery", "Storage"]).optional(),
});

export const tariffServiceSchema = z.object({
  id: z.number().int(),
  tariff_id: z.number().int(),
  name: z.string(),
  price: z.string(),
  unit: z.string(),
  type: z.string(),
  discount: z.string().nullable(),
  category: z.string(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
});

export type TariffServiceCreate = z.infer<typeof tariffServiceCreateSchema>;
export type TariffServiceUpdate = z.infer<typeof tariffServiceUpdateSchema>;
export type TariffService = z.infer<typeof tariffServiceSchema>;
