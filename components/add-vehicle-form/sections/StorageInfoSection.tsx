import { Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { TextField } from "../fields/TextField";
import { DateField } from "../fields/DateField";
import { SelectField } from "../fields/SelectField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";
import { useQuery } from "@tanstack/react-query";

interface StorageInfoSectionProps {
  control: Control<VehicleStorageFormData>;
  locations?: Array<{ id: number; name: string }>;
}

export function StorageInfoSection({
  control,
  locations,
}: StorageInfoSectionProps) {
  // Fetch storage locations
  const { data: storageLocations = [] } = useQuery({
    queryKey: ["storage-locations"],
    queryFn: async () => {
      const res = await fetch("/api/storage-locations");
      return res.json();
    },
  });

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

      <div className="grid grid-cols-1 gap-4">
        <SelectField
          control={control}
          name="location_id"
          label="Ubicación"
          placeholder="Seleccionar ubicación"
          options={storageLocations.map((l: any) => ({ value: String(l.id), label: l.name }))}
        />
      </div>

      <TextField
        control={control}
        name="delivery_place"
        label="Lugar de Entrega"
        placeholder="Ingrese lugar de entrega"
      />
    </FormSection>
  );
}
