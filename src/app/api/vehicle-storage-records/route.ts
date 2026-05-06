import { NextRequest, NextResponse } from "next/server";
import { vehicleStorageRecordCreateSchema } from "@/validators/vehicle_storage_records";
import { getVehicleStorageRecords, createVehicleStorageRecord } from "@/db";

export async function GET() {
  try {
    const records = await getVehicleStorageRecords();
    return NextResponse.json(records);
  } catch (error) {
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
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create vehicle storage record" },
      { status: 500 },
    );
  }
}
