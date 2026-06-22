import { NextResponse } from "next/server";
import { db } from "@/db";
import { preparation_types } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({ id: preparation_types.id, name: preparation_types.name })
      .from(preparation_types)
      .orderBy(preparation_types.name);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching preparation types:", error);
    return NextResponse.json([], { status: 200 });
  }
}
