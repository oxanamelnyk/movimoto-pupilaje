"use client";

import { useState } from "react";
import { useVehicles } from "@/hooks/useClients";
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
}

export function VehiclesTable({ onRowClick }: VehiclesTableProps) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { data: vehicleData = { vehicles: [], total: 0 }, isLoading } =
    useVehicles(page, itemsPerPage);

  const vehicles = vehicleData.vehicles || [];
  const total = vehicleData.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

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
                  {[...Array(15)].map((_, j) => (
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

  if (!vehicles || vehicles.length === 0) {
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
            {vehicles.map((vehicle: VehicleWithRelations, index: number) => {
              return (
                <TableRow
                  key={
                    vehicle?.id ? `vehicle-${vehicle.id}` : `vehicle-${index}`
                  }
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onRowClick?.(vehicle)}>
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
