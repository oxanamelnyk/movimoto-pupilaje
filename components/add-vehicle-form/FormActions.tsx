import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isLoading: boolean;
  onReset: () => void;
  isEditMode?: boolean;
}

export function FormActions({
  isLoading,
  onReset,
  isEditMode = false,
}: FormActionsProps) {
  return (
    <div className="sticky bottom-0 flex gap-3 p-6 bg-white border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="flex-1">
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="default"
        disabled={isLoading}
        className="flex-1">
        {isLoading
          ? "Guardando..."
          : isEditMode
            ? "Actualizar Vehículo"
            : "Guardar Vehículo"}
      </Button>
    </div>
  );
}
