"use client";

import { ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer";

interface AddVehicleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function AddVehicleDrawer({
  open,
  onOpenChange,
  children,
}: AddVehicleDrawerProps) {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="overflow-y-auto overflow-x-hidden">
        <DrawerHeader>
          <DrawerTitle>Agregar Nuevo Vehículo</DrawerTitle>
          <DrawerDescription>
            Agregar información del vehículo y almacenamiento
          </DrawerDescription>
        </DrawerHeader>

        {children}
      </DrawerContent>
    </Drawer>
  );
}
