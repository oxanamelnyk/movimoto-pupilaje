"use client";

import { Control, useWatch } from "react-hook-form";
import { TextField } from "../fields/TextField";
import { SelectField } from "../fields/SelectField";
import { ComboboxField } from "../fields/ComboboxField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";
import { useEstadoVehiculo } from "@/hooks/useEstadoVehiculo";

interface VehicleInfoSectionProps {
  control: Control<VehicleStorageFormData>;
  clients: Array<{ id_cliente: number; nombre_comercial: string }>;
}

export function VehicleInfoSection({
  control,
  clients,
}: VehicleInfoSectionProps) {
  const { options: estadoOptions, loading: estadoLoading } = useEstadoVehiculo();
  const brand = useWatch({ control, name: "brand" });
  const modelsUrl = brand
    ? `/api/vehicles/models?brand=${encodeURIComponent(brand)}`
    : "/api/vehicles/models";

  return (
    <FormSection icon="🚗" title="Información del Vehículo">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          control={control}
          name="client_id"
          label="Cliente"
          placeholder="Seleccionar cliente"
          options={clients.map((c) => ({ value: String(c.id_cliente), label: c.nombre_comercial || "" }))}
        />

        <SelectField
          control={control}
          name="estado"
          label="Estado del Vehículo"
          options={estadoOptions}
          disabled={estadoLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ComboboxField
          control={control}
          name="brand"
          label="Marca"
          placeholder="Buscar marca..."
          fetchUrl="/api/vehicles/brands"
          onCreateNew={(value) => console.log("New brand created:", value)}
        />

        <ComboboxField
          control={control}
          name="model"
          label="Modelo"
          placeholder="Buscar modelo..."
          fetchUrl={modelsUrl}
          onCreateNew={(value) => console.log("New model created:", value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          control={control}
          name="vin_or_plate"
          label="Bastidor/Matricula"
          placeholder="Ingrese VIN o número de placa"
        />

        <TextField
          control={control}
          name="color"
          label="Color"
          placeholder="Ingrese el color"
        />
      </div>
    </FormSection>
  );
}
