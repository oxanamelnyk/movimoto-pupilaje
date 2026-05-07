"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginInput,
    onSubmit: async ({ value }) => {
      setLoading(true);
      setError(null);

      try {
        const result = loginSchema.safeParse(value);
        if (!result.success) {
          setError("Email o contraseña inválidos");
          return;
        }

        // TODO: Implement actual login logic
        console.log("Login with:", value);
        // const response = await loginAction(value);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al iniciar sesión",
        );
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
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {/* eslint-disable-next-line react/no-children-prop */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = loginSchema.shape.email.safeParse(value);
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

        {/* eslint-disable-next-line react/no-children-prop */}
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = loginSchema.shape.password.safeParse(value);
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Button>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
