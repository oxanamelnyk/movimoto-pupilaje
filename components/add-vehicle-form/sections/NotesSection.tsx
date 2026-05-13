import { Control } from "react-hook-form";
import { TextareaField } from "../fields/TextareaField";
import { FormSection } from "../FormSection";
import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";

interface NotesSectionProps {
  control: Control<VehicleStorageFormData>;
}

export function NotesSection({ control }: NotesSectionProps) {
  return (
    <FormSection icon="📝" title="Notas">
      <TextareaField
        control={control}
        name="notes"
        label="Notas / Anotaciones / Otra Información"
        placeholder="Ingrese notas o cualquier información adicional..."
      />
    </FormSection>
  );
}
