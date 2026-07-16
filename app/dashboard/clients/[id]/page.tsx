"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { FormSection } from "@/components/add-vehicle-form/FormSection";
import {
  Pencil,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface Client {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface TariffPlan {
  id: number;
  client_id: number;
  name: string;
  valid_from: string;
  valid_to: string | null;
  status: "Active" | "Archived";
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface TariffService {
  id: number;
  tariff_id: number;
  name: string;
  price: string;
  unit: string;
  type: "Fixed" | "Variable";
  discount: string | null;
  category: "Delivery" | "Storage";
  created_at: string | null;
  updated_at: string | null;
}

export default function ClientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [tariffPlans, setTariffPlans] = useState<TariffPlan[]>([]);
  const [selectedTariff, setSelectedTariff] = useState<TariffPlan | null>(null);
  const [tariffServices, setTariffServices] = useState<TariffService[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Delivery", "Storage"]),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [serviceDrawerOpen, setServiceDrawerOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    status: "Active" | "Archived";
  }>({
    name: "",
    description: "",
    status: "Active",
  });
  const [serviceFormData, setServiceFormData] = useState<{
    name: string;
    price: string;
    unit: string;
    type: "Fixed" | "Variable";
    category: "Delivery" | "Storage";
    discount: string;
  }>({
    name: "",
    price: "",
    unit: "",
    type: "Fixed",
    category: "Delivery",
    discount: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientResponse = await fetch(`/api/clients/${clientId}`);
        if (!clientResponse.ok) throw new Error("Failed to fetch client");
        const clientData = await clientResponse.json();
        setClient(clientData);

        // Fetch tariff plans for this client
        const tariffResponse = await fetch(
          `/api/tariff-plans?clientId=${clientId}`,
        );
        if (tariffResponse.ok) {
          const tariffs = await tariffResponse.json();
          setTariffPlans(tariffs);
          if (tariffs.length > 0) {
            setSelectedTariff(tariffs[0]);
            // Fetch services for the first tariff
            const servicesResponse = await fetch(
              `/api/tariff-services?tariffId=${tariffs[0].id}`,
            );
            if (servicesResponse.ok) {
              const services = await servicesResponse.json();
              setTariffServices(services);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const handleTariffSelect = async (tariff: TariffPlan) => {
    setSelectedTariff(tariff);
    try {
      const response = await fetch(
        `/api/tariff-services?tariffId=${tariff.id}`,
      );
      if (response.ok) {
        const services = await response.json();
        setTariffServices(services);
      }
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const toggleCategory = (category: string) => {
    const newCategories = new Set(expandedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setExpandedCategories(newCategories);
  };

  const handleCreateTariff = async () => {
    if (!formData.name) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/tariff-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: Number(clientId),
          name: formData.name,
          description: formData.description || null,
          valid_from: new Date().toISOString().split("T")[0],
          valid_to: null,
          status: formData.status,
        }),
      });

      if (!response.ok) throw new Error("Failed to create tariff plan");

      const newTariff = await response.json();
      setTariffPlans([...tariffPlans, newTariff]);
      setDrawerOpen(false);
      setFormData({
        name: "",
        description: "",
        status: "Active",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear el plan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateService = async () => {
    if (
      !serviceFormData.name ||
      !serviceFormData.price ||
      !serviceFormData.unit
    ) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    if (!selectedTariff) {
      alert("Por favor selecciona un plan tarifario");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/tariff-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tariff_id: selectedTariff.id,
          name: serviceFormData.name,
          price: serviceFormData.price,
          unit: serviceFormData.unit,
          type: serviceFormData.type,
          category: serviceFormData.category,
          discount: serviceFormData.discount || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create service");

      const newService = await response.json();
      setTariffServices([...tariffServices, newService]);
      setServiceDrawerOpen(false);
      setServiceFormData({
        name: "",
        price: "",
        unit: "",
        type: "Fixed",
        category: "Delivery",
        discount: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear el servicio");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditService = (service: TariffService) => {
    setEditingServiceId(service.id);
    setServiceFormData({
      name: service.name,
      price: service.price,
      unit: service.unit,
      type: service.type as "Fixed" | "Variable",
      category: service.category as "Delivery" | "Storage",
      discount: service.discount || "",
    });
    setServiceDrawerOpen(true);
  };

  const handleUpdateService = async () => {
    if (
      !serviceFormData.name ||
      !serviceFormData.price ||
      !serviceFormData.unit
    ) {
      alert("Por favor completa los campos requeridos");
      return;
    }

    if (!editingServiceId) {
      alert("Error: servicio no encontrado");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/tariff-services/${editingServiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: serviceFormData.name,
          price: serviceFormData.price,
          unit: serviceFormData.unit,
          type: serviceFormData.type,
          category: serviceFormData.category,
          discount: serviceFormData.discount || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update service");

      const updatedService = await response.json();
      setTariffServices(
        tariffServices.map((s) =>
          s.id === editingServiceId ? updatedService : s,
        ),
      );
      setServiceDrawerOpen(false);
      setEditingServiceId(null);
      setServiceFormData({
        name: "",
        price: "",
        unit: "",
        type: "Fixed",
        category: "Delivery",
        discount: "",
      });
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Error al actualizar el servicio",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm("¿Está seguro de que desea eliminar este servicio?")) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/tariff-services/${serviceId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to delete service");

      setTariffServices(tariffServices.filter((s) => s.id !== serviceId));
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Error al eliminar el servicio",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  const servicesByCategory = (category: "Delivery" | "Storage") => {
    return tariffServices.filter((service) => service.category === category);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando cliente...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error || "Cliente no encontrado"}
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => router.push("/dashboard/clients")}>
              Clientes
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Client Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{client.name}</h1>
                  <Badge className={getStatusBadgeColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
                {client.description && (
                  <p className="text-gray-600 mb-3">{client.description}</p>
                )}
                <div className="space-y-1 text-sm text-gray-500">
                  {client.email && <p>Email: {client.email}</p>}
                  {client.phone && <p>Teléfono: {client.phone}</p>}
                </div>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(`/dashboard/clients/${client.id}/edit`)
              }
              variant="outline"
              size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Editar cliente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="invoices" className="w-full">
            <TabsList>
              <TabsTrigger value="invoices">Facturas</TabsTrigger>
              <TabsTrigger value="tariffs">Tarifas</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="mt-4">
              <div className="py-8 text-center text-gray-500">
                <p>El contenido de facturas se agregará aquí</p>
              </div>
            </TabsContent>

            <TabsContent value="tariffs" className="mt-4">
              {/* Tariffs Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Planes Tarifarios</h2>
                    <p className="text-sm text-gray-500">
                      Crear y gestionar planes tarifarios para este cliente.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setDrawerOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Plan Tarifario
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {/* Tariff Plans List */}
                  <div className="space-y-2">
                    {tariffPlans.length > 0 ? (
                      tariffPlans.map((tariff) => (
                        <Card
                          key={tariff.id}
                          className={`cursor-pointer transition-all ${
                            selectedTariff?.id === tariff.id
                              ? "border-yellow-400 border-2 bg-yellow-50"
                              : "hover:border-gray-400"
                          }`}
                          onClick={() => handleTariffSelect(tariff)}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-sm">
                                  {tariff.name}
                                </h3>
                                {tariff.description && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {tariff.description}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                  Actualizado{" "}
                                  {formatDate(
                                    tariff.updated_at ||
                                      tariff.created_at ||
                                      "",
                                  )}
                                </p>
                              </div>
                              <Badge
                                className={`text-xs ${getStatusBadgeColor(tariff.status)}`}>
                                {tariff.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No hay planes tarifarios</p>
                      </div>
                    )}
                  </div>

                  {/* Selected Tariff Details */}
                  {selectedTariff ? (
                    <div className="lg:col-span-2 space-y-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold">
                                {selectedTariff.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Válido desde{" "}
                                {formatDate(selectedTariff.valid_from)}
                                {selectedTariff.valid_to &&
                                  ` hasta ${formatDate(selectedTariff.valid_to)}`}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Services by Category */}
                      {["Delivery", "Storage"].map((category) => {
                        const services = servicesByCategory(
                          category as "Delivery" | "Storage",
                        );
                        const isExpanded = expandedCategories.has(category);

                        return (
                          <Card key={category}>
                            <CardContent className="pt-0">
                              <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between py-4 border-b hover:bg-gray-50">
                                <div className="flex items-center gap-2">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  <h4 className="font-semibold">
                                    {category === "Delivery"
                                      ? "Entrega"
                                      : "Almacenamiento"}
                                  </h4>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {services.length} servicios
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="py-4 space-y-4">
                                  {services.length > 0 ? (
                                    <div className="overflow-x-auto">
                                      <Table className="text-sm">
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Servicio</TableHead>
                                            <TableHead>Precio</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Unidad</TableHead>
                                            <TableHead>Descuento</TableHead>
                                            <TableHead className="text-right">
                                              Acciones
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {services.map((service) => (
                                            <TableRow key={service.id}>
                                              <TableCell className="font-medium">
                                                {service.name}
                                              </TableCell>
                                              <TableCell>
                                                {parseFloat(
                                                  service.price,
                                                ).toFixed(2)}{" "}
                                                €
                                              </TableCell>
                                              <TableCell>
                                                {service.type}
                                              </TableCell>
                                              <TableCell>
                                                {service.unit}
                                              </TableCell>
                                              <TableCell>
                                                {service.discount
                                                  ? `${service.discount}%`
                                                  : "−"}
                                              </TableCell>
                                              <TableCell className="text-right space-x-2">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                    handleOpenEditService(
                                                      service,
                                                    )
                                                  }>
                                                  <Pencil className="h-4 w-4 text-blue-600" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                    handleDeleteService(
                                                      service.id,
                                                    )
                                                  }>
                                                  <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                      Sin servicios
                                    </p>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-yellow-600"
                                    onClick={() => setServiceDrawerOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Añadir Servicio
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="lg:col-span-2 flex items-center justify-center py-12 text-gray-500">
                      <p>Selecciona un plan tarifario para ver los detalles</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Tariff Plan Drawer */}
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle>Nuevo Plan Tarifario</DrawerTitle>
            <DrawerDescription>
              Crear un nuevo plan tarifario para este cliente
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Plan Info Section */}
            <FormSection icon="" title="Información del Plan">
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="plan-name">Nombre del Plan *</Label>
                  <Input
                    id="plan-name"
                    placeholder="p.ej. Tarifa 2024"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="plan-description">Descripción</Label>
                  <Input
                    id="plan-description"
                    placeholder="p.ej. Plan principal para 2024"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="plan-status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as "Active" | "Archived",
                      })
                    }>
                    <SelectTrigger id="plan-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Activo</SelectItem>
                      <SelectItem value="Archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </FormSection>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 flex gap-3 p-6 bg-white border-t border-gray-200">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setFormData({ name: "", description: "", status: "Active" })
                }>
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              onClick={handleCreateTariff}
              disabled={submitting || !formData.name}
              className="flex-1">
              {submitting ? "Guardando..." : "Crear Plan"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Create/Edit Service Drawer */}
      <Drawer
        direction="right"
        open={serviceDrawerOpen}
        onOpenChange={setServiceDrawerOpen}>
        <DrawerContent className="flex flex-col h-full">
          <DrawerHeader>
            <DrawerTitle>
              {editingServiceId ? "Editar Servicio" : "Nuevo Servicio"}
            </DrawerTitle>
            <DrawerDescription>
              {editingServiceId
                ? "Actualizar datos del servicio"
                : "Añadir un nuevo servicio a este plan tarifario"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Service Info Section */}
            <FormSection icon="" title="Información del Servicio">
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="service-name">Nombre del Servicio *</Label>
                  <Input
                    id="service-name"
                    placeholder="p.ej. Almacenamiento diario"
                    value={serviceFormData.name}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="service-price">Precio *</Label>
                  <Input
                    id="service-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={serviceFormData.price}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        price: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Unit */}
                <div className="space-y-2">
                  <Label htmlFor="service-unit">Unidad *</Label>
                  <Input
                    id="service-unit"
                    placeholder="p.ej. día, unidad, moto"
                    value={serviceFormData.unit}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        unit: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label htmlFor="service-type">Tipo</Label>
                  <Select
                    value={serviceFormData.type}
                    onValueChange={(value) =>
                      setServiceFormData({
                        ...serviceFormData,
                        type: value as "Fixed" | "Variable",
                      })
                    }>
                    <SelectTrigger id="service-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fixed">Fijo</SelectItem>
                      <SelectItem value="Variable">Variable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="service-category">Categoría</Label>
                  <Select
                    value={serviceFormData.category}
                    onValueChange={(value) =>
                      setServiceFormData({
                        ...serviceFormData,
                        category: value as "Delivery" | "Storage",
                      })
                    }>
                    <SelectTrigger id="service-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Delivery">Entrega</SelectItem>
                      <SelectItem value="Storage">Almacenamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Discount */}
                <div className="space-y-2">
                  <Label htmlFor="service-discount">Descuento (%)</Label>
                  <Input
                    id="service-discount"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0"
                    value={serviceFormData.discount}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        discount: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </FormSection>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 flex gap-3 p-6 bg-white border-t border-gray-200">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setEditingServiceId(null);
                  setServiceFormData({
                    name: "",
                    price: "",
                    unit: "",
                    type: "Fixed",
                    category: "Delivery",
                    discount: "",
                  });
                }}>
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              onClick={() =>
                editingServiceId
                  ? handleUpdateService()
                  : handleCreateService()
              }
              disabled={
                submitting ||
                !serviceFormData.name ||
                !serviceFormData.price ||
                !serviceFormData.unit
              }
              className="flex-1">
              {submitting
                ? "Guardando..."
                : editingServiceId
                  ? "Actualizar Servicio"
                  : "Crear Servicio"}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
