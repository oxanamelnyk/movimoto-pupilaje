import { z } from "zod";

export const locationCreateSchema = z.object({
  name: z.string().min(1, "Location name is required").max(255),
});

export const locationUpdateSchema = z.object({
  name: z.string().min(1, "Location name is required").max(255).optional(),
});

export const locationSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  created_at: z.date().nullable(),
});

export type LocationCreate = z.infer<typeof locationCreateSchema>;
export type LocationUpdate = z.infer<typeof locationUpdateSchema>;
export type Location = z.infer<typeof locationSchema>;
