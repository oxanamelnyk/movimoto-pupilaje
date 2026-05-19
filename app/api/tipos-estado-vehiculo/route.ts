import { getEstadoVehiculo } from "@/db/queries/tipos-estado-vehiculo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const estados = await getEstadoVehiculo();
    return NextResponse.json(estados);
  } catch (error) {
    console.error("Error fetching estados:", error);
    return NextResponse.json(
      { error: "Failed to fetch estados" },
      { status: 500 }
    );
  }
}
