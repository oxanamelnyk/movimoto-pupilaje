import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export function getDefaultValues(): VehicleStorageFormData {
  return {
    // Vehicle info
    client_id: 0,
    brand_id: 0,
    model_id: 0,
    color_id: null,
    status_id: 0,
    vin: "",
    plate_number: "",
    
    // Storage info
    entry_date: getTodayDateString(),
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
}
