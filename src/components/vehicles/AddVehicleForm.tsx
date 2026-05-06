"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Badge } from "@/components/ui/badge";
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
  client_id: z.string().min(1, "Client is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  vin_or_plate: z.string().min(1, "VIN or plate is required"),
  color: z.string().optional(),
  status: z.enum(["IN", "OUT"]),
  entry_date: z.string().min(1, "Entry date is required"),
  exit_date: z.string().optional(),
  location_id: z.string().min(1, "Location is required"),
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
      status: "IN",
      entry_date: new Date().toISOString().split("T")[0],
    },
  });

  const handleSubmit = async (data: VehicleStorageFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Vehicle Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">🚗</span>
            </div>
            <h3 className="font-semibold text-sm">Vehicle Information</h3>
          </div>

          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
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

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand" {...field} />
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
                  <FormLabel className="text-red-700">Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="vin_or_plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN / Plate</FormLabel>
                <FormControl>
                  <Input placeholder="Enter VIN or plate number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
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
                          IN
                        </Badge>
                      </SelectItem>
                      <SelectItem value="OUT">
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-700">
                          OUT
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Storage Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">📦</span>
            </div>
            <h3 className="font-semibold text-sm">Storage Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="entry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Exit Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Days</Label>
              <div className="flex items-center justify-center h-9 border border-gray-200 rounded-md bg-gray-50">
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
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
                <FormLabel>Destination / Delivery Place</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter destination or delivery place"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Preparation Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">✈️</span>
            </div>
            <h3 className="font-semibold text-sm">Preparation Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="request_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Requested By</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
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
                  <FormLabel>Unpacking Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Unpacking Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full">Full Unpacking</SelectItem>
                      <SelectItem value="partial">Partial Unpacking</SelectItem>
                      <SelectItem value="inspection">
                        Inspection Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-600">📝</span>
            </div>
            <h3 className="font-semibold text-sm">Notes</h3>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes / Annotations / Other Info</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter notes or any additional information..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Saving..." : "Save Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
