import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { tariffServiceUpdateSchema } from "@/validators/tariff_services";
import { getTariffServiceById } from "@/db/queries";
import { updateTariffService, deleteTariffService } from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const service = await getTariffServiceById(id);

    if (!service) {
      return NextResponse.json(
        { error: "Tariff service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Failed to fetch tariff service:", error);
    return NextResponse.json(
      { error: "Failed to fetch tariff service" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const body = await request.json();
    const data = tariffServiceUpdateSchema.parse(body);
    const service = await updateTariffService(id, data);

    if (!service) {
      return NextResponse.json(
        { error: "Tariff service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(service);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Failed to update tariff service:", error);
    return NextResponse.json(
      { error: "Failed to update tariff service" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    await deleteTariffService(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete tariff service:", error);
    return NextResponse.json(
      { error: "Failed to delete tariff service" },
      { status: 500 },
    );
  }
}
