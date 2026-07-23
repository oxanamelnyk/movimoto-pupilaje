import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { query, execute } from "@/db";

type ModelRow = RowDataPacket & {
  id: number;
  brand_id: number;
  name: string;
};

type ExistingModelRow = RowDataPacket & {
  id: number;
};

export async function GET() {
  try {
    const result = await query<ModelRow[]>(
      "SELECT id, brand_id, name FROM models ORDER BY name",
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error fetching models:", error);

    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("name" in body) ||
      typeof body.name !== "string" ||
      body.name.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Model name is required" },
        { status: 400 },
      );
    }

    if (
      !("brand_id" in body) ||
      typeof body.brand_id !== "number" ||
      !Number.isInteger(body.brand_id) ||
      body.brand_id <= 0
    ) {
      return NextResponse.json(
        { error: "Valid brand ID is required" },
        { status: 400 },
      );
    }

    const trimmedName = body.name.trim();
    const brandId = body.brand_id;

    const existingModel = await query<ExistingModelRow[]>(
      "SELECT id FROM models WHERE name = ? AND brand_id = ?",
      [trimmedName, brandId],
    );

    if (existingModel.length > 0) {
      return NextResponse.json(existingModel[0], { status: 200 });
    }

    const [result] = await execute(
      "INSERT INTO models (name, brand_id) VALUES (?, ?)",
      [trimmedName, brandId],
    );

    const insertResult = result as { insertId: number };
    return NextResponse.json(
      {
        id: insertResult.insertId,
        name: trimmedName,
        brand_id: brandId,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error creating model:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: "Failed to create model",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
