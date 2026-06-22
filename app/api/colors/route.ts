import { NextResponse } from "next/server";
import { db } from "@/db";
import { colors } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({ id: colors.id, name: colors.name })
      .from(colors)
      .orderBy(colors.name);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching colors:", error);
    return NextResponse.json([], { status: 200 });
  }
}
