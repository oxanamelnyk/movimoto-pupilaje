import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { vehicleUpdateSchema } from "@/validators/vehicles";
import { getVehicleById } from "@/db/queries";
import { deleteVehicle, updateVehicle } from "@/db/mutations";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type DatabaseError = Error & {
  code?: string;
};

function parseVehicleId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function isDatabaseError(error: unknown): error is DatabaseError {
  return error instanceof Error;
}

function isConnectionLimitError(error: unknown): boolean {
  if (!isDatabaseError(error)) {
    return false;
  }

  return (
    error.message.includes("max_user_connections") ||
    error.code === "ER_TOO_MANY_CONNECTIONS"
  );
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const rawId = (await params).id;
    const id = parseVehicleId(rawId);

    if (id === null) {
      return NextResponse.json(
        { error: "Invalid vehicle ID" },
        { status: 400 }
      );
    }

    const vehicle = await getVehicleById(id);

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error: unknown) {
    console.error("Failed to fetch vehicle:", error);

    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  const rawId = (await params).id;
  const id = parseVehicleId(rawId);

  if (id === null) {
    return NextResponse.json(
      { error: "Invalid vehicle ID" },
      { status: 400 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  let data;

  try {
    data = vehicleUpdateSchema.parse(body);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error(
        "Validation error details:",
        JSON.stringify(error.issues, null, 2)
      );

      return NextResponse.json(
        {
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    throw error;
  }

  let retries = 3;
  let lastError: unknown;

  while (retries > 0) {
    try {
      console.log(
        "Updating vehicle with data:",
        JSON.stringify(data, null, 2)
      );

      const vehicle = await updateVehicle(id, data);

      if (!vehicle) {
        return NextResponse.json(
          { error: "Vehicle not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(vehicle);
    } catch (error: unknown) {
      lastError = error;

      if (isConnectionLimitError(error)) {
        retries -= 1;

        if (retries > 0) {
          console.warn(
            `Connection pool exhausted, retrying... (${retries} left)`
          );

          await new Promise((resolve) =>
            setTimeout(resolve, (4 - retries) * 500)
          );

          continue;
        }
      }

      console.error("Error updating vehicle:", error);
      break;
    }
  }

  const message = isDatabaseError(lastError)
    ? lastError.message
    : "Unknown error";

  return NextResponse.json(
    {
      error: isConnectionLimitError(lastError)
        ? "Database connection limit reached. Please try again."
        : "Failed to update vehicle",
      message,
    },
    { status: 500 }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const rawId = (await params).id;
    const id = parseVehicleId(rawId);

    if (id === null) {
      return NextResponse.json(
        { error: "Invalid vehicle ID" },
        { status: 400 }
      );
    }

    await deleteVehicle(id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete vehicle:", error);

    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}