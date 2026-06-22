import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { clientCreateSchema } from "@/validators/clients";
import { createClient } from "@/db/mutations";
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
    const client = await createClient(data);
    return NextResponse.json(client, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 },
    );
  }
}
