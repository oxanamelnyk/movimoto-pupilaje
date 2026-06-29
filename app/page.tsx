"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddVehicleDrawer } from "@/components/vehicles/AddVehicleDrawer";
import {
  AddVehicleForm,
  type VehicleStorageFormData,
} from "@/components/vehicles/AddVehicleForm";
import { VehiclesTable } from "@/components/vehicles/VehiclesTable";
import {
  useClients,
  useLocations,
  useCreateVehicleStorageRecord,
} from "@/hooks/useClients";

export default function Page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch data with TanStack Query
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();
  const createStorageRecord = useCreateVehicleStorageRecord();

  const handleAddVehicle = async (data: VehicleStorageFormData) => {
    try {
      await createStorageRecord.mutateAsync(data);
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Almacenamiento de Motos
          </h1>
          <p>Gestiona todos los motos en almacenamiento</p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={() => setIsDrawerOpen(true)}>
          <span>+</span> Añadir Moto
        </Button>
      </div>

      {/* Table */}
      <VehiclesTable />

      {/* Add Vehicle Drawer */}
      <AddVehicleDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <AddVehicleForm
          onSubmit={handleAddVehicle}
          isLoading={createStorageRecord.isPending}
          clients={clients}
          locations={locations}
        />
      </AddVehicleDrawer>
    </div>
  );
}
