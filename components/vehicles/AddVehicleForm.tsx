"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  vehicleStorageFormSchema,
  type VehicleStorageFormData,
} from "@/schemas/vehicle-storage.schema";
import { defaultValues } from "@/components/add-vehicle-form/default-values";
import { VehicleInfoSection } from "@/components/add-vehicle-form/sections/VehicleInfoSection";
import { StorageInfoSection } from "@/components/add-vehicle-form/sections/StorageInfoSection";
import { PreparationInfoSection } from "@/components/add-vehicle-form/sections/PreparationInfoSection";
import { NotesSection } from "@/components/add-vehicle-form/sections/NotesSection";
import { FormActions } from "@/components/add-vehicle-form/FormActions";

export type { VehicleStorageFormData };

interface AddVehicleFormProps {
  onSubmit: (data: VehicleStorageFormData) => Promise<void>;
  isLoading?: boolean;
  clients?: Array<{ id: number; name: string | null }>;
  locations?: Array<{ id: number; name: string }>;
}

export function AddVehicleForm({
  onSubmit,
  isLoading = false,
  clients = [],
  locations = [],
}: AddVehicleFormProps) {
  const form = useForm<VehicleStorageFormData>({
    resolver: zodResolver(vehicleStorageFormSchema),
    defaultValues,
  });

  const handleSubmit = async (data: VehicleStorageFormData) => {
    await onSubmit(data);
    form.reset();
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

        <FormActions isLoading={isLoading} onReset={() => form.reset()} />
      </form>
    </Form>
  );
}
