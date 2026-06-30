import { Control, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { TextField } from "../fields/TextField";
import { DateField } from "../fields/DateField";
import { SelectField } from "../fields/SelectField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface StorageInfoSectionProps {
  control: Control<VehicleStorageFormData>;
  locations?: Array<{ id: number; name: string }>;
}

export function StorageInfoSection({
  control,
  locations,
}: StorageInfoSectionProps) {
  // Watch entry_date and exit_date for calculation
  const entry_date = useWatch({ control, name: "entry_date" });
  const exit_date = useWatch({ control, name: "exit_date" });

  // Calculate total days
  const diasTotales = useMemo(() => {
    if (!entry_date || !exit_date) return "";

    const startDate = new Date(entry_date);
    const endDate = new Date(exit_date);

    // Calculate days using DAYS360-like logic
    const days = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return days < 1 ? "" : days;
  }, [entry_date, exit_date]);

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
        <div>
          <Label>Días Totales</Label>
          <div className="mt-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium">
            {diasTotales || "-"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <SelectField
          control={control}
          name="location_id"
          label="Ubicación"
          placeholder="Seleccionar ubicación"
          options={storageLocations.map((l: any) => ({
            value: String(l.id),
            label: l.name,
          }))}
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
