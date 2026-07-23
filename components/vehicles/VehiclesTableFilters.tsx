"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export interface VehicleFilters {
  clientId?: number | null;
  statusId?: number | null;
  entryDateFrom?: string | null;
  entryDateTo?: string | null;
  exitDateFrom?: string | null;
  exitDateTo?: string | null;
}

interface VehiclesTableFiltersProps {
  clients: Array<{ id: number; name: string | null }>;
  statuses: Array<{ id: number; name: string }>;
  filters: VehicleFilters;
  onFiltersChange: (filters: VehicleFilters) => void;
}

export function VehiclesTableFilters({
  clients,
  statuses,
  filters,
  onFiltersChange,
}: VehiclesTableFiltersProps) {
  const handleClientChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        clientId: value ? parseInt(value, 10) : null,
      });
    },
    [filters, onFiltersChange],
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        statusId: value ? parseInt(value, 10) : null,
      });
    },
    [filters, onFiltersChange],
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({
      clientId: null,
      statusId: null,
      entryDateFrom: null,
      entryDateTo: null,
      exitDateFrom: null,
      exitDateTo: null,
    });
  }, [onFiltersChange]);

  const hasActiveFilters =
    filters.clientId ||
    filters.statusId ||
    filters.entryDateFrom ||
    filters.entryDateTo ||
    filters.exitDateFrom ||
    filters.exitDateTo;

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="gap-2">
            <X className="w-4 h-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Client Filter */}
        <div className="space-y-1">
          <Label htmlFor="filter-client" className="text-xs">
            Cliente
          </Label>
          <Select
            value={filters.clientId ? String(filters.clientId) : ""}
            onValueChange={handleClientChange}>
            <SelectTrigger id="filter-client" className="text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={String(client.id)}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <Label htmlFor="filter-status" className="text-xs">
            Estado
          </Label>
          <Select
            value={filters.statusId ? String(filters.statusId) : ""}
            onValueChange={handleStatusChange}>
            <SelectTrigger id="filter-status" className="text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.id} value={String(status.id)}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entry Date From */}
        <div className="space-y-1">
          <Label htmlFor="filter-entry-from" className="text-xs">
            Entrada Desde
          </Label>
          <Input
            id="filter-entry-from"
            type="date"
            value={filters.entryDateFrom || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                entryDateFrom: e.target.value || null,
              })
            }
            className="text-sm"
          />
        </div>

        {/* Entry Date To */}
        <div className="space-y-1">
          <Label htmlFor="filter-entry-to" className="text-xs">
            Entrada Hasta
          </Label>
          <Input
            id="filter-entry-to"
            type="date"
            value={filters.entryDateTo || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                entryDateTo: e.target.value || null,
              })
            }
            className="text-sm"
          />
        </div>

        {/* Exit Date From */}
        <div className="space-y-1">
          <Label htmlFor="filter-exit-from" className="text-xs">
            Salida Desde
          </Label>
          <Input
            id="filter-exit-from"
            type="date"
            value={filters.exitDateFrom || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                exitDateFrom: e.target.value || null,
              })
            }
            className="text-sm"
          />
        </div>

        {/* Exit Date To */}
        <div className="space-y-1">
          <Label htmlFor="filter-exit-to" className="text-xs">
            Salida Hasta
          </Label>
          <Input
            id="filter-exit-to"
            type="date"
            value={filters.exitDateTo || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                exitDateTo: e.target.value || null,
              })
            }
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
