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

export default function StoragePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredVehicles = mockVehicles.filter((vehicle: Vehicle) => {
    const matchesSearch =
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        className="flex w-full items-center gap-2 bg-zinc-500 py-4 px-4 rounded-lg"
        style={{ justifyContent: "space-between" }}>
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: "#ef4444" }}>
            Almacenamiento de Vehículos
          </h1>
          <p className="text-white/80">
            Gestiona todos los vehículos en almacenamiento
          </p>
        </div>
        <Button className="gap-2 shrink-0">
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
                <SelectItem value="Zontes">Zontes</SelectItem>
                <SelectItem value="Shamax">Shamax</SelectItem>
                <SelectItem value="Ducati">Ducati</SelectItem>
                <SelectItem value="Carbo">Carbo</SelectItem>
                <SelectItem value="Quadis">Quadis</SelectItem>
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
    </div>
  );
}
