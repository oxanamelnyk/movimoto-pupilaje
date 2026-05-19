import { VehicleStorageFormData } from "@/schemas/vehicle-storage.schema";

export const defaultValues: VehicleStorageFormData = {
  client_id: "",
  brand: "",
  model: "",
  vin_or_plate: "",
  color: "",
  estado: "entrega",
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
};
