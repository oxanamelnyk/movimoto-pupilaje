"use client";

import { Control, useWatch } from "react-hook-form";
import { useCallback } from "react";
import { TextField } from "../fields/TextField";
import { SelectField } from "../fields/SelectField";
import { ComboboxField } from "../fields/ComboboxField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface VehicleInfoSectionProps {
  control: Control<VehicleStorageFormData>;
  clients: Array<{ id: number; name: string }>;
}

export function VehicleInfoSection({
  control,
  clients,
}: VehicleInfoSectionProps) {
  const queryClient = useQueryClient();
  const brand_id = useWatch({ control, name: "brand_id" });

  // Handler to create new client
  const handleCreateClient = useCallback(
    async (clientName: string) => {
      try {
        const response = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: clientName }),
        });

        if (response.ok) {
          const newClient = await response.json();
          // Invalidate the clients query to refresh the list
          await queryClient.invalidateQueries({ queryKey: ["clients"] });
          return newClient;
        } else {
          const errorData = await response.json();
          console.error("Failed to create client:", response.status, errorData);
          return null;
        }
      } catch (error) {
        console.error("Error creating client:", error);
        return null;
      }
    },
    [queryClient],
  );

  // Handler to create new brand
  const handleCreateBrand = useCallback(
    async (brandName: string) => {
      try {
        const response = await fetch("/api/brands", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: brandName }),
        });

        if (response.ok) {
          const newBrand = await response.json();
          await queryClient.invalidateQueries({ queryKey: ["brands"] });
          return newBrand;
        } else {
          const errorData = await response.json();
          console.error("Failed to create brand:", response.status, errorData);
          return null;
        }
      } catch (error) {
        console.error("Error creating brand:", error);
        return null;
      }
    },
    [queryClient],
  );

  // Handler to create new model
  const handleCreateModel = useCallback(
    async (modelName: string) => {
      if (!brand_id) {
        console.error("Please select a brand before creating a model");
        alert("Por favor, selecciona una marca antes de crear un modelo");
        return null;
      }

      try {
        const response = await fetch("/api/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: modelName,
            brand_id: parseInt(brand_id, 10),
          }),
        });

        if (response.ok) {
          const newModel = await response.json();
          await queryClient.invalidateQueries({ queryKey: ["models"] });
          return newModel;
        } else {
          const errorData = await response.json();
          console.error("Failed to create model:", response.status, errorData);
          return null;
        }
      } catch (error) {
        console.error("Error creating model:", error);
        return null;
      }
    },
    [queryClient, brand_id],
  );

  // Handler to create new color
  const handleCreateColor = useCallback(
    async (colorName: string) => {
      try {
        const response = await fetch("/api/colors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: colorName }),
        });

        if (response.ok) {
          const newColor = await response.json();
          // Invalidate the colors query to refresh the list
          await queryClient.invalidateQueries({ queryKey: ["colors"] });
          return newColor;
        } else {
          const errorData = await response.json();
          console.error("Failed to create color:", response.status, errorData);
          return null;
        }
      } catch (error) {
        console.error("Error creating color:", error);
        return null;
      }
    },
    [queryClient],
  );

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
          onCreateNew={handleCreateClient}
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
          onCreateNew={handleCreateBrand}
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
          onCreateNew={handleCreateModel}
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
          onCreateNew={handleCreateColor}
        />
      </div>
    </FormSection>
  );
}
