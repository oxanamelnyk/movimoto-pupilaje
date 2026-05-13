import { Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { TextField } from "../fields/TextField";
import { DateField } from "../fields/DateField";
import { SelectField } from "../fields/SelectField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";

interface StorageInfoSectionProps {
  control: Control<VehicleStorageFormData>;
  locations: Array<{ id: string; name: string }>;
}

export function StorageInfoSection({
  control,
  locations,
}: StorageInfoSectionProps) {
  return (
    <FormSection icon="📦" title="Información de Almacenamiento">
      <div className="grid grid-cols-2 gap-4">
        <DateField
          control={control}
          name="entry_date"
          label="Fecha de Entrada"
          placeholder="Seleccionar fecha de entrada"
        />

        <DateField
          control={control}
          name="exit_date"
          label="Fecha de Salida"
          placeholder="Seleccionar fecha de salida"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Días Totales</Label>
          <div className="flex items-center justify-center h-9 border border-gray-200 rounded-md bg-gray-50">
            <span className="text-sm font-medium">0</span>
          </div>
        </div>

        <SelectField
          control={control}
          name="location_id"
          label="Ubicación"
          placeholder="Seleccionar ubicación"
          options={locations.map((l) => ({ value: l.id, label: l.name }))}
        />
      </div>

      <TextField
        control={control}
        name="destination"
        label="Destino / Lugar de Entrega"
        placeholder="Ingrese destino o lugar de entrega"
      />
    </FormSection>
  );
}
