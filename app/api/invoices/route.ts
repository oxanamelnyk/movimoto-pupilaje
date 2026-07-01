import { NextRequest, NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const db = drizzle(process.env.DATABASE_URL!, { schema });
    const body = await request.json();

    const {
      client_id,
      invoice_number,
      invoice_date,
      period_type,
      period_start,
      period_end,
      subtotal,
      tax_percentage = 21,
      tax_amount,
      total,
      items,
      notes,
    } = body;

    // Validate required fields
    if (
      !client_id ||
      !invoice_number ||
      !invoice_date ||
      !period_type ||
      !period_start ||
      !period_end
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // TODO: Generate unique invoice ID
    // const invoiceId = `INV-${Date.now()}`;

    // TODO: Insert invoice into database
    // const result = await db.insert(schema.invoices).values({
    //   id: invoiceId,
    //   client_id,
    //   invoice_number,
    //   invoice_date,
    //   period_type,
    //   period_start,
    //   period_end,
    //   subtotal: String(subtotal),
    //   tax_percentage: String(tax_percentage),
    //   tax_amount: String(tax_amount),
    //   total: String(total),
    //   notes,
    //   status: "draft",
    // });

    return NextResponse.json(
      {
        message: "Invoice created successfully",
        // invoiceId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Invoice creation error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = drizzle(process.env.DATABASE_URL!, { schema });

    // TODO: Fetch invoices from database
    // const invoices = await db.select().from(schema.invoices);

    return NextResponse.json(
      {
        invoices: [],
        message: "Invoices fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch invoices error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}
