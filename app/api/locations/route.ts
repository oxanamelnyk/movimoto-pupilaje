import { NextRequest, NextResponse } from "next/server";
import { locationCreateSchema } from "@/validators/locations";
import { getLocations } from "@/db/queries/locations";
import { createLocation } from "@/db/mutations/locations";

export async function GET() {
  try {
    const locations = await getLocations();
    return NextResponse.json(locations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = locationCreateSchema.parse(body);
    const location = await createLocation(data);
    return NextResponse.json(location, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 },
    );
  }
}
