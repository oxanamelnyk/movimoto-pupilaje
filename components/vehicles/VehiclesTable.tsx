"use client";

import { useState, useMemo } from "react";
import { useVehicles } from "@/hooks/useClients";
import { VehicleFilters } from "@/components/vehicles/VehiclesTableFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { calculateDaysBetween } from "@/lib/date-utils";

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

interface VehiclesTableProps {
  onRowClick?: (vehicle: VehicleWithRelations) => void;
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  filters?: VehicleFilters;
}

export function VehiclesTable({
  onRowClick,
  selectedIds = [],
  onSelectionChange,
  filters,
}: VehiclesTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { data: vehicleData = { vehicles: [], total: 0 }, isLoading } =
    useVehicles(page, itemsPerPage);

  const vehicles = vehicleData.vehicles || [];
  const total = vehicleData.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  // Apply filters to vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle: VehicleWithRelations) => {
      if (!filters) return true;
      
      if (filters.clientId && vehicle.client_id !== filters.clientId) return false;
      if (filters.statusId && vehicle.status_id !== filters.statusId) return false;
      
      if (filters.entryDateFrom && vehicle.entry_date) {
        if (new Date(vehicle.entry_date) < new Date(filters.entryDateFrom)) return false;
      }
      if (filters.entryDateTo && vehicle.entry_date) {
        if (new Date(vehicle.entry_date) > new Date(filters.entryDateTo)) return false;
      }
      
      if (filters.exitDateFrom && vehicle.exit_date) {
        if (new Date(vehicle.exit_date) < new Date(filters.exitDateFrom)) return false;
      }
      if (filters.exitDateTo && vehicle.exit_date) {
        if (new Date(vehicle.exit_date) > new Date(filters.exitDateTo)) return false;
      }
      
      return true;
    });
  }, [vehicles, filters]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredVehicles.map((v: VehicleWithRelations) => v.id);
      onSelectionChange?.([...new Set([...selectedIds, ...allIds])]);
    } else {
      const pageIds = new Set(filteredVehicles.map((v: VehicleWithRelations) => v.id));
      onSelectionChange?.(
        selectedIds.filter((id) => !pageIds.has(id))
      );
    }
  };

  const handleSelectRow = (
    vehicleId: number,
    checked: boolean,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    let newIds: number[];
    if (checked) {
      newIds = [...selectedIds, vehicleId];
    } else {
      newIds = selectedIds.filter((id) => id !== vehicleId);
    }
    onSelectionChange?.(newIds);
  };

  const isAllSelected =
    filteredVehicles.length > 0 &&
    filteredVehicles.every((v: VehicleWithRelations) =>
      selectedIds.includes(v.id)
    );

  const getMonthName = (dateString?: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", { month: "long" }).format(date);
  };

  const getDaysBetween = (
    entryDate?: string | null,
    exitDate?: string | null,
  ) => {
    return calculateDaysBetween(entryDate, exitDate);
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" disabled checked={false} />
                </TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Mes Entrada</TableHead>
                <TableHead>Entrada</TableHead>
                <TableHead>Mes Sortida</TableHead>
                <TableHead>Sortida</TableHead>
                <TableHead>Días Total</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Bastidor/Matrícula</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Fecha Desencaje</TableHead>
                <TableHead>Tipo Desencaje</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Lugar de Entrega</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  {[...Array(14)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!filteredVehicles || filteredVehicles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-gray-500">
          No hay motos registradas. Añade la primera usando el botón de arriba.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12 font-semibold">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Mes Entrada</TableHead>
              <TableHead className="font-semibold">Entrada</TableHead>
              <TableHead className="font-semibold">Mes Sortida</TableHead>
              <TableHead className="font-semibold">Sortida</TableHead>
              <TableHead className="font-semibold">Días Total</TableHead>
              <TableHead className="font-semibold">Marca</TableHead>
              <TableHead className="font-semibold">
                Bastidor/Matrícula
              </TableHead>
              <TableHead className="font-semibold">Color</TableHead>
              <TableHead className="font-semibold">Fecha Desencaje</TableHead>
              <TableHead className="font-semibold">Tipo Desencaje</TableHead>
              <TableHead className="font-semibold">Ubicación</TableHead>
              <TableHead className="font-semibold">Lugar de Entrega</TableHead>
              <TableHead className="font-semibold">Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle: VehicleWithRelations, index: number) => {
              const isSelected = selectedIds.includes(vehicle.id);
              return (
                <TableRow
                  key={
                    vehicle?.id ? `vehicle-${vehicle.id}` : `vehicle-${index}`
                  }
                  className={`hover:bg-gray-50 cursor-pointer ${
                    isSelected ? "bg-blue-50" : ""
                  }`}
                  onClick={() => onRowClick?.(vehicle)}>
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    className="w-12">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleSelectRow(vehicle.id, e.target.checked, e as any)
                      }
                      className="cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.client_name || "-"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {vehicle?.status_name || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {getMonthName(vehicle?.entry_date)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.entry_date
                      ? formatDate(new Date(vehicle.entry_date))
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getMonthName(vehicle?.exit_date)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.exit_date
                      ? formatDate(new Date(vehicle.exit_date))
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {getDaysBetween(vehicle?.entry_date, vehicle?.exit_date)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.brand_name || "-"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {vehicle?.registration_identity || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.color_name || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.preparation_date
                      ? formatDate(new Date(vehicle.preparation_date))
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.preparation_type_name || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.location_name || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.delivery_place || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {vehicle?.notes || "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-t">
        <div className="text-sm text-gray-600">
          Mostrando{" "}
          <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> a{" "}
          <span className="font-medium">
            {Math.min(page * itemsPerPage, total)}
          </span>{" "}
          de <span className="font-medium">{total}</span> motos
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}>
            Anterior
          </Button>
          <div className="flex items-center gap-2 px-3">
            <span className="text-sm text-gray-600">
              Página <span className="font-medium">{page}</span> de{" "}
              <span className="font-medium">{totalPages || 1}</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
