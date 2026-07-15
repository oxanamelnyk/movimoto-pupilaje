import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { tariffPlanCreateSchema } from "@/validators/tariff_plans";
import { getTariffPlans } from "@/db/queries";
import { createTariffPlan } from "@/db/mutations";

export async function GET() {
  try {
    const tariffs = await getTariffPlans();
    return NextResponse.json(tariffs);
  } catch (error: unknown) {
    console.error("Failed to fetch tariff plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch tariff plans" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = tariffPlanCreateSchema.parse(body);
    const tariff = await createTariffPlan(data);

    if (!tariff) {
      return NextResponse.json(
        { error: "Failed to create tariff plan" },
        { status: 500 },
      );
    }

    return NextResponse.json(tariff, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Failed to create tariff plan:", error);
    return NextResponse.json(
      { error: "Failed to create tariff plan" },
      { status: 500 },
    );
  }
}
