"use client";

import { useCallback } from "react";
import { useWatch, type Control } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { TextField } from "../fields/TextField";
import { SelectField } from "../fields/SelectField";
import { ComboboxField } from "../fields/ComboboxField";
import { FormSection } from "../FormSection";
import type { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";

type OptionItem = {
  id: number;
  name: string;
};

type ModelItem = OptionItem & {
  brand_id: number;
};

interface VehicleInfoSectionProps {
  control: Control<VehicleStorageFormData>;
  clients: OptionItem[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function VehicleInfoSection({
  control,
  clients,
}: VehicleInfoSectionProps) {
  const queryClient = useQueryClient();

  const brandId = useWatch({
    control,
    name: "brand_id",
  });

  const handleCreateClient = useCallback(
    async (clientName: string) => {
      try {
        const response = await fetch("/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: clientName,
          }),
        });

        if (!response.ok) {
          const errorData: unknown = await response.json();

          console.error(
            "Failed to create client:",
            response.status,
            errorData
          );

          return null;
        }

        const newClient = (await response.json()) as OptionItem;

        await queryClient.invalidateQueries({
          queryKey: ["clients"],
        });

        return newClient;
      } catch (error: unknown) {
        console.error("Error creating client:", error);
        return null;
      }
    },
    [queryClient]
  );

  const handleCreateBrand = useCallback(
    async (brandName: string) => {
      try {
        const response = await fetch("/api/brands", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: brandName,
          }),
        });

        if (!response.ok) {
          const errorData: unknown = await response.json();

          console.error(
            "Failed to create brand:",
            response.status,
            errorData
          );

          return null;
        }

        const newBrand = (await response.json()) as OptionItem;

        await queryClient.invalidateQueries({
          queryKey: ["brands"],
        });

        return newBrand;
      } catch (error: unknown) {
        console.error("Error creating brand:", error);
        return null;
      }
    },
    [queryClient]
  );

  const handleCreateModel = useCallback(
    async (modelName: string) => {
      if (!brandId) {
        console.error(
          "Please select a brand before creating a model"
        );

        alert(
          "Por favor, selecciona una marca antes de crear un modelo"
        );

        return null;
      }

      try {
        const response = await fetch("/api/models", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: modelName,
            brand_id: brandId,
          }),
        });

        if (!response.ok) {
          const errorData: unknown = await response.json();

          console.error(
            "Failed to create model:",
            response.status,
            errorData
          );

          return null;
        }

        const newModel = (await response.json()) as ModelItem;

        await queryClient.invalidateQueries({
          queryKey: ["models"],
        });

        return newModel;
      } catch (error: unknown) {
        console.error("Error creating model:", error);
        return null;
      }
    },
    [queryClient, brandId]
  );

  const handleCreateColor = useCallback(
    async (colorName: string) => {
      try {
        const response = await fetch("/api/colors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: colorName,
          }),
        });

        if (!response.ok) {
          const errorData: unknown = await response.json();

          console.error(
            "Failed to create color:",
            response.status,
            errorData
          );

          return null;
        }

        const newColor = (await response.json()) as OptionItem;

        await queryClient.invalidateQueries({
          queryKey: ["colors"],
        });

        return newColor;
      } catch (error: unknown) {
        console.error("Error creating color:", error);
        return null;
      }
    },
    [queryClient]
  );

  const { data: brands = [] } = useQuery<OptionItem[]>({
    queryKey: ["brands"],
    queryFn: () => fetchJson<OptionItem[]>("/api/brands"),
  });

  const { data: models = [] } = useQuery<ModelItem[]>({
    queryKey: ["models"],
    queryFn: () => fetchJson<ModelItem[]>("/api/models"),
  });

  const { data: colors = [] } = useQuery<OptionItem[]>({
    queryKey: ["colors"],
    queryFn: () => fetchJson<OptionItem[]>("/api/colors"),
  });

  const { data: statuses = [] } = useQuery<OptionItem[]>({
    queryKey: ["vehicle-statuses"],
    queryFn: () =>
      fetchJson<OptionItem[]>("/api/vehicle-statuses"),
  });

  const filteredModels = brandId
    ? models.filter((model) => model.brand_id === brandId)
    : models;

  return (
    <FormSection title="Información del Vehículo">
      <div className="grid grid-cols-2 gap-4">
        <ComboboxField
          control={control}
          name="client_id"
          label="Cliente"
          placeholder="Buscar cliente..."
          options={clients.map((client) => ({
            value: String(client.id),
            label: client.name || "",
          }))}
          onCreateNew={handleCreateClient}
        />

        <SelectField
          control={control}
          name="status_id"
          label="Estado del Vehículo"
          placeholder="Seleccionar estado"
          options={statuses.map((status) => ({
            value: String(status.id),
            label: status.name,
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ComboboxField
          control={control}
          name="brand_id"
          label="Marca"
          placeholder="Buscar marca..."
          options={brands.map((brand) => ({
            value: String(brand.id),
            label: brand.name,
          }))}
          onCreateNew={handleCreateBrand}
        />

        <ComboboxField
          control={control}
          name="model_id"
          label="Modelo"
          placeholder="Buscar modelo..."
          options={filteredModels.map((model) => ({
            value: String(model.id),
            label: model.name,
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
          options={colors.map((color) => ({
            value: String(color.id),
            label: color.name,
          }))}
          onCreateNew={handleCreateColor}
        />
      </div>
    </FormSection>
  );
}