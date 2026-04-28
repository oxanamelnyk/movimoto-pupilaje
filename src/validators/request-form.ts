import { z } from "zod";

export const requestFormSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  numeroContacto: z.string().regex(/^\d+$/, "Debe ser un número válido"),
  correo: z.email("Email inválido"),
  duracionEstimada: z.enum(
    ["1_mes", "2_3_meses", "3_6_meses", "mas_6_meses", "no_se"],
    { message: "Selecciona una duración estimada" }
  ),
  fechaInicio: z.string().min(1, "Selecciona una fecha"),
  mensaje: z.string().optional(),
});

export type RequestFormInput = z.infer<typeof requestFormSchema>;
