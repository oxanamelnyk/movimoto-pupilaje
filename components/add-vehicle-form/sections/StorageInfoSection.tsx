import { Control, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { TextField } from "../fields/TextField";
import { DateField } from "../fields/DateField";
import { ComboboxField } from "../fields/ComboboxField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { calculateDaysBetween } from "@/lib/date-utils";

interface StorageInfoSectionProps {
  control: Control<VehicleStorageFormData>;
}

export function StorageInfoSection({ control }: StorageInfoSectionProps) {
  const queryClient = useQueryClient();

  // Handler to create new storage location
  const handleCreateLocation = useCallback(
    async (locationName: string) => {
      try {
        const response = await fetch("/api/storage-locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: locationName }),
        });

        if (response.ok) {
          const newLocation = await response.json();
          await queryClient.invalidateQueries({
            queryKey: ["storage-locations"],
          });
          return newLocation;
        } else {
          console.error("Failed to create storage location");
          return null;
        }
      } catch (error) {
        console.error("Error creating storage location:", error);
        return null;
      }
    },
    [queryClient],
  );

  // Watch entry_date and exit_date for calculation
  const entry_date = useWatch({ control, name: "entry_date" });
  const exit_date = useWatch({ control, name: "exit_date" });

  // Calculate total days using DAYS360
  const diasTotales = useMemo(() => {
    return calculateDaysBetween(entry_date, exit_date);
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
            {entry_date ? (diasTotales !== "" ? diasTotales : "0") : "-"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ComboboxField
          control={control}
          name="location_id"
          label="Ubicación"
          placeholder="Buscar ubicación..."
          options={storageLocations.map((l: { id: number; name: string }) => ({
            value: String(l.id),
            label: l.name,
          }))}
          onCreateNew={handleCreateLocation}
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
