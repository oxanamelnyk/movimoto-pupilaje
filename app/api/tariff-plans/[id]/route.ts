import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { tariffPlanUpdateSchema } from "@/validators/tariff_plans";
import { getTariffPlanById, getTariffPlansByClientId } from "@/db/queries";
import {
  updateTariffPlan,
  deleteTariffPlan,
  duplicateTariffPlan,
} from "@/db/mutations";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);

    // Check if this is a request for tariffs by client ID
    const { searchParams } = new URL(request.url);
    if (searchParams.get("clientId")) {
      const clientId = Number(searchParams.get("clientId"));
      const tariffs = await getTariffPlansByClientId(clientId);
      return NextResponse.json(tariffs);
    }

    const tariff = await getTariffPlanById(id);
    if (!tariff) {
      return NextResponse.json(
        { error: "Tariff plan not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(tariff);
  } catch (error) {
    console.error("Failed to fetch tariff plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch tariff plan" },
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
    const data = tariffPlanUpdateSchema.parse(body);
    const tariff = await updateTariffPlan(id, data);

    if (!tariff) {
      return NextResponse.json(
        { error: "Tariff plan not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(tariff);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Failed to update tariff plan:", error);
    return NextResponse.json(
      { error: "Failed to update tariff plan" },
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
    await deleteTariffPlan(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete tariff plan:", error);
    return NextResponse.json(
      { error: "Failed to delete tariff plan" },
      { status: 500 },
    );
  }
}

// POST to duplicate
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = Number((await params).id);
    const body = await request.json();

    if (body.action === "duplicate") {
      const newTariff = await duplicateTariffPlan(id);
      if (!newTariff) {
        return NextResponse.json(
          { error: "Tariff plan not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(newTariff, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Failed to duplicate tariff plan:", error);
    return NextResponse.json(
      { error: "Failed to duplicate tariff plan" },
      { status: 500 },
    );
  }
}
