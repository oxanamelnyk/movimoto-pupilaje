import { Control } from "react-hook-form";
import { TextField } from "../fields/TextField";
import { DateField } from "../fields/DateField";
import { SelectField } from "../fields/SelectField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";
import { useQuery } from "@tanstack/react-query";

interface PreparationInfoSectionProps {
  control: Control<VehicleStorageFormData>;
}

export function PreparationInfoSection({
  control,
}: PreparationInfoSectionProps) {
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

        <SelectField
          control={control}
          name="preparation_type_id"
          label="Tipo de Preparación"
          placeholder="Seleccionar tipo"
          options={prepTypes.map((p: any) => ({ value: String(p.id), label: p.name }))}
        />
      </div>
    </FormSection>
  );
}
