import { z } from "zod";

export const clientCreateSchema = z.object({
  name: z.string().min(1, "Client name is required").max(255),
});

export const clientUpdateSchema = z.object({
  name: z.string().min(1, "Client name is required").max(255).optional(),
});

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.date().nullable(),
});

export type ClientCreate = z.infer<typeof clientCreateSchema>;
export type ClientUpdate = z.infer<typeof clientUpdateSchema>;
export type Client = z.infer<typeof clientSchema>;
