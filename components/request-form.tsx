"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  requestFormSchema,
  type RequestFormInput,
} from "@/src/validators/request-form";

type DurationOption = {
  value: string;
  label: string;
};

const durationOptions: DurationOption[] = [
  { value: "1_mes", label: "1 mes" },
  { value: "2_3_meses", label: "2-3 meses" },
  { value: "3_6_meses", label: "3-6 meses" },
  { value: "mas_6_meses", label: "Más de 6 meses" },
  { value: "no_se", label: "No lo sé todavía" },
];

export function RequestForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      nombre: "",
      numeroContacto: "",
      correo: "",
      duracionEstimada: "1_mes",
      fechaInicio: "",
      mensaje: "",
    } as unknown as RequestFormInput,
    onSubmit: async ({ value }) => {
      setLoading(true);
      setError(null);

      try {
        const result = requestFormSchema.safeParse(value);
        if (!result.success) {
          setError("Por favor completa todos los campos requeridos");
          return;
        }

        // TODO: Implement actual form submission
        console.log("Form submitted:", value);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al enviar el formulario",
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Solicita tu plaza</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Déjanos tus datos y te contactaremos para confirmar disponibilidad,
            fechas y precio.
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200">
            ¡Solicitud enviada exitosamente!
          </div>
        )}

        <form.Field
          name="nombre"
          validators={{
            onChange: ({ value }) => {
              const result = requestFormSchema.shape.nombre.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Nombre *</FieldLabel>
              <Input
                id={field.name}
                type="text"
                placeholder="Tu nombre completo"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors && (
                <p className="text-xs text-red-600">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </Field>
          )}
        />

        <form.Field
          name="numeroContacto"
          validators={{
            onChange: ({ value }) => {
              const result =
                requestFormSchema.shape.numeroContacto.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Número de contacto *</FieldLabel>
              <Input
                id={field.name}
                type="tel"
                placeholder="Tu número de teléfono"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors && (
                <p className="text-xs text-red-600">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </Field>
          )}
        />

        <form.Field
          name="correo"
          validators={{
            onChange: ({ value }) => {
              const result = requestFormSchema.shape.correo.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Correo *</FieldLabel>
              <Input
                id={field.name}
                type="email"
                placeholder="tu.email@ejemplo.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors && (
                <p className="text-xs text-red-600">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </Field>
          )}
        />

        <form.Field
          name="duracionEstimada"
          validators={{
            onChange: ({ value }) => {
              const result =
                requestFormSchema.shape.duracionEstimada.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Duración estimada *</FieldLabel>
              <select
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  field.handleChange(e.target.value as any);
                }}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Selecciona una duración</option>
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {field.state.meta.isTouched && field.state.meta.errors && (
                <p className="text-xs text-red-600">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </Field>
          )}
        />

        <form.Field
          name="fechaInicio"
          validators={{
            onChange: ({ value }) => {
              const result =
                requestFormSchema.shape.fechaInicio.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Fecha de inicio *</FieldLabel>
              <Input
                id={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors && (
                <p className="text-xs text-red-600">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </Field>
          )}
        />

        <form.Field
          name="mensaje"
          validators={{
            onChange: ({ value }) => {
              const result = requestFormSchema.shape.mensaje.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Mensaje (opcional)</FieldLabel>
              <textarea
                id={field.name}
                placeholder="Cuéntanos algún detalle (opcional)"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-20 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </Field>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Enviando..." : "Enviar solicitud"}
        </Button>
      </FieldGroup>
    </form>
  );
}
