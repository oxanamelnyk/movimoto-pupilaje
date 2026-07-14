import { NextResponse, NextRequest } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, brand_id, name FROM models ORDER BY name",
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, brand_id } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Model name is required" },
        { status: 400 },
      );
    }

    if (!brand_id) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400 },
      );
    }

    // Check if model already exists
    const existingModel = await query(
      "SELECT id FROM models WHERE name = ? AND brand_id = ?",
      [name, brand_id],
    );

    if (existingModel.length > 0) {
      return NextResponse.json(existingModel[0], { status: 200 });
    }

    // Create new model
    const result = await query(
      "INSERT INTO models (name, brand_id) VALUES (?, ?)",
      [name.trim(), brand_id],
    );

    return NextResponse.json(
      { id: result.insertId, name: name.trim(), brand_id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating model:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to create model", details: errorMessage },
      { status: 500 },
    );
  }
}
