import { z } from "zod";

export const tariffPlanCreateSchema = z.object({
  client_id: z.number().int().positive(),
  name: z.string().min(1, "Tariff name is required").max(255),
  valid_from: z.string().date(),
  valid_to: z.string().date().optional().nullable(),
  status: z.enum(["Active", "Archived"]).default("Active"),
  description: z.string().max(1000).optional().nullable(),
});

export const tariffPlanUpdateSchema = z.object({
  name: z.string().min(1, "Tariff name is required").max(255).optional(),
  valid_from: z.string().date().optional(),
  valid_to: z.string().date().optional().nullable(),
  status: z.enum(["Active", "Archived"]).optional(),
  description: z.string().max(1000).optional().nullable(),
});

export const tariffPlanSchema = z.object({
  id: z.number().int(),
  client_id: z.number().int(),
  name: z.string(),
  valid_from: z.date(),
  valid_to: z.date().nullable(),
  status: z.string(),
  description: z.string().nullable(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
});

export type TariffPlanCreate = z.infer<typeof tariffPlanCreateSchema>;
export type TariffPlanUpdate = z.infer<typeof tariffPlanUpdateSchema>;
export type TariffPlan = z.infer<typeof tariffPlanSchema>;
