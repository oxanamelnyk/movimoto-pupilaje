import { NextResponse, NextRequest } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, name FROM preparation_types ORDER BY name"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching preparation types:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Preparation type name is required" },
        { status: 400 }
      );
    }

    // Check if preparation type already exists
    const existingType = await query(
      "SELECT id FROM preparation_types WHERE name = ?",
      [name]
    );

    if (existingType.length > 0) {
      return NextResponse.json(existingType[0], { status: 200 });
    }

    // Create new preparation type
    const result = await query(
      "INSERT INTO preparation_types (name) VALUES (?)",
      [name.trim()]
    );

    return NextResponse.json(
      { id: result.insertId, name: name.trim() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating preparation type:", error);
    return NextResponse.json(
      { error: "Failed to create preparation type" },
      { status: 500 }
    );
  }
}
