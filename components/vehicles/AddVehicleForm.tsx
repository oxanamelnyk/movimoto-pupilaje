"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  vehicleStorageFormSchema,
  type VehicleStorageFormData,
} from "@/schemas/vehicle-storage.schema";
import { getDefaultValues } from "@/components/add-vehicle-form/default-values";
import { VehicleInfoSection } from "@/components/add-vehicle-form/sections/VehicleInfoSection";
import { StorageInfoSection } from "@/components/add-vehicle-form/sections/StorageInfoSection";
import { PreparationInfoSection } from "@/components/add-vehicle-form/sections/PreparationInfoSection";
import { NotesSection } from "@/components/add-vehicle-form/sections/NotesSection";
import { FormActions } from "@/components/add-vehicle-form/FormActions";

export type { VehicleStorageFormData };

interface AddVehicleFormProps {
  onSubmit: (data: VehicleStorageFormData) => Promise<void>;
  onClose?: () => void;
  isLoading?: boolean;
  clients?: Array<{ id: number; name: string | null }>;
  locations?: Array<{ id: number; name: string }>;
  initialData?: Partial<VehicleStorageFormData>;
  isEditMode?: boolean;
}

export function AddVehicleForm({
  onSubmit,
  onClose,
  isLoading = false,
  clients = [],
  locations = [],
  initialData,
  isEditMode = false,
}: AddVehicleFormProps) {
  const form = useForm<VehicleStorageFormData>({
    resolver: zodResolver(vehicleStorageFormSchema),
    defaultValues: initialData || getDefaultValues(),
  });

  const handleSubmit = async (data: VehicleStorageFormData) => {
    // Ensure color_id is a number, not a string
    if (data.color_id && typeof data.color_id === "string") {
      // Try to convert numeric string to number
      const numValue = parseInt(data.color_id, 10);
      if (!isNaN(numValue)) {
        data.color_id = numValue;
      } else {
        // If it's not a valid number, clear it
        data.color_id = null;
      }
    }

    await onSubmit(data);
    if (!isEditMode) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="p-4 space-y-3">
          <VehicleInfoSection control={form.control} clients={clients} />

          <StorageInfoSection control={form.control} locations={locations} />

          <PreparationInfoSection control={form.control} />

          <NotesSection control={form.control} />
        </div>

        <FormActions
          isLoading={isLoading}
          onReset={() => {
            form.reset();
            onClose?.();
          }}
          isEditMode={isEditMode}
        />
      </form>
    </Form>
  );
}
