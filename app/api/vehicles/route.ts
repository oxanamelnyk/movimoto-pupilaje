import { NextRequest, NextResponse } from "next/server";
import { vehicleCreateSchema } from "@/validators/vehicles";
import { getVehicles } from "@/db/queries";
import { vehicles, vehicle_storage, vehicle_preparation } from "@/db/schema";
import { db } from "@/db";

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

    // Use transaction for atomicity
    const result = await db.transaction(async (tx) => {
      // 1. Create vehicle record using Drizzle's insert
      const vehicleResult = await tx
        .insert(vehicles)
        .values({
          client_id: data.client_id,
          brand_id: data.brand_id,
          model_id: data.model_id,
          color_id: data.color_id || null,
          status_id: data.status_id,
          vin: data.vin || null,
          plate_number: data.plate_number || null,
          notes: data.notes || null,
        })
        .$returningId();

      const vehicleId = vehicleResult[0]?.id;

      if (!vehicleId) {
        throw new Error("Failed to generate vehicle ID");
      }

      console.log("✅ Vehicle created with ID:", vehicleId);

      // 2. Create storage record if entry_date and location_id provided
      if (data.entry_date && data.location_id) {
        await tx
          .insert(vehicle_storage)
          .values({
            vehicle_id: vehicleId,
            entry_date: data.entry_date,
            exit_date: data.exit_date || null,
            location_id: data.location_id,
            delivery_place: data.delivery_place || null,
          });
        console.log("✅ Storage record created");
      }

      // 3. Create preparation record if data provided
      if (
        data.request_date ||
        data.requested_by ||
        data.preparation_date ||
        data.preparation_type_id
      ) {
        await tx
          .insert(vehicle_preparation)
          .values({
            vehicle_id: vehicleId,
            request_date: data.request_date || null,
            requested_by: data.requested_by || null,
            preparation_date: data.preparation_date || null,
            preparation_type_id: data.preparation_type_id || null,
          });
        console.log("✅ Preparation record created");
      }

      return { id: vehicleId };
    });

    console.log("✅ Transaction completed successfully");
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
