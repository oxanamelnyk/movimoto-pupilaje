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
  VehiclesTableFilters,
  type VehicleFilters,
} from "@/components/vehicles/VehiclesTableFilters";
import { InvoiceGenerator } from "@/components/invoices/InvoiceGenerator";
import { exportVehiclesToExcel } from "@/lib/export-utils";
import {
  useClients,
  useLocations,
  useCreateVehicleStorageRecord,
  useUpdateVehicleStorageRecord,
  useVehicles,
  useVehicleStatuses,
} from "@/hooks/useClients";
import { Download, FileText } from "lucide-react";

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
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleWithRelations | null>(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<number[]>([]);
  const [filters, setFilters] = useState<VehicleFilters>({
    clientId: undefined,
    statusId: undefined,
    entryDateFrom: undefined,
    entryDateTo: undefined,
    exitDateFrom: undefined,
    exitDateTo: undefined,
  });

  // Default pricing rates
  const pricingRates = {
    dailyRate: 0.34,
    handlingInOut: 3.0,
    disassemblyWithoutWheels: 17.0,
    disassemblyWithWheels: 24.0,
    wasteDisposal: 2.5,
  };

  const isEditMode = selectedVehicle !== null;

  // Fetch all vehicles for filtering
  const { data: vehicleData = { vehicles: [], total: 0 } } = useVehicles(
    1,
    1000,
  );
  const allVehicles = vehicleData.vehicles || [];

  // Fetch data with TanStack Query
  const { data: clients = [] } = useClients();
  const { data: statuses = [] } = useVehicleStatuses();
  const { data: locations = [] } = useLocations();
  const createStorageRecord = useCreateVehicleStorageRecord();
  const updateStorageRecord = useUpdateVehicleStorageRecord();

  // Get selected vehicles for export from all vehicles (respecting filters)
  const vehiclesToExport = allVehicles.filter(
    (vehicle: VehicleWithRelations) => {
      // Apply filters
      if (filters.clientId && vehicle.client_id !== filters.clientId)
        return false;
      if (filters.statusId && vehicle.status_id !== filters.statusId)
        return false;

      if (filters.entryDateFrom && vehicle.entry_date) {
        if (new Date(vehicle.entry_date) < new Date(filters.entryDateFrom))
          return false;
      }
      if (filters.entryDateTo && vehicle.entry_date) {
        if (new Date(vehicle.entry_date) > new Date(filters.entryDateTo))
          return false;
      }

      if (filters.exitDateFrom && vehicle.exit_date) {
        if (new Date(vehicle.exit_date) < new Date(filters.exitDateFrom))
          return false;
      }
      if (filters.exitDateTo && vehicle.exit_date) {
        if (new Date(vehicle.exit_date) > new Date(filters.exitDateTo))
          return false;
      }

      // Only include if selected
      return selectedVehicleIds.includes(vehicle.id);
    },
  );

  // Get selected vehicles for invoice
  const selectedVehiclesForInvoice = allVehicles.filter(
    (vehicle: VehicleWithRelations) => selectedVehicleIds.includes(vehicle.id),
  );

  // Get the client name from the first selected vehicle
  const invoiceClientName =
    selectedVehiclesForInvoice[0]?.client_name || "Cliente";

  const handleAddClick = () => {
    setSelectedVehicle(null);
    setIsDrawerOpen(true);
  };

  const handleRowClick = (vehicle: VehicleWithRelations) => {
    setSelectedVehicle(vehicle);
    setIsDrawerOpen(true);
  };

  const handleExportExcel = () => {
    if (vehiclesToExport.length === 0) return;
    const timestamp = new Date().toLocaleDateString("es-ES");
    exportVehiclesToExcel(vehiclesToExport, `almacenamiento-${timestamp}.csv`);
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
      requested_by: selectedVehicle.requested_by || "",
      preparation_date: selectedVehicle.preparation_date || null,
      preparation_type_id: selectedVehicle.preparation_type_id || null,
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
        <div className="flex gap-2">
          {selectedVehicleIds.length > 0 && (
            <>
              <Button
                variant="outline"
                className="gap-2 shrink-0"
                onClick={() => setIsInvoiceOpen(true)}>
                <FileText className="h-4 w-4" />
                Facturar ({selectedVehicleIds.length})
              </Button>
              <Button
                variant="outline"
                className="gap-2 shrink-0"
                onClick={handleExportExcel}>
                <Download className="h-4 w-4" />
                Exportar ({selectedVehicleIds.length})
              </Button>
            </>
          )}
          <Button className="gap-2 shrink-0" onClick={handleAddClick}>
            <span>+</span> Añadir Moto
          </Button>
        </div>
      </div>

      {/* Filters */}
      <VehiclesTableFilters
        clients={clients}
        statuses={statuses}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Table */}
      <VehiclesTable
        onRowClick={handleRowClick}
        selectedIds={selectedVehicleIds}
        onSelectionChange={setSelectedVehicleIds}
        filters={filters}
      />

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
          onClose={() => setIsDrawerOpen(false)}
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

      {/* Invoice Generator */}
      <InvoiceGenerator
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        vehicles={selectedVehiclesForInvoice}
        clientName={invoiceClientName}
        pricingRates={pricingRates}
      />
    </div>
  );
}
