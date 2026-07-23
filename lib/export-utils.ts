import * as XLSX from "xlsx";

/**
 * Export vehicles data to Excel format (.xlsx)
 */
export function exportVehiclesToExcel(
  vehicles: unknown[],
  fileName: string = "vehicles.xlsx",
) {
  if (vehicles.length === 0) {
    console.warn("No vehicles to export");
    return;
  }

  try {
    // Prepare data for Excel
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

    const data: (string | number)[][] = [headers];

    vehicles.forEach((v) => {
      const vehicle = v as Record<string, unknown>;
      const diasTotal = calculateDaysBetween(
        vehicle.entry_date as string,
        vehicle.exit_date as string,
      );
      const row = [
        (vehicle.client_name as string) || "",
        (vehicle.status_name as string) || "",
        (vehicle.brand_name as string) || "",
        (vehicle.model_name as string) || "",
        (vehicle.registration_identity as string) || "",
        (vehicle.color_name as string) || "",
        formatDateForExport(vehicle.entry_date as string),
        formatDateForExport(vehicle.exit_date as string),
        diasTotal,
        (vehicle.location_name as string) || "",
        (vehicle.delivery_place as string) || "",
        formatDateForExport(vehicle.preparation_date as string),
        (vehicle.preparation_type_name as string) || "",
        (vehicle.notes as string) || "",
      ];
      data.push(row);
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    const colWidths = [15, 12, 15, 15, 18, 12, 12, 12, 12, 15, 18, 15, 15, 20];
    ws["!cols"] = colWidths.map((width) => ({ wch: width }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Motos");

    // Write file
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
}

function formatDateForExport(date: string | null | undefined): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("es-ES");
  } catch {
    return date || "";
  }
}

function calculateDaysBetween(
  entryDate: string | null | undefined,
  exitDate: string | null | undefined,
): string {
  if (!entryDate) return "";

  try {
    const entry = new Date(entryDate);
    const exit = exitDate ? new Date(exitDate) : new Date();

    let d1 = entry.getDate();
    const m1 = entry.getMonth() + 1;
    const y1 = entry.getFullYear();

    let d2 = exit.getDate();
    const m2 = exit.getMonth() + 1;
    const y2 = exit.getFullYear();

    if (d1 === 31) d1 = 30;
    if (d2 === 31 && (d1 === 30 || d1 === 31)) d2 = 30;

    const days = (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
    return days < 1 ? "" : String(days);
  } catch {
    return "";
  }
}

/**
 * Legacy: Export vehicles data to CSV format
 * @deprecated Use exportVehiclesToExcel instead
 */
export function exportVehiclesToCSV(
  vehicles: unknown[],
  fileName: string = "vehicles.csv",
) {
  if (vehicles.length === 0) {
    console.warn("No vehicles to export");
    return;
  }

  const csvContent = convertVehiclesToCSV(vehicles);
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

function convertVehiclesToCSV(vehicles: unknown[]): string {
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

  // Build CSV rows
  const rows: string[] = [];

  // Add header row
  rows.push(headers.map((h) => `"${h}"`).join(","));

  // Add data rows
  vehicles.forEach((vehicle: unknown) => {
    const typedVehicle = vehicle as Record<string, unknown>;
    const diasTotal = calculateDaysBetween(
      typedVehicle.entry_date as string,
      typedVehicle.exit_date as string,
    );
    const row = [
      (typedVehicle.client_name as string) || "",
      (typedVehicle.status_name as string) || "",
      (typedVehicle.brand_name as string) || "",
      (typedVehicle.model_name as string) || "",
      (typedVehicle.registration_identity as string) || "",
      (typedVehicle.color_name as string) || "",
      formatDateForExport(typedVehicle.entry_date as string),
      formatDateForExport(typedVehicle.exit_date as string),
      diasTotal,
      (typedVehicle.location_name as string) || "",
      (typedVehicle.delivery_place as string) || "",
      formatDateForExport(typedVehicle.preparation_date as string),
      (typedVehicle.preparation_type_name as string) || "",
      (typedVehicle.notes as string) || "",
    ];

    rows.push(
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    );
  });

  return rows.join("\n");
}
