"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { VehiclesTable } from "./components/vehicles-table";
import { mockVehicles, type Vehicle } from "./data/mock-vehicles";
import { AddVehicleDrawer } from "@/components/vehicles/AddVehicleDrawer";
import {
  AddVehicleForm,
  type VehicleStorageFormData,
} from "@/components/vehicles/AddVehicleForm";
import {
  useClients,
  useLocations,
  useCreateVehicleStorageRecord,
} from "@/hooks/useClients";

export default function StoragePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
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

  const filteredVehicles = mockVehicles.filter((vehicle: Vehicle) => {
    const matchesSearch =
      vehicle.vin_or_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClient =
      selectedClient === "all" || vehicle.client === selectedClient;
    const matchesStatus =
      selectedStatus === "all" || vehicle.status === selectedStatus;

    return matchesSearch && matchesClient && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div
        className="flex w-full items-center gap-2 "
        style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Almacenamiento de Vehículos
          </h1>
          <p>Gestiona todos los vehículos en almacenamiento</p>
        </div>
        <Button
          className="gap-2 shrink-0"
          onClick={() => setIsDrawerOpen(true)}>
          <span>+</span> Añadir Vehículo
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Client Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Cliente</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los clientes</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.name}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Estado</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="IN">Ingresado</SelectItem>
                <SelectItem value="OUT">Retirado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-2">
            <label className="text-sm font-medium">
              Buscar por placa, modelo
            </label>
            <Input
              placeholder="Buscar por placa, VIN, modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedClient("all");
              setSelectedStatus("all");
            }}>
            Limpiar Filtros
          </Button>
        </div>
      </Card>

      {/* Table */}
      <VehiclesTable data={filteredVehicles} />

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
