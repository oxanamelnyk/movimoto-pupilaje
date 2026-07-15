import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { tariffServiceCreateSchema } from "@/validators/tariff_services";
import { getTariffServices, getTariffServicesByTariffId } from "@/db/queries";
import { createTariffService } from "@/db/mutations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tariffId = searchParams.get("tariffId");

    if (tariffId) {
      const services = await getTariffServicesByTariffId(Number(tariffId));
      return NextResponse.json(services);
    }

    const services = await getTariffServices();
    return NextResponse.json(services);
  } catch (error: unknown) {
    console.error("Failed to fetch tariff services:", error);
    return NextResponse.json(
      { error: "Failed to fetch tariff services" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = tariffServiceCreateSchema.parse(body);
    const service = await createTariffService(data);

    if (!service) {
      return NextResponse.json(
        { error: "Failed to create tariff service" },
        { status: 500 },
      );
    }

    return NextResponse.json(service, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Failed to create tariff service:", error);
    return NextResponse.json(
      { error: "Failed to create tariff service" },
      { status: 500 },
    );
  }
}
