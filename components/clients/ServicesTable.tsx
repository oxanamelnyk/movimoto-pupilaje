"use client";

import { TariffService } from "@/app/dashboard/clients/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Plus } from "lucide-react";

interface ServicesTableProps {
  services: TariffService[];
  category: string;
  onAddService: (category: string) => void;
  onEditService: (service: TariffService) => void;
  onDeleteService: (serviceId: number) => void;
  isLoading?: boolean;
}

export function ServicesTable({
  services,
  category,
  onAddService,
  onEditService,
  onDeleteService,
  isLoading = false,
}: ServicesTableProps) {
  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  if (services.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">No services yet</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddService(category)}
          className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell className="text-right">
                {formatPrice(service.price)}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                  {service.type}
                </span>
              </TableCell>
              <TableCell>{service.unit}</TableCell>
              <TableCell>
                {service.discount ? `${service.discount}%` : "—"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isLoading}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditService(service)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteService(service.id)}
                      className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddService(category)}
        className="gap-2">
        <Plus className="h-4 w-4" />
        Add Service
      </Button>
    </div>
  );
}
