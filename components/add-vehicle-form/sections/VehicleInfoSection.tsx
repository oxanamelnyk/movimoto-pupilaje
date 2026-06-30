"use client";

import { Control } from "react-hook-form";
import { TextField } from "../fields/TextField";
import { SelectField } from "../fields/SelectField";
import { ComboboxField } from "../fields/ComboboxField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";
import { useQuery } from "@tanstack/react-query";

interface VehicleInfoSectionProps {
  control: Control<VehicleStorageFormData>;
  clients: Array<{ id: number; name: string }>;
}

export function VehicleInfoSection({
  control,
  clients,
}: VehicleInfoSectionProps) {
  // Fetch brands
  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/brands");
      return res.json();
    },
  });

  // Fetch models
  const { data: models = [] } = useQuery({
    queryKey: ["models"],
    queryFn: async () => {
      const res = await fetch("/api/models");
      return res.json();
    },
  });

  // Fetch colors
  const { data: colors = [] } = useQuery({
    queryKey: ["colors"],
    queryFn: async () => {
      const res = await fetch("/api/colors");
      return res.json();
    },
  });

  // Fetch statuses
  const { data: statuses = [] } = useQuery({
    queryKey: ["vehicle-statuses"],
    queryFn: async () => {
      const res = await fetch("/api/vehicle-statuses");
      return res.json();
    },
  });

  return (
    <FormSection title="Información del Vehículo">
      <div className="grid grid-cols-2 gap-4">
        <ComboboxField
          control={control}
          name="client_id"
          label="Cliente"
          placeholder="Buscar cliente..."
          options={clients.map((c) => ({
            value: String(c.id),
            label: c.name || "",
          }))}
        />

        <SelectField
          control={control}
          name="status_id"
          label="Estado del Vehículo"
          placeholder="Seleccionar estado"
          options={statuses.map((s: any) => ({
            value: String(s.id),
            label: s.name,
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ComboboxField
          control={control}
          name="brand_id"
          label="Marca"
          placeholder="Buscar marca..."
          options={brands.map((b: any) => ({
            value: String(b.id),
            label: b.name,
          }))}
        />

        <ComboboxField
          control={control}
          name="model_id"
          label="Modelo"
          placeholder="Buscar modelo..."
          options={models.map((m: any) => ({
            value: String(m.id),
            label: m.name,
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          control={control}
          name="registration_identity"
          label="Bastidor / Matrícula"
          placeholder="Ingrese Bastidor / Matrícula"
        />
        <ComboboxField
          control={control}
          name="color_id"
          label="Color"
          placeholder="Buscar color..."
          options={colors.map((c: any) => ({
            value: String(c.id),
            label: c.name,
          }))}
        />
      </div>
    </FormSection>
  );
}
