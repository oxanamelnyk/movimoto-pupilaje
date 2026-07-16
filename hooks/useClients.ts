import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VehicleStorageFormData } from "@/components/vehicles/AddVehicleForm";

export interface Client {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  created_at: Date | null;
}

export interface Location {
  id: number;
  name: string;
}

export interface Vehicle {
  id: number;
  client_id: number;
  brand_id: number;
  model_id: number;
  color_id?: number | null;
  status_id: number;
  registration_identity?: string | null;
  notes?: string | null;
  created_at?: Date | null;
}

export interface VehicleStorageRecord {
  id: number;
  vehicle_id: number;
  location_id: number;
  entry_date: string;
  exit_date?: string | null;
  delivery_place?: string | null;
  created_at?: Date | null;
}

export interface VehiclePreparation {
  id: number;
  vehicle_id: number;
  request_date?: string | null;
  requested_by?: string | null;
  preparation_date?: string | null;
  preparation_type_id?: number | null;
  created_at?: Date | null;
}

// Clients Hook
export function useClients() {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      return response.json();
    },
  });
}

// Locations Hook
export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await fetch("/api/locations");
      if (!response.ok) throw new Error("Failed to fetch locations");
      return response.json();
    },
  });
}

// Vehicle Statuses Hook
export interface VehicleStatus {
  id: number;
  name: string;
}

export function useVehicleStatuses() {
  return useQuery<VehicleStatus[]>({
    queryKey: ["vehicle-statuses"],
    queryFn: async () => {
      const response = await fetch("/api/vehicle-statuses");
      if (!response.ok) throw new Error("Failed to fetch vehicle statuses");
      return response.json();
    },
  });
}

// Vehicles Hook
export function useVehicles(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["vehicles", page, limit],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const response = await fetch(
        `/api/vehicles?offset=${offset}&limit=${limit}`,
      );
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      return response.json();
    },
  });
}

// Get single vehicle with full details
export function useVehicleById(id: number | null | undefined) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      if (!id) throw new Error("Vehicle ID is required");
      const response = await fetch(`/api/vehicles/${id}`);
      if (!response.ok) throw new Error("Failed to fetch vehicle details");
      return response.json();
    },
    enabled: !!id, // Only fetch if id is provided
  });
}

// Vehicle Storage Records Hook
export function useVehicleStorageRecords() {
  return useQuery<VehicleStorageRecord[]>({
    queryKey: ["vehicle-storage-records"],
    queryFn: async () => {
      const response = await fetch("/api/vehicle-storage");
      if (!response.ok) throw new Error("Failed to fetch storage records");
      return response.json();
    },
  });
}

// Create Vehicle (with storage and preparation) Mutation
export function useCreateVehicleStorageRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VehicleStorageFormData) => {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || "Failed to create vehicle";
        const details = responseData.details
          ? JSON.stringify(responseData.details)
          : "";
        throw new Error(`${errorMessage}${details ? ": " + details : ""}`);
      }
      return responseData;
    },
    onSuccess: (_, variables) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-storage-records"] });
    },
  });
}

export function useUpdateVehicleStorageRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: VehicleStorageFormData;
    }) => {
      // Filter out fields that shouldn't be sent (0 values, empty strings for certain fields)
      const cleanData: any = {};

      if (data.client_id && data.client_id > 0)
        cleanData.client_id = data.client_id;
      if (data.brand_id && data.brand_id > 0)
        cleanData.brand_id = data.brand_id;
      if (data.model_id && data.model_id > 0)
        cleanData.model_id = data.model_id;
      if (data.color_id !== null && data.color_id !== undefined)
        cleanData.color_id = data.color_id;
      if (data.status_id && data.status_id > 0)
        cleanData.status_id = data.status_id;
      if (data.registration_identity)
        cleanData.registration_identity = data.registration_identity;
      if (data.notes !== null && data.notes !== undefined)
        cleanData.notes = data.notes;
      if (data.entry_date) cleanData.entry_date = data.entry_date;
      if (data.exit_date !== null && data.exit_date !== undefined)
        cleanData.exit_date = data.exit_date;
      if (data.location_id && data.location_id > 0)
        cleanData.location_id = data.location_id;
      if (data.delivery_place !== null && data.delivery_place !== undefined)
        cleanData.delivery_place = data.delivery_place;
      if (data.request_date !== null && data.request_date !== undefined)
        cleanData.request_date = data.request_date;
      if (data.requested_by) cleanData.requested_by = data.requested_by;
      if (data.preparation_date !== null && data.preparation_date !== undefined)
        cleanData.preparation_date = data.preparation_date;
      if (
        data.preparation_type_id !== null &&
        data.preparation_type_id !== undefined
      )
        cleanData.preparation_type_id = data.preparation_type_id;

      console.log(
        "📝 Sending update data:",
        JSON.stringify(cleanData, null, 2),
      );

      const response = await fetch(`/api/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || "Failed to update vehicle";
        const details = responseData.details
          ? JSON.stringify(responseData.details)
          : "";
        throw new Error(`${errorMessage}${details ? ": " + details : ""}`);
      }
      return responseData;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-storage-records"] });
    },
  });
}
