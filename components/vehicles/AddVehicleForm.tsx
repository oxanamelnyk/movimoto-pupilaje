"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

// Combine schemas for the full form
const vehicleStorageFormSchema = z.object({
  client_id: z.string().min(1, "Se requiere cliente"),
  brand: z.string().min(1, "Se requiere marca"),
  model: z.string().min(1, "Se requiere modelo"),
  vin_or_plate: z.string().min(1, "Se requiere VIN o placa"),
  color: z.string().optional(),
  status: z.enum(["IN", "OUT"]),
  entry_date: z.string().min(1, "Se requiere fecha de entrada"),
  exit_date: z.string().optional(),
  location_id: z.string().min(1, "Se requiere ubicación"),
  destination: z.string().optional(),
  request_date: z.string().optional(),
  requested_by: z.string().optional(),
  unpacking_date: z.string().optional(),
  unpacking_type: z.string().optional(),
  notes: z.string().optional(),
});

export type VehicleStorageFormData = z.infer<typeof vehicleStorageFormSchema>;

interface AddVehicleFormProps {
  onSubmit: (data: VehicleStorageFormData) => Promise<void>;
  isLoading?: boolean;
  clients?: Array<{ id: string; name: string }>;
  locations?: Array<{ id: string; name: string }>;
}

export function AddVehicleForm({
  onSubmit,
  isLoading = false,
  clients = [],
  locations = [],
}: AddVehicleFormProps) {
  const form = useForm<VehicleStorageFormData>({
    resolver: zodResolver(vehicleStorageFormSchema),
    defaultValues: {
      client_id: "",
      brand: "",
      model: "",
      vin_or_plate: "",
      color: "",
      status: "IN",
      entry_date: new Date().toISOString().split("T")[0],
      exit_date: "",
      location_id: "",
      destination: "",
      request_date: "",
      requested_by: "",
      unpacking_date: "",
      unpacking_type: "",
      notes: "",
    },
  });

  const handleSubmit = async (data: VehicleStorageFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Vehicle Information */}
        <div className="p-4 space-y-3">
          <Card className="border-0 p-4 ">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">
                    🚗
                  </span>
                </div>
                <h3 className="font-semibold text-sm">
                  Información del Vehículo
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 ">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IN">
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-700">
                              ENTRADA
                            </Badge>
                          </SelectItem>
                          <SelectItem value="OUT">
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-700">
                              SALIDA
                            </Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese la marca" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el modelo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vin_or_plate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN / Placa</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese VIN o número de placa"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Storage Information */}
          <Card className="border-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">
                    📦
                  </span>
                </div>
                <h3 className="font-semibold text-sm">
                  Información de Almacenamiento
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="entry_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Entrada</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar fecha de entrada"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exit_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Salida</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar fecha de salida"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Días Totales</Label>
                  <div className="flex items-center justify-center h-9 border border-gray-200 rounded-md bg-gray-50">
                    <span className="text-sm font-medium">0</span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="location_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar ubicación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino / Lugar de Entrega</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese destino o lugar de entrega"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Preparation Information */}
          <Card className="border-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">
                    ✈️
                  </span>
                </div>
                <h3 className="font-semibold text-sm">
                  Información de Preparación
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="request_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Solicitud</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar fecha de solicitud"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requested_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solicitado Por</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unpacking_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Desempaque</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar fecha de desempaque"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unpacking_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Desempaque</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full">
                            Desempaque Completo
                          </SelectItem>
                          <SelectItem value="partial">
                            Desempaque Parcial
                          </SelectItem>
                          <SelectItem value="inspection">
                            Solo Inspección
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="border-0 p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">
                    📝
                  </span>
                </div>
                <h3 className="font-semibold text-sm">Notas</h3>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Notas / Anotaciones / Otra Información
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ingrese notas o cualquier información adicional..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>
        </div>

        {/* Buttons */}
        <div className="sticky bottom-0 flex gap-3 p-6 bg-white border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="flex-1">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="flex-1 ">
            {isLoading ? "Guardando..." : "Guardar Vehículo"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
