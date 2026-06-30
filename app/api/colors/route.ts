import { NextResponse, NextRequest } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, name FROM colors ORDER BY name"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching colors:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Color name is required" },
        { status: 400 }
      );
    }

    // Check if color already exists
    const existingColor = await query(
      "SELECT id FROM colors WHERE name = ?",
      [name]
    );

    if (existingColor.length > 0) {
      return NextResponse.json(existingColor[0], { status: 200 });
    }

    // Create new color
    const result = await query(
      "INSERT INTO colors (name) VALUES (?)",
      [name.trim()]
    );

    return NextResponse.json(
      { id: result.insertId, name: name.trim() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating color:", error);
    return NextResponse.json(
      { error: "Failed to create color" },
      { status: 500 }
    );
  }
}
