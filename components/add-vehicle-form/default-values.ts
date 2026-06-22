import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";

export const defaultValues: VehicleStorageFormData = {
  // Vehicle info
  client_id: 0,
  brand_id: 0,
  model_id: 0,
  color_id: null,
  status_id: 0,
  vin: "",
  plate_number: "",
  
  // Storage info
  entry_date: new Date().toISOString().split("T")[0],
  exit_date: null,
  location_id: 0,
  delivery_place: "",
  
  // Preparation info
  request_date: null,
  requested_by: "",
  preparation_date: null,
  preparation_type_id: null,
  
  // Notes
  notes: "",
};
