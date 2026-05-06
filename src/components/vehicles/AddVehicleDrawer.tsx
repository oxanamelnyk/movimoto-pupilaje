"use client";

import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-800 max-w-4xl overflow-y-auto py-6 ">
        <SheetHeader className="mb-6">
          <SheetTitle>Add New Vehicle</SheetTitle>
          <SheetDescription>
            Add vehicle and storage information
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
