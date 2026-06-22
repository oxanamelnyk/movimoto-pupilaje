import { NextResponse } from "next/server";
import { db } from "@/db";
import { vehicle_statuses } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({ id: vehicle_statuses.id, name: vehicle_statuses.name })
      .from(vehicle_statuses)
      .orderBy(vehicle_statuses.name);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching vehicle statuses:", error);
    return NextResponse.json([], { status: 200 });
  }
}
