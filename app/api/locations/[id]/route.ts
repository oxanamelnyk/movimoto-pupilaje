import { NextRequest, NextResponse } from "next/server";
import { locationUpdateSchema } from "@/validators/locations";
import { getLocationById } from "@/db/queries";
import { deleteLocation, updateLocation } from "@/db/mutations";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const location = await getLocationById(id);
    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(location);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const data = locationUpdateSchema.parse(body);
    const location = await updateLocation(id, data);
    if (!location) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(location);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    await deleteLocation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 },
    );
  }
}
