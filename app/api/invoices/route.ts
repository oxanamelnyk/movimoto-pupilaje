import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import * as schema from "@/db/schema";

type InvoiceItemInput = {
  vehicle_id: number | string;
  registration_identity?: string | null;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  amount: number | string;
};

type InvoiceRequestBody = {
  client_id: number | string;
  invoice_number: string;
  invoice_date: string;
  period_type: string;
  period_start: string;
  period_end: string;
  subtotal: number | string;
  tax_percentage?: number | string;
  tax_amount: number | string;
  total: number | string;
  items?: InvoiceItemInput[];
  notes?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InvoiceRequestBody;

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
      items = [],
      notes,
    } = body;

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
        { status: 400 }
      );
    }

    const invoiceId = `INV-${Date.now()}`;

    await db.insert(schema.invoices).values({
      id: invoiceId,
      client_id: Number(client_id),
      invoice_number,
      invoice_date,
      period_type,
      period_start,
      period_end,
      subtotal: String(subtotal),
      tax_percentage: String(tax_percentage),
      tax_amount: String(tax_amount),
      total: String(total),
      notes: notes || null,
      status: "draft",
    });

    if (items.length > 0) {
      const itemsToInsert = items.map((item, index) => ({
        id: `${invoiceId}-${index}`,
        invoice_id: invoiceId,
        vehicle_id: Number(item.vehicle_id),
        registration_identity: item.registration_identity || null,
        description: item.description,
        quantity: String(item.quantity),
        unit_price: String(item.unit_price),
        amount: String(item.amount),
      }));

      await db.insert(schema.invoice_items).values(itemsToInsert);
    }

    return NextResponse.json(
      {
        message: "Invoice created successfully",
        invoiceId,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Invoice creation error:", error);

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const invoices = await db.select().from(schema.invoices);

    return NextResponse.json(
      {
        invoices,
        message: "Invoices fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Fetch invoices error:", error);

    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}