"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vehicle } from "../data/mock-vehicles";
import { ChevronLeft, ChevronRight } from "lucide-react";

const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "status",
    header: "ESTADO",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "Ingresado" ? "default" : "destructive"}
          className={
            status === "Ingresado" ? "bg-green-600" : "bg-red-600 text-white"
          }>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "mesEntrada",
    header: "MES ENTRADA",
    cell: ({ row }) => {
      const date = row.original.entryDate as string;
      return date.split("/")[1]; // Extract month
    },
  },
  {
    id: "diaEntrada",
    header: "DIA ENTRADA",
    cell: ({ row }) => {
      const date = row.original.entryDate as string;
      return date.split("/")[0]; // Extract day
    },
  },
  {
    id: "mesSortida",
    header: "MES SORTIDA",
    cell: ({ row }) => {
      const date = row.original.exitDate as string | undefined;
      return date ? date.split("/")[1] : "—";
    },
  },
  {
    id: "diaSortida",
    header: "DIA SORTIDA",
    cell: ({ row }) => {
      const date = row.original.exitDate as string | undefined;
      return date ? date.split("/")[0] : "—";
    },
  },
  {
    id: "totalDays",
    header: "DIAS TOTAL",
    cell: ({ row }) => {
      const entryDate = row.original.entryDate;
      const exitDate = row.original.exitDate;
      if (!entryDate || !exitDate) return "—";

      const [entryDay, entryMonth, entryYear] = entryDate
        .split("/")
        .map(Number);
      const [exitDay, exitMonth, exitYear] = exitDate.split("/").map(Number);

      const start = new Date(entryYear, entryMonth - 1, entryDay);
      const end = new Date(exitYear, exitMonth - 1, exitDay);
      const days = Math.floor(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );

      return days;
    },
  },
  {
    accessorKey: "requestDate",
    header: "FECHA PETICION",
    cell: ({ row }) => row.getValue("requestDate") || "—",
  },
  {
    accessorKey: "requestedBy",
    header: "QUIEN PIDE",
    cell: ({ row }) => row.getValue("requestedBy") || "—",
  },
  {
    accessorKey: "model",
    header: "MODEL",
  },
  {
    accessorKey: "vin_or_plate",
    header: "BASTIDOR/MATRICULA",
  },
  {
    accessorKey: "destination",
    header: "DESTINO",
    cell: ({ row }) => row.getValue("destination") || "—",
  },
  {
    accessorKey: "notes",
    header: "ANOTACIONES",
    cell: ({ row }) => row.getValue("notes") || "—",
  },
  {
    accessorKey: "unpackingDate",
    header: "UBICACION FECHA DESENAJE",
    cell: ({ row }) => row.getValue("unpackingDate") || "—",
  },
  {
    accessorKey: "unpackingType",
    header: "TIPO DESENCAJE",
    cell: ({ row }) => row.getValue("unpackingType") || "—",
  },
];

interface VehiclesTableProps {
  data: Vehicle[];
}

export function VehiclesTable({ data }: VehiclesTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalRows = data.length;

  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground">
                    No hay vehículos que mostrar
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando 1 a {table.getRowModel().rows.length} de {totalRows}{" "}
          registros
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(
              (pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  className="min-w-10">
                  {pageNumber}
                </Button>
              ),
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="gap-1">
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
