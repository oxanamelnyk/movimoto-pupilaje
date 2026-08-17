"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculateTariffMonthlyCost,
  calculateTariffPeriodCost,
  calculateTotal,
  type InvoiceLineItem,
  type TariffPricingService,
} from "@/lib/invoice-utils";

type BillingMode = "period" | "monthly";

type Vehicle = {
  id: number;
  client_id: number;
  client_name?: string | null;
  registration_identity?: string | null;
  entry_date?: string | null;
  exit_date?: string | null;
  brand_name?: string | null;
  model_name?: string | null;
};

type TariffPlan = {
  id: number;
  name: string;
  valid_from: string;
  valid_to: string | null;
  status: "Active" | "Archived";
};

type TariffService = TariffPricingService & {
  id: number;
  category: "Delivery" | "Storage";
};

type InvoiceRow = InvoiceLineItem & {
  vehicle: Vehicle;
  serviceName: string;
  key: string;
};

function NewInvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleIdsParam = searchParams.get("vehicleIds") || "";
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<TariffService[]>([]);
  const [tariffName, setTariffName] = useState<string | null>(null);
  const [billingMode, setBillingMode] = useState<BillingMode>("period");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [invoiceNumber] = useState(() => `FC${Date.now()}`);

  useEffect(() => {
    let cancelled = false;

    const loadInvoiceData = async () => {
      const vehicleIds = vehicleIdsParam
        .split(",")
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0);

      if (vehicleIds.length === 0) {
        setError("No hay motocicletas seleccionadas.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const vehicleResponses = await Promise.all(
          vehicleIds.map((id) => fetch(`/api/vehicles/${id}`)),
        );

        if (vehicleResponses.some((response) => !response.ok)) {
          throw new Error("No se pudieron cargar las motocicletas.");
        }

        const loadedVehicles: Vehicle[] = await Promise.all(
          vehicleResponses.map((response) => response.json()),
        );
        const clientIds = new Set(
          loadedVehicles.map((vehicle) => vehicle.client_id),
        );

        if (clientIds.size !== 1) {
          throw new Error(
            "Selecciona motocicletas de un solo cliente para facturar.",
          );
        }

        const clientId = loadedVehicles[0].client_id;
        const plansResponse = await fetch(
          `/api/tariff-plans?clientId=${clientId}`,
        );

        if (!plansResponse.ok) {
          throw new Error("No se pudieron cargar los planes tarifarios.");
        }

        const plans: TariffPlan[] = await plansResponse.json();
        const today = new Date().toISOString().split("T")[0];
        const activePlan = plans.find(
          (plan) =>
            plan.status === "Active" &&
            plan.valid_from.slice(0, 10) <= today &&
            (!plan.valid_to || plan.valid_to.slice(0, 10) >= today),
        );

        if (!activePlan) {
          throw new Error("El cliente no tiene un plan tarifario activo.");
        }

        const servicesResponse = await fetch(
          `/api/tariff-services?tariffId=${activePlan.id}`,
        );

        if (!servicesResponse.ok) {
          throw new Error("No se pudieron cargar los servicios del tarifario.");
        }

        const loadedServices: TariffService[] =
          await servicesResponse.json();
        const storageServices = loadedServices.filter(
          (service) => service.category === "Storage",
        );

        if (storageServices.length === 0) {
          throw new Error(
            "El tarifario activo no tiene servicios de Almacenamiento.",
          );
        }

        if (!cancelled) {
          setVehicles(loadedVehicles);
          setServices(storageServices);
          setTariffName(activePlan.name);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo preparar la factura.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadInvoiceData();

    return () => {
      cancelled = true;
    };
  }, [vehicleIdsParam]);

  const invoiceRows = useMemo<InvoiceRow[]>(() => {
    return vehicles.flatMap((vehicle) => {
      if (billingMode === "period") {
        const result = calculateTariffPeriodCost(
          vehicle.entry_date || "",
          vehicle.exit_date || null,
          services,
        );

        return result.items.map((item, index) => ({
          ...item,
          vehicle,
          serviceName: services[index]?.name || item.description,
          key: `${vehicle.id}-${index}`,
        }));
      }

      const result = calculateTariffMonthlyCost(
        vehicle.entry_date || "",
        vehicle.exit_date || null,
        services,
      );

      return result.items.flatMap((month, monthIndex) =>
        month.items.map((item, itemIndex) => ({
          ...item,
          description: `${month.month} — ${item.description}`,
          vehicle,
          serviceName:
            services.find((service) =>
              item.description.startsWith(service.name),
            )?.name || item.description,
          key: `${vehicle.id}-${monthIndex}-${itemIndex}`,
        })),
      );
    });
  }, [billingMode, services, vehicles]);

  const vehicleRows = useMemo(
    () =>
      vehicles.map((vehicle) => {
        const rows = invoiceRows.filter(
          (invoiceRow) => invoiceRow.vehicle.id === vehicle.id,
        );

        return {
          vehicle,
          services: services.map((service) => {
            const serviceRows = rows.filter(
              (row) => row.serviceName === service.name,
            );

            return {
              service,
              quantity: serviceRows.reduce(
                (sum, row) => sum + row.quantity,
                0,
              ),
              amount: serviceRows.reduce((sum, row) => sum + row.amount, 0),
            };
          }),
          subtotal: rows.reduce((sum, row) => sum + row.amount, 0),
        };
      }),
    [invoiceRows, services, vehicles],
  );

  const totals = useMemo(
    () =>
      calculateTotal(
        invoiceRows.reduce((sum, row) => sum + row.amount, 0),
        21,
      ),
    [invoiceRows],
  );

  const handleSave = async () => {
    if (vehicles.length === 0 || invoiceRows.length === 0) return;

    const pdfWindow = window.open("", "_blank");

    if (!pdfWindow) {
      setError(
        "El navegador bloqueó la nueva ventana. Permite las ventanas emergentes para abrir el PDF.",
      );
      return;
    }

    pdfWindow.document.title = "Generando factura...";
    pdfWindow.document.body.innerHTML =
      '<p style="font-family: sans-serif; padding: 24px">Generando factura...</p>';

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const today = new Date().toISOString().split("T")[0];
      const dates = vehicles.flatMap((vehicle) => [
        vehicle.entry_date || today,
        vehicle.exit_date || today,
      ]);
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: vehicles[0].client_id,
          invoice_number: invoiceNumber,
          invoice_date: today,
          period_type: billingMode,
          period_start: dates.sort()[0],
          period_end: dates.sort().at(-1),
          subtotal: totals.subtotal,
          tax_percentage: 21,
          tax_amount: totals.taxAmount,
          total: totals.total,
          items: invoiceRows.map((row) => ({
            vehicle_id: row.vehicle.id,
            registration_identity:
              row.vehicle.registration_identity || null,
            description: row.description,
            quantity: row.quantity,
            unit_price: row.unitPrice,
            amount: row.amount,
          })),
          notes: `Factura de almacenamiento para ${vehicles.length} vehículo(s)`,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo guardar la factura.");
      }

      const pdfResponse = await fetch(
        `/api/invoices/${encodeURIComponent(data.invoiceId)}/pdf`,
      );

      if (!pdfResponse.ok) {
        throw new Error("La factura se guardó, pero no se pudo generar el PDF.");
      }

      const pdfUrl = URL.createObjectURL(await pdfResponse.blob());
      pdfWindow.location.href = pdfUrl;
      window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 300_000);

      setSuccess(`Factura ${data.invoiceId} guardada correctamente.`);
    } catch (saveError) {
      pdfWindow.close();
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No se pudo guardar la factura.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Preparando factura...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <FileText data-icon="inline-start" />
            Generar Factura
          </h1>
          <p className="text-muted-foreground">
            Revisa el detalle de cada motocicleta antes de generar la factura.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft data-icon="inline-start" />
          Volver
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="text-destructive">{error}</CardContent>
        </Card>
      )}

      {!error && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
              <CardDescription>
                Cliente: {vehicles[0]?.client_name || "Cliente"} · Tarifario:{" "}
                {tariffName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <fieldset className="flex gap-6">
                <legend className="mb-2 text-sm font-medium">
                  Modo de facturación
                </legend>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={billingMode === "period"}
                    onChange={() => setBillingMode("period")}
                  />
                  Por período
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={billingMode === "monthly"}
                    onChange={() => setBillingMode("monthly")}
                  />
                  Por mes
                </label>
              </fieldset>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalle de la factura</CardTitle>
              <CardDescription>
                {vehicles.length} motocicleta
                {vehicles.length === 1 ? "" : "s"} seleccionada
                {vehicles.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Motocicleta</TableHead>
                      {services.map((service) => (
                        <TableHead
                          key={service.id}
                          className="max-w-64 whitespace-normal text-right"
                        >
                          {service.name}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicleRows.map((row) => (
                      <TableRow key={row.vehicle.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {row.vehicle.brand_name} {row.vehicle.model_name}
                          {row.vehicle.registration_identity
                            ? ` · ${row.vehicle.registration_identity}`
                            : ""}
                        </TableCell>
                        {row.services.map((serviceData) => (
                          <TableCell
                            key={serviceData.service.id}
                            className="text-right"
                          >
                            <div className="font-medium">
                              €{serviceData.amount.toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {serviceData.quantity}{" "}
                              {serviceData.service.unit === "dia"
                                ? "días"
                                : "unidad"}
                            </div>
                          </TableCell>
                        ))}
                        <TableCell className="text-right font-bold">
                          €{row.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-end gap-2 border-t">
              <div>Subtotal: €{totals.subtotal.toFixed(2)}</div>
              <div>IVA (21%): €{totals.taxAmount.toFixed(2)}</div>
              <div className="text-xl font-bold">
                Total: €{totals.total.toFixed(2)}
              </div>
            </CardFooter>
          </Card>

          {success && <p className="text-sm text-green-700">{success}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : "Generar Factura"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<p>Preparando factura...</p>}>
      <NewInvoiceContent />
    </Suspense>
  );
}
