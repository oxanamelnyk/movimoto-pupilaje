import { query } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const brands = await query(
      "SELECT id as value, name as label FROM brands ORDER BY name",
    );

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json([], { status: 500 });
  }
}
