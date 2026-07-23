import { NextRequest, NextResponse } from "next/server";
import { vehicleStorageRecordCreateSchema } from "@/validators/vehicle_storage_records";
import { getVehicleStorageRecords } from "@/db/queries";
import { createVehicleStorageRecord } from "@/db/mutations";

export async function GET() {
  try {
    const records = await getVehicleStorageRecords();
    return NextResponse.json(records);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch vehicle storage records" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = vehicleStorageRecordCreateSchema.parse(body);
    const record = await createVehicleStorageRecord(data);
    return NextResponse.json(record, { status: 201 });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: err.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create vehicle storage record" },
      { status: 500 },
    );
  }
}
