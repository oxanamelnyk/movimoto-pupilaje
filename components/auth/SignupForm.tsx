"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import Link from "next/link";
import { signupSchema, type SignupInput } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    } as SignupInput,
    onSubmit: async ({ value }) => {
      setLoading(true);
      setError(null);

      try {
        const result = signupSchema.safeParse(value);
        if (!result.success) {
          const firstError = result.error.issues[0];
          setError(firstError?.message || "Validación fallida");
          return;
        }

        // TODO: Implement actual signup logic
        console.log("Signup with:", value);
        // const response = await signupAction(value);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al registrarse");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6">
        <h1 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h1>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = signupSchema.shape.email.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Correo</FieldLabel>
              <Input
                id={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="tu@correo.com"
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
          name="name"
          validators={{
            onChange: ({ value }) => {
              const result = signupSchema.shape.name.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Nombre Completo</FieldLabel>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Juan Pérez"
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
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = signupSchema.shape.password.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="••••••••"
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
          name="confirmPassword"
          validators={{
            onChange: ({ value }) => {
              const result =
                signupSchema.shape.confirmPassword.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Confirmar Contraseña</FieldLabel>
              <Input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="••••••••"
              />
              {field.state.meta.isTouched && field.state.meta.errors && (
                <p className="text-xs text-red-600">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </Field>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creando cuenta..." : "Regístrate"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
