import { NextResponse } from "next/server";
import { db } from "@/db";
import { models } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({ id: models.id, brand_id: models.brand_id, name: models.name })
      .from(models)
      .orderBy(models.name);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json([], { status: 200 });
  }
}
