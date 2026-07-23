import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import type { RowDataPacket } from "mysql2";

import { clientCreateSchema } from "@/validators/clients";
import { query, execute } from "@/db";
import { getPupilajeclients } from "@/db/queries";

type ExistingClientRow = RowDataPacket & {
  id: number;
};

export async function GET() {
  try {
    const clients = await getPupilajeclients();

    return NextResponse.json(clients);
  } catch (error: unknown) {
    console.error("Failed to fetch clients:", error);

    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = clientCreateSchema.parse(body);

    if (!data.name || data.name.trim() === "") {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 },
      );
    }

    const trimmedName = data.name.trim();

    const existingClient = await query<ExistingClientRow[]>(
      "SELECT id FROM clients WHERE name = ?",
      [trimmedName],
    );

    if (existingClient.length > 0) {
      return NextResponse.json(existingClient[0], { status: 200 });
    }

    const [result] = await execute(
      "INSERT INTO clients (name, phone, email) VALUES (?, ?, ?)",
      [trimmedName, data.phone || null, data.email || null],
    );

    const insertResult = result as { insertId: number };
    return NextResponse.json(
      {
        id: insertResult.insertId,
        name: trimmedName,
        phone: data.phone || null,
        email: data.email || null,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error("Validation error:", error.issues);

      return NextResponse.json(
        {
          error: "Validation error",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Error creating client:", error);

    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 },
    );
  }
}
