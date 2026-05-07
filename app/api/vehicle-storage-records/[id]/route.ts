import { NextRequest, NextResponse } from "next/server";
import { vehicleStorageRecordUpdateSchema } from "@/validators/vehicle_storage_records";
import { getVehicleStorageRecordById } from "@/db/queries";
import { deleteVehicleStorageRecord, updateVehicleStorageRecord } from "@/db/mutations";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const record = await getVehicleStorageRecordById(id);
    if (!record) {
      return NextResponse.json(
        { error: "Vehicle storage record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch vehicle storage record" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const data = vehicleStorageRecordUpdateSchema.parse(body);
    const record = await updateVehicleStorageRecord(id, data);
    if (!record) {
      return NextResponse.json(
        { error: "Vehicle storage record not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(record);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update vehicle storage record" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    await deleteVehicleStorageRecord(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete vehicle storage record" },
      { status: 500 },
    );
  }
}
