import { Control } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { TextField } from "../fields/TextField";
import { SelectField } from "../fields/SelectField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";

interface VehicleInfoSectionProps {
  control: Control<VehicleStorageFormData>;
  clients: Array<{ id: string; name: string }>;
}

export function VehicleInfoSection({
  control,
  clients,
}: VehicleInfoSectionProps) {
  return (
    <FormSection icon="🚗" title="Información del Vehículo">
      <div className="grid grid-cols-2 gap-4">
        <SelectField
          control={control}
          name="client_id"
          label="Cliente"
          placeholder="Seleccionar cliente"
          options={clients.map((c) => ({ value: c.id, label: c.name }))}
        />

        <SelectField
          control={control}
          name="status"
          label="Estado"
          options={[
            {
              value: "IN",
              label: "ENTRADA",
            },
            {
              value: "OUT",
              label: "SALIDA",
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          control={control}
          name="brand"
          label="Marca"
          placeholder="Ingrese la marca"
        />

        <TextField
          control={control}
          name="model"
          label="Modelo"
          placeholder="Ingrese el modelo"
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
