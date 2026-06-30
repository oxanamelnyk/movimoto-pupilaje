import { Control } from "react-hook-form";
import { TextField } from "../fields/TextField";
import { DateField } from "../fields/DateField";
import { ComboboxField } from "../fields/ComboboxField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

interface PreparationInfoSectionProps {
  control: Control<VehicleStorageFormData>;
}

export function PreparationInfoSection({
  control,
}: PreparationInfoSectionProps) {
  const queryClient = useQueryClient();

  // Handler to create new preparation type
  const handleCreatePrepType = useCallback(
    async (prepTypeName: string) => {
      try {
        const response = await fetch("/api/preparation-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: prepTypeName }),
        });

        if (response.ok) {
          const newPrepType = await response.json();
          await queryClient.invalidateQueries({ queryKey: ["preparation-types"] });
          return newPrepType;
        } else {
          console.error("Failed to create preparation type");
          return null;
        }
      } catch (error) {
        console.error("Error creating preparation type:", error);
        return null;
      }
    },
    [queryClient]
  );

  // Fetch preparation types
  const { data: prepTypes = [] } = useQuery({
    queryKey: ["preparation-types"],
    queryFn: async () => {
      const res = await fetch("/api/preparation-types");
      return res.json();
    },
  });

  return (
    <FormSection icon="✏️" title="Información de Preparación">
      <div className="grid grid-cols-2 gap-4">
        <DateField
          control={control}
          name="request_date"
          label="Fecha de Solicitud"
          placeholder="Seleccionar fecha de solicitud"
        />

        <TextField
          control={control}
          name="requested_by"
          label="Solicitado Por"
          placeholder="Ingrese el nombre"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DateField
          control={control}
          name="preparation_date"
          label="Fecha de Preparación"
          placeholder="Seleccionar fecha de preparación"
        />

        <ComboboxField
          control={control}
          name="preparation_type_id"
          label="Tipo de Preparación"
          placeholder="Buscar tipo de preparación..."
          options={prepTypes.map((p: any) => ({ 
            value: String(p.id), 
            label: p.name 
          }))}
          onCreateNew={handleCreatePrepType}
        />
      </div>
    </FormSection>
  );
}
