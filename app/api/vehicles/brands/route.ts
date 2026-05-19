import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const brands = await db
      .selectDistinct({ brand: vehicles.brand })
      .from(vehicles)
      .orderBy(vehicles.brand)
      .execute();

    const formatted = brands
      .map((item) => ({
        value: item.brand,
        label: item.brand,
      }))
      .filter((item) => item.value); // Remove empty values

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json([], { status: 500 });
  }
}
