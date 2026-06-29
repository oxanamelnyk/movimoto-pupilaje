import { NextResponse } from "next/server";
import { query } from "@/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, name FROM preparation_types ORDER BY name"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching preparation types:", error);
    return NextResponse.json([], { status: 200 });
  }
}
