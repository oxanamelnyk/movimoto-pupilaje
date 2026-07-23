import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { query, execute } from "@/db";

type ColorRow = RowDataPacket & {
  id: number;
  name: string;
};

type ExistingColorRow = RowDataPacket & {
  id: number;
};

export async function GET() {
  try {
    const result = await query<ColorRow[]>(
      "SELECT id, name FROM colors ORDER BY name",
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error fetching colors:", error);

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
        { error: "Color name is required" },
        { status: 400 },
      );
    }

    const trimmedName = body.name.trim();

    const existingColor = await query<ExistingColorRow[]>(
      "SELECT id FROM colors WHERE name = ?",
      [trimmedName],
    );

    if (existingColor.length > 0) {
      return NextResponse.json(existingColor[0], { status: 200 });
    }

    const [result] = await execute("INSERT INTO colors (name) VALUES (?)", [
      trimmedName,
    ]);

    const insertResult = result as { insertId: number };
    return NextResponse.json(
      {
        id: insertResult.insertId,
        name: trimmedName,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Error creating color:", error);

    return NextResponse.json(
      { error: "Failed to create color" },
      { status: 500 },
    );
  }
}
