import { NextRequest, NextResponse } from "next/server";
import { vehicleCreateSchema } from "@/validators/vehicles";
import { getVehicles } from "@/db/queries";
import { createVehicle } from "@/db/mutations";

export async function GET() {
  try {
    const vehicles = await getVehicles();
    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = vehicleCreateSchema.parse(body);
    const vehicle = await createVehicle(data);
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 },
    );
  }
}
