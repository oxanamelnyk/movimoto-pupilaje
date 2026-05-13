import { Control } from "react-hook-form";
import { TextField } from "../fields/TextField";
import { DateField } from "../fields/DateField";
import { SelectField } from "../fields/SelectField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";

interface PreparationInfoSectionProps {
  control: Control<VehicleStorageFormData>;
}

export function PreparationInfoSection({
  control,
}: PreparationInfoSectionProps) {
  return (
    <FormSection icon="✈️" title="Información de Preparación">
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
          name="unpacking_date"
          label="Fecha de Desencaje"
          placeholder="Seleccionar fecha de desencaje"
        />

        <SelectField
          control={control}
          name="unpacking_type"
          label="Tipo de Desencaje"
          placeholder="Seleccionar tipo"
          options={[
            { value: "full", label: "Con montaje" },
            { value: "partial", label: "Sin montaje" },
          ]}
        />
      </div>
    </FormSection>
  );
}
