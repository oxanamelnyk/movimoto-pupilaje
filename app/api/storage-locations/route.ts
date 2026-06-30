import { NextResponse, NextRequest } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, name FROM storage_locations ORDER BY name"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching storage locations:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Location name is required" },
        { status: 400 }
      );
    }

    // Check if location already exists
    const existingLocation = await query(
      "SELECT id FROM storage_locations WHERE name = ?",
      [name]
    );

    if (existingLocation.length > 0) {
      return NextResponse.json(existingLocation[0], { status: 200 });
    }

    // Create new location
    const result = await query(
      "INSERT INTO storage_locations (name) VALUES (?)",
      [name.trim()]
    );

    return NextResponse.json(
      { id: result.insertId, name: name.trim() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating storage location:", error);
    return NextResponse.json(
      { error: "Failed to create storage location" },
      { status: 500 }
    );
  }
}
