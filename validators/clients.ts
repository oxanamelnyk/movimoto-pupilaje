import { z } from "zod";

export const clientCreateSchema = z.object({
  tipo_cliente: z.enum(["empresa", "particular"]),
  nombre_comercial: z.string().max(50).optional(),
  nombre_fiscal: z.string().max(50).optional(),
  dni_nif: z.string().max(12).optional(),
  email: z.string().email().max(75).optional(),
  telefono: z.string().max(20).optional(),
  notas: z.string().optional(),
  calle: z.string().max(100).optional(),
  provincia: z.string().max(50).optional(),
  pais: z.string().max(50).optional(),
  codigo_postal: z.string().max(10).optional(),
  ciudad: z.string().max(50).optional(),
  es_pupilaje: z.boolean().default(false),
});

export const clientUpdateSchema = z.object({
  tipo_cliente: z.enum(["empresa", "particular"]).optional(),
  nombre_comercial: z.string().max(50).optional(),
  nombre_fiscal: z.string().max(50).optional(),
  dni_nif: z.string().max(12).optional(),
  email: z.string().email().max(75).optional(),
  telefono: z.string().max(20).optional(),
  notas: z.string().optional(),
  calle: z.string().max(100).optional(),
  provincia: z.string().max(50).optional(),
  pais: z.string().max(50).optional(),
  codigo_postal: z.string().max(10).optional(),
  ciudad: z.string().max(50).optional(),
  es_pupilaje: z.boolean().optional(),
});

export const clientSchema = z.object({
  id_cliente: z.number(),
  tipo_cliente: z.enum(["empresa", "particular"]),
  nombre_comercial: z.string().nullable(),
  nombre_fiscal: z.string().nullable(),
  dni_nif: z.string().nullable(),
  email: z.string().nullable(),
  telefono: z.string().nullable(),
  notas: z.string().nullable(),
  calle: z.string().nullable(),
  provincia: z.string().nullable(),
  pais: z.string().nullable(),
  codigo_postal: z.string().nullable(),
  ciudad: z.string().nullable(),
  fecha_registro: z.date().nullable(),
  ocultar_info_econ: z.boolean(),
  es_pupilaje: z.boolean(),
});

export type ClientCreate = z.infer<typeof clientCreateSchema>;
export type ClientUpdate = z.infer<typeof clientUpdateSchema>;
export type Client = z.infer<typeof clientSchema>;
