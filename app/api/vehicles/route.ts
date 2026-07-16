import { NextRequest, NextResponse } from "next/server";
import { vehicleCreateSchema } from "@/validators/vehicles";
import { getVehicles, getVehicleCount } from "@/db/queries";
import { createVehicle } from "@/db/mutations/vehicles";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    let limit = parseInt(searchParams.get("limit") || "10", 10);

    // Enforce reasonable limits to prevent connection pool exhaustion
    const MAX_LIMIT = 100;
    const MIN_LIMIT = 1;

    if (limit > MAX_LIMIT) {
      console.warn(
        `⚠️ Limit ${limit} exceeds MAX_LIMIT (${MAX_LIMIT}), capping to ${MAX_LIMIT}`,
      );
      limit = MAX_LIMIT;
    }
    if (limit < MIN_LIMIT) {
      limit = MIN_LIMIT;
    }

    const vehicleList = await getVehicles(offset, limit);
    const totalCount = await getVehicleCount();

    return NextResponse.json({
      vehicles: vehicleList,
      total: totalCount,
      offset,
      limit,
      message:
        limit !== parseInt(searchParams.get("limit") || "10", 10)
          ? "Limit was capped to maximum allowed value"
          : undefined,
    });
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
    console.log(
      "📝 Creating vehicle with data:",
      JSON.stringify(body, null, 2),
    );

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
