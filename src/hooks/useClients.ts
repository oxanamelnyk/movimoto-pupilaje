import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VehicleStorageFormData } from "@/components/vehicles/AddVehicleForm";

export interface Client {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface Vehicle {
  id: string;
  client_id: string;
  brand: string;
  model: string;
  vin_or_plate: string;
  color?: string | null;
}

export interface VehicleStorageRecord {
  id: string;
  vehicle_id: string;
  location_id: string;
  entry_date: string;
  exit_date?: string | null;
  request_date?: string | null;
  requested_by?: string | null;
  unpacking_date?: string | null;
  unpacking_type?: string | null;
  notes?: string | null;
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
      const response = await fetch("/api/vehicle-storage-records");
      if (!response.ok) throw new Error("Failed to fetch storage records");
      return response.json();
    },
  });
}

// Create Vehicle Storage Record Mutation
export function useCreateVehicleStorageRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VehicleStorageFormData) => {
      const response = await fetch("/api/vehicle-storage-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create storage record");
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["vehicle-storage-records"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
