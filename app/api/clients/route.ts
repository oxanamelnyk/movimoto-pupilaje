import { NextRequest, NextResponse } from "next/server";
import { clientCreateSchema } from "@/validators/clients";
import { createClient } from "@/db/mutations";
import { getClients } from "@/db/queries";

export async function GET() {
  try {
    const clients = await getClients();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = clientCreateSchema.parse(body);
    const client = await createClient(data);
    return NextResponse.json(client, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 },
    );
  }
}
