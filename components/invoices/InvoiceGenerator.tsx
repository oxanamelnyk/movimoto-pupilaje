"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import {
  calculatePeriodCost,
  calculateMonthlyCost,
  calculateTotal,
  type PricingRates,
} from "@/lib/invoice-utils";
import { FileText, Printer, Download } from "lucide-react";

interface InvoiceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Array<{
    id: number;
    registration_identity?: string | null;
    client_name?: string | null;
    entry_date?: string | null;
    exit_date?: string | null;
    brand_name?: string | null;
    model_name?: string | null;
  }>;
  clientName: string;
  pricingRates: PricingRates;
}

type BillingMode = "period" | "monthly";

export function InvoiceGenerator({
  isOpen,
  onClose,
  vehicles,
  clientName,
  pricingRates,
}: InvoiceGeneratorProps) {
  const [billingMode, setBillingMode] = useState<BillingMode>("period");
  const [includeDisassembly, setIncludeDisassembly] = useState(false);
  const [disassemblyWithWheels, setDisassemblyWithWheels] = useState(false);
  const [includeWaste, setIncludeWaste] = useState(false);

  const invoiceData = useMemo(() => {
    const allItems: Array<{
      vehicle: (typeof vehicles)[0];
      items: any;
      subtotal: number;
    }> = [];
    let totalSubtotal = 0;

    vehicles.forEach((vehicle) => {
      const result =
        billingMode === "period"
          ? calculatePeriodCost(
              vehicle.entry_date || "",
              vehicle.exit_date || null,
              pricingRates,
              includeDisassembly,
              disassemblyWithWheels,
              includeWaste,
            )
          : calculateMonthlyCost(
              vehicle.entry_date || "",
              vehicle.exit_date || null,
              pricingRates,
              includeDisassembly,
              disassemblyWithWheels,
              includeWaste,
            );

      allItems.push({
        vehicle,
        items: result.items,
        subtotal:
          billingMode === "monthly" ? result.totalSubtotal : result.subtotal,
      });

      totalSubtotal +=
        billingMode === "monthly" ? result.totalSubtotal : result.subtotal;
    });

    const taxData = calculateTotal(totalSubtotal, 21);

    return {
      items: allItems,
      ...taxData,
    };
  }, [
    vehicles,
    billingMode,
    pricingRates,
    includeDisassembly,
    disassemblyWithWheels,
    includeWaste,
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF export
    console.log("Download PDF");
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose} direction="right">
      <DrawerContent className="max-h-screen max-w-4xl">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generar Factura
          </DrawerTitle>
          <DrawerDescription>
            Configura los parámetros de facturación y vista previa
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 px-6 pb-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Billing Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Modo de Facturación
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={billingMode === "period"}
                      onChange={() => setBillingMode("period")}
                    />
                    <span>Por Período</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={billingMode === "monthly"}
                      onChange={() => setBillingMode("monthly")}
                    />
                    <span>Por Mes</span>
                  </label>
                </div>
              </div>

              <Separator />

              {/* Add-ons */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Servicios Adicionales
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDisassembly}
                      onChange={(e) => setIncludeDisassembly(e.target.checked)}
                    />
                    <span className="text-sm">Incluir Desembalaje</span>
                  </label>
                  {includeDisassembly && (
                    <label className="flex items-center gap-4 cursor-pointer pl-6">
                      <input
                        type="checkbox"
                        checked={disassemblyWithWheels}
                        onChange={(e) =>
                          setDisassemblyWithWheels(e.target.checked)
                        }
                      />
                      <span className="text-sm">
                        Con Montaje de Rueda (+€
                        {(
                          pricingRates.disassemblyWithWheels -
                          pricingRates.disassemblyWithoutWheels
                        ).toFixed(2)}
                        )
                      </span>
                    </label>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeWaste}
                      onChange={(e) => setIncludeWaste(e.target.checked)}
                    />
                    <span className="text-sm">Incluir Gestión de Residuos</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Header */}
              <div className="border-b pb-4">
                <h3 className="font-semibold">Factura a: {clientName}</h3>
                <p className="text-sm text-gray-600">
                  {vehicles.length} vehículo{vehicles.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Items by vehicle */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {invoiceData.items.map((vehicleItem, idx) => (
                  <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                    <h4 className="font-medium text-sm mb-2">
                      {vehicleItem.vehicle.brand_name}{" "}
                      {vehicleItem.vehicle.model_name}
                      {vehicleItem.vehicle.registration_identity &&
                        ` • ${vehicleItem.vehicle.registration_identity}`}
                    </h4>

                    {/* Period mode: flat list */}
                    {billingMode === "period" && (
                      <div className="space-y-1 text-sm">
                        {vehicleItem.items.map((item: any, itemIdx: number) => (
                          <div
                            key={itemIdx}
                            className="flex justify-between text-xs">
                            <span>{item.description}</span>
                            <span>€{item.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Monthly mode: grouped by month */}
                    {billingMode === "monthly" && (
                      <div className="space-y-2 text-xs">
                        {vehicleItem.items.map(
                          (monthData: any, monthIdx: number) => (
                            <div
                              key={monthIdx}
                              className="bg-white p-2 rounded">
                              <h5 className="font-medium text-gray-700 mb-1">
                                {monthData.month}
                              </h5>
                              <div className="space-y-0.5 text-gray-600">
                                {monthData.items.map(
                                  (item: any, itemIdx: number) => (
                                    <div
                                      key={itemIdx}
                                      className="flex justify-between">
                                      <span>{item.description}</span>
                                      <span>€{item.amount.toFixed(2)}</span>
                                    </div>
                                  ),
                                )}
                              </div>
                              <div className="border-t mt-1 pt-1 font-medium flex justify-between">
                                <span>Subtotal mes:</span>
                                <span>€{monthData.subtotal.toFixed(2)}</span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    <div className="border-t pt-2 mt-2 flex justify-between font-medium text-sm">
                      <span>Subtotal:</span>
                      <span>€{vehicleItem.subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    €{invoiceData.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA (21%):</span>
                  <span className="font-medium">
                    €{invoiceData.taxAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>€{invoiceData.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button onClick={() => console.log("Save invoice")}>
              Generar Factura
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
