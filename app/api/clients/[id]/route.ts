import { NextRequest, NextResponse } from "next/server";
import { clientUpdateSchema } from "@/validators/clients";
import { getClientById } from "@/db/queries";
import { deleteClient, updateClient } from "@/db/mutations";


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const data = clientUpdateSchema.parse(body);
    const client = await updateClient(id, data);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json(client);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    await deleteClient(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 },
    );
  }
}
