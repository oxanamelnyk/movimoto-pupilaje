import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand");

    let query = db.selectDistinct({ model: vehicles.model }).from(vehicles);

    if (brand) {
      query = query.where(eq(vehicles.brand, brand));
    }

    const models = await query.orderBy(vehicles.model).execute();

    const formatted = models
      .map((item) => ({
        value: item.model,
        label: item.model,
      }))
      .filter((item) => item.value); // Remove empty values

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json([], { status: 500 });
  }
}
