import { NextRequest, NextResponse } from "next/server";
import { vehicleCreateSchema } from "@/validators/vehicles";
import { getVehicles } from "@/db/queries";
import { createVehicle } from "@/db/mutations/vehicles";

export async function GET() {
  try {
    const vehicleList = await getVehicles();
    return NextResponse.json(vehicleList);
  } catch (error) {
    console.error("❌ Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📝 Creating vehicle with data:", JSON.stringify(body, null, 2));
    
    const data = vehicleCreateSchema.parse(body);
    console.log("✅ Validation passed");

    const result = await createVehicle(data);
    
    console.log("✅ Vehicle and related records created successfully");
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      console.error("❌ Validation error:", error.errors);
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    console.error("❌ Error creating vehicle:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to create vehicle" },
      { status: 500 },
    );
  }
}
