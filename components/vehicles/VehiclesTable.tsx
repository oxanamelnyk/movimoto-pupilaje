"use client";

import { useVehicles } from "@/hooks/useClients";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

type VehicleWithRelations = {
  vehicles?: {
    id: number;
    client_id: number;
    brand_id: number;
    model_id: number;
    color_id?: number | null;
    status_id: number;
    vin?: string | null;
    plate_number?: string | null;
    notes?: string | null;
    created_at?: Date | string | null;
  };
  clients?: {
    id: number;
    name: string | null;
  } | null;
  brands?: {
    id: number;
    name: string;
  } | null;
  models?: {
    id: number;
    name: string;
  } | null;
  colors?: {
    id: number;
    name: string;
  } | null;
  vehicle_statuses?: {
    id: number;
    name: string;
  } | null;
};

export function VehiclesTable() {
  const { data: vehicles = [], isLoading } = useVehicles();

  if (isLoading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Fecha Entrada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Cliente</TableHead>
            <TableHead className="font-semibold">Marca</TableHead>
            <TableHead className="font-semibold">Modelo</TableHead>
            <TableHead className="font-semibold">Color</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">VIN</TableHead>
            <TableHead className="font-semibold">Placa</TableHead>
            <TableHead className="font-semibold">Fecha Entrada</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((record: VehicleWithRelations) => {
            const vehicle = record.vehicles;
            const client = record.clients;
            const brand = record.brands;
            const model = record.models;
            const color = record.colors;
            const status = record.vehicle_statuses;

            return (
              <TableRow key={vehicle?.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{client?.name || "-"}</TableCell>
                <TableCell>{brand?.name || "-"}</TableCell>
                <TableCell>{model?.name || "-"}</TableCell>
                <TableCell>{color?.name || "-"}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {status?.name || "-"}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">{vehicle?.vin || "-"}</TableCell>
                <TableCell className="font-mono text-xs">{vehicle?.plate_number || "-"}</TableCell>
                <TableCell>{vehicle?.created_at ? formatDate(new Date(vehicle.created_at)) : "-"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
