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
  useUpdateVehicleStorageRecord,
} from "@/hooks/useClients";

type VehicleWithRelations = {
  id: number;
  client_id: number;
  brand_id: number;
  model_id: number;
  color_id?: number | null;
  status_id: number;
  registration_identity?: string | null;
  notes?: string | null;
  created_at?: Date | string | null;
  client_name?: string | null;
  brand_name?: string | null;
  model_name?: string | null;
  color_name?: string | null;
  status_name?: string | null;
  entry_date?: string | null;
  exit_date?: string | null;
  delivery_place?: string | null;
  location_id?: number | null;
  location_name?: string | null;
  preparation_date?: string | null;
  request_date?: string | null;
  preparation_type_name?: string | null;
};

export default function Page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleWithRelations | null>(null);
  const isEditMode = selectedVehicle !== null;

  // Fetch data with TanStack Query
  const { data: clients = [], isLoading: clientsLoading } = useClients();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();
  const createStorageRecord = useCreateVehicleStorageRecord();
  const updateStorageRecord = useUpdateVehicleStorageRecord();

  const handleAddClick = () => {
    setSelectedVehicle(null);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (vehicle: VehicleWithRelations) => {
    setSelectedVehicle(vehicle);
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (data: VehicleStorageFormData) => {
    try {
      if (isEditMode && selectedVehicle) {
        await updateStorageRecord.mutateAsync({
          id: selectedVehicle.id,
          data,
        });
      } else {
        await createStorageRecord.mutateAsync(data);
      }
      setIsDrawerOpen(false);
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Error saving vehicle:", error);
    }
  };

  const getInitialData = (): Partial<VehicleStorageFormData> | undefined => {
    if (!selectedVehicle) return undefined;

    return {
      client_id: selectedVehicle.client_id || 0,
      brand_id: selectedVehicle.brand_id || 0,
      model_id: selectedVehicle.model_id || 0,
      color_id: selectedVehicle.color_id || null,
      status_id: selectedVehicle.status_id || 0,
      registration_identity: selectedVehicle.registration_identity || "",
      entry_date:
        selectedVehicle.entry_date || new Date().toISOString().split("T")[0],
      exit_date: selectedVehicle.exit_date || null,
      location_id: selectedVehicle.location_id || 0,
      delivery_place: selectedVehicle.delivery_place || "",
      request_date: selectedVehicle.request_date || null,
      requested_by: "",
      preparation_date: selectedVehicle.preparation_date || null,
      preparation_type_id: null,
      notes: selectedVehicle.notes || "",
    };
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
        <Button className="gap-2 shrink-0" onClick={handleAddClick}>
          <span>+</span> Añadir Moto
        </Button>
      </div>

      {/* Table */}
      <VehiclesTable onRowClick={handleRowClick} />

      {/* Add/Edit Vehicle Drawer */}
      <AddVehicleDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={isEditMode ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}
        description={
          isEditMode
            ? "Actualizar información del vehículo y almacenamiento"
            : "Agregar información del vehículo y almacenamiento"
        }>
        <AddVehicleForm
          onSubmit={handleSubmit}
          isLoading={
            isEditMode
              ? updateStorageRecord.isPending
              : createStorageRecord.isPending
          }
          clients={clients}
          locations={locations}
          initialData={getInitialData()}
          isEditMode={isEditMode}
        />
      </AddVehicleDrawer>
    </div>
  );
}
