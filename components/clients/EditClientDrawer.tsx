"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export type ClientRecord = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  created_at: string | null;
  updated_at: string | null;
};

type EditClientDrawerProps = {
  clientId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (client: ClientRecord) => void;
};

const emptyForm = { name: "", email: "", phone: "" };

export function EditClientDrawer({
  clientId,
  open,
  onOpenChange,
  onSaved,
}: EditClientDrawerProps) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || clientId === null) return;

    const loadClient = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/clients/${clientId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No se pudo cargar el cliente");
        }

        setFormData({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar el cliente",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadClient();
  }, [clientId, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (clientId === null) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo actualizar el cliente");
      }

      onSaved(data);
      onOpenChange(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo actualizar el cliente",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-y-auto overflow-x-hidden">
        <DrawerHeader>
          <DrawerTitle>Editar cliente</DrawerTitle>
          <DrawerDescription>
            Actualiza los datos de contacto del cliente.
          </DrawerDescription>
        </DrawerHeader>

        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 p-4">
            {loading ? (
              <FieldGroup>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </FieldGroup>
            ) : (
              <FieldGroup>
                {error && <FieldError>{error}</FieldError>}

                <Field>
                  <FieldLabel htmlFor="edit-client-name">Nombre</FieldLabel>
                  <Input
                    id="edit-client-name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                    disabled={saving}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="edit-client-email">Email</FieldLabel>
                  <Input
                    id="edit-client-email"
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    disabled={saving}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="edit-client-phone">
                    Teléfono
                  </FieldLabel>
                  <Input
                    id="edit-client-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    disabled={saving}
                  />
                </Field>
              </FieldGroup>
            )}
          </div>

          <DrawerFooter className="flex-row">
                  <Button
              className="flex-1"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              type="submit"
              disabled={loading || saving || !formData.name.trim()}
            >
              <Save data-icon="inline-start" />
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
      
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
