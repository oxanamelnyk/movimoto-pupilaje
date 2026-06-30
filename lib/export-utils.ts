/**
 * Export vehicles data to Excel format
 */
export function exportVehiclesToExcel(
  vehicles: any[],
  fileName: string = "vehicles.xlsx"
) {
  // Convert vehicles to CSV format first
  const csvContent = convertVehiclesToCSV(vehicles);

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertVehiclesToCSV(vehicles: any[]): string {
  if (vehicles.length === 0) {
    return "";
  }

  // Define headers
  const headers = [
    "Cliente",
    "Estado",
    "Marca",
    "Modelo",
    "Bastidor/Matrícula",
    "Color",
    "Entrada",
    "Salida",
    "Días Total",
    "Ubicación",
    "Lugar de Entrega",
    "Fecha Desencaje",
    "Tipo Desencaje",
    "Notas",
  ];

  // Format date
  const formatDate = (date: string | null | undefined): string => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("es-ES");
    } catch {
      return date || "";
    }
  };

  // Calculate days between dates (DAYS360)
  const calculateDays = (
    entryDate: string | null | undefined,
    exitDate: string | null | undefined
  ): string => {
    if (!entryDate) return "";

    try {
      const entry = new Date(entryDate);
      const exit = exitDate ? new Date(exitDate) : new Date();

      let d1 = entry.getDate();
      let m1 = entry.getMonth() + 1;
      let y1 = entry.getFullYear();

      let d2 = exit.getDate();
      let m2 = exit.getMonth() + 1;
      let y2 = exit.getFullYear();

      if (d1 === 31) d1 = 30;
      if (d2 === 31 && (d1 === 30 || d1 === 31)) d2 = 30;

      const days = (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
      return days < 1 ? "" : String(days);
    } catch {
      return "";
    }
  };

  // Build CSV rows
  const rows: string[] = [];

  // Add header row
  rows.push(headers.map((h) => `"${h}"`).join(","));

  // Add data rows
  vehicles.forEach((vehicle) => {
    const diasTotal = calculateDays(vehicle.entry_date, vehicle.exit_date);
    const row = [
      vehicle.client_name || "",
      vehicle.status_name || "",
      vehicle.brand_name || "",
      vehicle.model_name || "",
      vehicle.registration_identity || "",
      vehicle.color_name || "",
      formatDate(vehicle.entry_date),
      formatDate(vehicle.exit_date),
      diasTotal,
      vehicle.location_name || "",
      vehicle.delivery_place || "",
      formatDate(vehicle.preparation_date),
      vehicle.preparation_type_name || "",
      vehicle.notes || "",
    ];

    rows.push(row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","));
  });

  return rows.join("\n");
}
