import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import type { RowDataPacket } from "mysql2";

import {
  createInvoicePdfDocument,
  type InvoicePdfData,
} from "@/components/invoices/InvoicePdfDocument";
import { query } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

interface InvoiceRow extends RowDataPacket {
  id: string;
  invoice_number: string;
  invoice_date: string;
  period_start: string;
  period_end: string;
  subtotal: string;
  tax_percentage: string;
  tax_amount: string;
  total: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const invoiceId = decodeURIComponent((await params).id);
    const invoices = await query<InvoiceRow[]>(
      `SELECT
        i.*,
        c.name AS client_name,
        c.email AS client_email,
        c.phone AS client_phone
      FROM invoices i
      INNER JOIN clients c ON c.id = i.client_id
      WHERE i.id = ?
      LIMIT 1`,
      [invoiceId],
    );
    const invoice = invoices[0];

    if (!invoice) {
      return Response.json({ error: "Invoice not found" }, { status: 404 });
    }

    const data: InvoicePdfData = {
      invoiceNumber: invoice.invoice_number,
      invoiceDate: new Date(invoice.invoice_date).toLocaleDateString("es-ES", {
        timeZone: "UTC",
      }),
      periodStart: new Date(invoice.period_start).toLocaleDateString("es-ES", {
        timeZone: "UTC",
      }),
      periodEnd: new Date(invoice.period_end).toLocaleDateString("es-ES", {
        timeZone: "UTC",
      }),
      clientName: invoice.client_name,
      clientEmail: invoice.client_email,
      clientPhone: invoice.client_phone,
      subtotal: Number(invoice.subtotal),
      taxPercentage: Number(invoice.tax_percentage),
      taxAmount: Number(invoice.tax_amount),
      total: Number(invoice.total),
      logoSrc: path.join(process.cwd(), "public", "mm.png"),
    };

    const buffer = await renderToBuffer(createInvoicePdfDocument(data));

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.invoice_number}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Invoice PDF generation error:", error);
    return Response.json(
      { error: "Failed to generate invoice PDF" },
      { status: 500 },
    );
  }
}
