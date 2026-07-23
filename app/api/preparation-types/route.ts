import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { query, execute } from "@/db";

type PreparationTypeRow = RowDataPacket & {
  id: number;
  name: string;
};

type ExistingPreparationTypeRow = RowDataPacket & {
  id: number;
};

export async function GET() {
  try {
    const result = await query<PreparationTypeRow[]>(
      "SELECT id, name FROM preparation_types ORDER BY name",
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error fetching preparation types:", error);

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
        { error: "Preparation type name is required" },
        { status: 400 },
      );
    }

    const trimmedName = body.name.trim();

    const existingType = await query<ExistingPreparationTypeRow[]>(
      "SELECT id FROM preparation_types WHERE name = ?",
      [trimmedName],
    );

    if (existingType.length > 0) {
      return NextResponse.json(existingType[0], { status: 200 });
    }

    const [result] = await execute(
      "INSERT INTO preparation_types (name) VALUES (?)",
      [trimmedName],
    );

    const insertResult = result as { insertId: number };
    return NextResponse.json(
      {
        id: insertResult.insertId,
        name: trimmedName,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error creating preparation type:", error);

    return NextResponse.json(
      { error: "Failed to create preparation type" },
      { status: 500 },
    );
  }
}
