import { NextRequest, NextResponse } from "next/server";
import { vehicleUpdateSchema } from "@/validators/vehicles";
import { getVehicleById } from "@/db/queries";
import { deleteVehicle, updateVehicle } from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let retries = 3;
  let lastError: any;

  while (retries > 0) {
    try {
      const id = (await params).id;
      const body = await request.json();
      console.log(
        "📝 Updating vehicle with data:",
        JSON.stringify(body, null, 2),
      );

      const data = vehicleUpdateSchema.parse(body);
      console.log("✅ Validation passed");

      const vehicle = await updateVehicle(id, data);
      if (!vehicle) {
        return NextResponse.json(
          { error: "Vehicle not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(vehicle);
    } catch (error: any) {
      lastError = error;

      // Check if it's a connection error
      if (
        error.message?.includes("max_user_connections") ||
        error.code === "ER_TOO_MANY_CONNECTIONS"
      ) {
        retries--;
        if (retries > 0) {
          console.warn(
            `⏳ Connection pool exhausted, retrying... (${retries} left)`,
          );
          // Wait before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, (4 - retries) * 500),
          );
          continue;
        }
      }

      // Handle other errors
      if (error.name === "ZodError") {
        console.error(
          "❌ Validation error details:",
          JSON.stringify(error.errors, null, 2),
        );
        return NextResponse.json(
          { error: "Validation error", details: error.errors },
          { status: 400 },
        );
      }

      console.error("❌ Error updating vehicle:", error.message || error);
      break;
    }
  }

  return NextResponse.json(
    {
      error: lastError?.message?.includes("max_user_connections")
        ? "Database connection limit reached. Please try again."
        : "Failed to update vehicle",
      message: lastError?.message,
    },
    { status: 500 },
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    await deleteVehicle(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 },
    );
  }
}
