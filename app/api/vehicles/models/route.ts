import { query } from "@/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand_id = searchParams.get("brand_id");

    let sql = "SELECT id as value, name as label FROM models";
    const params = [];

    if (brand_id) {
      sql += " WHERE brand_id = ?";
      params.push(parseInt(brand_id));
    }

    sql += " ORDER BY name";

    const models = await query(sql, params);

    return NextResponse.json(models);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json([], { status: 500 });
  }
}
