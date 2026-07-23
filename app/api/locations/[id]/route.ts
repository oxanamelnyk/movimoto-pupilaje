import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { locationUpdateSchema } from "@/validators/locations";
import { getLocationById } from "@/db/queries";
import { deleteLocation, updateLocation } from "@/db/mutations";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseLocationId(value: string): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const rawId = (await params).id;
    const id = parseLocationId(rawId);

    if (id === null) {
      return NextResponse.json(
        { error: "Invalid location ID" },
        { status: 400 }
      );
    }

    const location = await getLocationById(id);

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error: unknown) {
    console.error("Failed to fetch location:", error);

    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const rawId = (await params).id;
    const id = parseLocationId(rawId);

    if (id === null) {
      return NextResponse.json(
        { error: "Invalid location ID" },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();
    const data = locationUpdateSchema.parse(body);

    const location = await updateLocation(id, data);

    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(location);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Failed to update location:", error);

    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const rawId = (await params).id;
    const id = parseLocationId(rawId);

    if (id === null) {
      return NextResponse.json(
        { error: "Invalid location ID" },
        { status: 400 }
      );
    }

    await deleteLocation(id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete location:", error);

    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}