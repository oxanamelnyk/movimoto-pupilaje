import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import { query, execute } from "@/db";

type StorageLocationRow = RowDataPacket & {
  id: number;
  name: string;
};

type ExistingStorageLocationRow = RowDataPacket & {
  id: number;
};

export async function GET() {
  try {
    const result = await query<StorageLocationRow[]>(
      "SELECT id, name FROM storage_locations ORDER BY name",
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error fetching storage locations:", error);

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
        { error: "Location name is required" },
        { status: 400 },
      );
    }

    const trimmedName = body.name.trim();

    const existingLocation = await query<ExistingStorageLocationRow[]>(
      "SELECT id FROM storage_locations WHERE name = ?",
      [trimmedName],
    );

    if (existingLocation.length > 0) {
      return NextResponse.json(existingLocation[0], { status: 200 });
    }

    const [result] = await execute(
      "INSERT INTO storage_locations (name) VALUES (?)",
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
    console.error("Error creating storage location:", error);

    return NextResponse.json(
      { error: "Failed to create storage location" },
      { status: 500 },
    );
  }
}
