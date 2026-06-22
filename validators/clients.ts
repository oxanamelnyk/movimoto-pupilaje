import { z } from "zod";

export const clientCreateSchema = z.object({
  name: z.string().min(1, "Client name is required").max(255),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
});

export const clientUpdateSchema = z.object({
  name: z.string().min(1, "Client name is required").max(255).optional(),
  phone: z.string().max(50).optional().nullable(),
  email: z.string().email().max(255).optional().nullable(),
});

export const clientSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  created_at: z.date().nullable(),
});

export type ClientCreate = z.infer<typeof clientCreateSchema>;
export type ClientUpdate = z.infer<typeof clientUpdateSchema>;
export type Client = z.infer<typeof clientSchema>;
