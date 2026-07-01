"use client";

import React, { useState, useMemo, useRef } from "react";
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
import { FileText, Printer, Download, Check, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface InvoiceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Array<{
    id: number;
    client_id?: number;
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
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const invoiceData = useMemo(() => {
    const allItems: Array<{
      vehicle: (typeof vehicles)[0];
      items: unknown;
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

      const subtotal =
        billingMode === "monthly"
          ? (result as { totalSubtotal: number }).totalSubtotal
          : (result as { subtotal: number }).subtotal;

      allItems.push({
        vehicle,
        items: result.items,
        subtotal,
      });

      totalSubtotal += subtotal;
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

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      setSaveMessage(null);

      if (!previewRef.current) {
        throw new Error("Preview element not found");
      }

      // Capture the preview as canvas
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = 0;
      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        const pageHeight = 297; // A4 height in mm

        pdf.addImage(
          imgData,
          "PNG",
          0,
          yPosition > 0 ? 0 : -yPosition,
          imgWidth,
          imgHeight,
        );

        remainingHeight -= pageHeight;
        yPosition += pageHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }

      // Download PDF
      const fileName = `factura-${clientName.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      setSaveMessage({ type: "success", text: "PDF descargado correctamente" });
    } catch (error) {
      console.error("PDF export error:", error);
      setSaveMessage({
        type: "error",
        text: "Error al descargar el PDF",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveInvoice = async () => {
    try {
      setIsLoading(true);
      setSaveMessage(null);

      // Generate invoice number (YYYYMMDD-0001 format)
      const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
      const invoiceNumber = `INV-${today}-001`;

      // Build items array
      interface InvoiceItem {
        vehicle: { id: number; registration_identity?: string | null };
        items: unknown;
      }
      const itemsData: Array<Record<string, unknown>> = [];
      (invoiceData.items as InvoiceItem[]).forEach((vehicleItem) => {
        if (billingMode === "period") {
          (
            vehicleItem.items as Array<{
              description: string;
              quantity: number;
              unitPrice: number;
              amount: number;
            }>
          ).forEach((item) => {
            itemsData.push({
              vehicle_id: vehicleItem.vehicle.id,
              registration_identity:
                vehicleItem.vehicle.registration_identity || null,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              amount: item.amount,
            });
          });
        } else {
          // Monthly mode
          (
            vehicleItem.items as Array<{
              month: string;
              items: Array<{
                description: string;
                quantity: number;
                unitPrice: number;
                amount: number;
              }>;
            }>
          ).forEach((monthData) => {
            monthData.items.forEach((item) => {
              itemsData.push({
                vehicle_id: vehicleItem.vehicle.id,
                registration_identity:
                  vehicleItem.vehicle.registration_identity || null,
                description: `${monthData.month} - ${item.description}`,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                amount: item.amount,
              });
            });
          });
        }
      });

      // Call API to save invoice
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: vehicles[0]?.client_id || 1,
          invoice_number: invoiceNumber,
          invoice_date: new Date().toISOString().split("T")[0],
          period_type: billingMode,
          period_start:
            vehicles[0]?.entry_date || new Date().toISOString().split("T")[0],
          period_end:
            vehicles[vehicles.length - 1]?.exit_date ||
            new Date().toISOString().split("T")[0],
          subtotal: invoiceData.subtotal,
          tax_percentage: 21,
          tax_amount: invoiceData.taxAmount,
          total: invoiceData.total,
          items: itemsData,
          notes: `Factura de almacenamiento para ${vehicles.length} vehículo(s)`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to save invoice");
      }

      const result = await response.json();
      setSaveMessage({
        type: "success",
        text: `Factura ${result.invoiceId} guardada correctamente`,
      });

      // Close drawer after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Invoice save error:", error);
      setSaveMessage({
        type: "error",
        text: "Error al guardar la factura",
      });
    } finally {
      setIsLoading(false);
    }
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
            <CardContent className="space-y-4" ref={previewRef}>
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
                        {(
                          vehicleItem.items as Array<{
                            description: string;
                            amount: number;
                          }>
                        ).map((item, itemIdx: number) => (
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
                        {(
                          vehicleItem.items as Array<{
                            month: string;
                            items: Array<{
                              description: string;
                              amount: number;
                            }>;
                            subtotal: number;
                          }>
                        ).map((monthData, monthIdx: number) => (
                          <div key={monthIdx} className="bg-white p-2 rounded">
                            <h5 className="font-medium text-gray-700 mb-1">
                              {monthData.month}
                            </h5>
                            <div className="space-y-0.5 text-gray-600">
                              {monthData.items.map((item, itemIdx: number) => (
                                <div
                                  key={itemIdx}
                                  className="flex justify-between">
                                  <span>{item.description}</span>
                                  <span>€{item.amount.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="border-t mt-1 pt-1 font-medium flex justify-between">
                              <span>Subtotal mes:</span>
                              <span>€{monthData.subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
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

          {/* Messages */}
          {saveMessage && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                saveMessage.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
              {saveMessage.type === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {saveMessage.text}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={isLoading}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button onClick={handleSaveInvoice} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Generar Factura"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
