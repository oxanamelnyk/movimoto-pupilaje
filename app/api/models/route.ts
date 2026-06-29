import { NextResponse } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, brand_id, name FROM models ORDER BY name"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json([], { status: 200 });
  }
}
