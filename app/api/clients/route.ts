import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { clientCreateSchema } from "@/validators/clients";
import { query } from "@/db";
import { getPupilajeclients } from "@/db/queries";

export async function GET() {
  try {
    const clients = await getPupilajeclients();
    return NextResponse.json(clients);
  } catch (error: unknown) {
    console.error("Failed to fetch clients:", error);
    // Return empty array on error (table might not exist)
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = clientCreateSchema.parse(body);

    if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
      return NextResponse.json(
        { error: "Client name is required" },
        { status: 400 }
      );
    }

    // Check if client already exists
    const existingClient = await query(
      "SELECT id FROM clients WHERE name = ?",
      [data.name]
    );

    if (existingClient.length > 0) {
      return NextResponse.json(existingClient[0], { status: 200 });
    }

    // Create new client
    const result = await query(
      "INSERT INTO clients (name, phone, email) VALUES (?, ?, ?)",
      [data.name.trim(), data.phone || null, data.email || null]
    );

    return NextResponse.json(
      { 
        id: (result as any).insertId, 
        name: data.name.trim(),
        phone: data.phone || null,
        email: data.email || null 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
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
