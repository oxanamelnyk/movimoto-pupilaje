import { NextResponse } from "next/server";
import { db } from "@/db";
import { brands } from "@/db/schema";

export async function GET() {
  try {
    const result = await db
      .select({ id: brands.id, name: brands.name })
      .from(brands)
      .orderBy(brands.name);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json([], { status: 200 });
  }
}
