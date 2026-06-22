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
  vin?: string | null;
  plate_number?: string | null;
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

// Vehicles Hook
export function useVehicles() {
  return useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await fetch("/api/vehicles");
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      return response.json();
    },
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
      if (!response.ok) throw new Error("Failed to create vehicle");
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-storage-records"] });
    },
  });
}
