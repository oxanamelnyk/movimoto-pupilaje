import { NextResponse } from "next/server";
import { db } from "@/db";
import { storage_locations } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({ id: storage_locations.id, name: storage_locations.name })
      .from(storage_locations)
      .orderBy(storage_locations.name);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching storage locations:", error);
    return NextResponse.json([], { status: 200 });
  }
}
