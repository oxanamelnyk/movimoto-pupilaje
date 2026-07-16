import { NextResponse, NextRequest } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, name FROM brands ORDER BY name"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    // Check if brand already exists
    const existingBrand = await query(
      "SELECT id FROM brands WHERE name = ?",
      [name]
    );

    if (Array.isArray(existingBrand) && existingBrand.length > 0) {
      return NextResponse.json(existingBrand[0], { status: 200 });
    }

    // Create new brand
    const result = await query(
      "INSERT INTO brands (name) VALUES (?)",
      [name.trim()]
    );

    return NextResponse.json(
      { id: result.insertId, name: name.trim() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}
