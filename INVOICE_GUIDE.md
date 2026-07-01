# Invoice System - Quick Start Guide

## How It Works

### 1. **Select Vehicles**

- In the Almacenamiento de Motos table, check the boxes next to vehicles you want to invoice
- The "Facturar" button appears with count: `Facturar (3)`

### 2. **Open Invoice Generator**

- Click the "Facturar" button
- Modal opens with configuration options

### 3. **Configure Billing**

#### Billing Mode

- **Por Período**: Single total cost for entire storage period
- **Por Mes**: Monthly breakdown showing charges per month

#### Optional Services

- ☐ Incluir Desembalaje (Add disassembly charge)
  - Con Montaje de Rueda (€24.00 vs €17.00 without)
- ☐ Incluir Gestión de Residuos (€2.50)

### 4. **Review Preview**

- Live calculation shows:
  - Each vehicle with brand/model
  - Line items with quantities and prices
  - Period or monthly breakdown
  - Subtotals and running totals
  - **Total with 21% VAT**

### 5. **Export Invoice**

- **Imprimir**: Open browser print dialog
- **Descargar PDF**: Save as PDF (requires setup)
- **Generar Factura**: Save to database (requires API implementation)

---

## Pricing Calculation Examples

### Example 1: Single Vehicle, 30 Days

| Item            | Days/Qty | Unit Price | Amount     |
| --------------- | -------- | ---------- | ---------- |
| Storage         | 30       | €0.34      | €10.20     |
| Handling In/Out | 1        | €3.00      | €3.00      |
| **Subtotal**    |          |            | **€13.20** |
| VAT (21%)       |          |            | €2.77      |
| **Total**       |          |            | **€15.97** |

### Example 2: Two Vehicles, Monthly Mode

**May**: 31 days

- Vehicle 1: €10.54 + €3.00 = €13.54
- Vehicle 2: €10.54 + €0.00 = €10.54
- May Subtotal: €24.08

**June**: 15 days (partial month)

- Vehicle 1: €5.10
- Vehicle 2: €5.10
- June Subtotal: €10.20

Total Before Tax: €34.28
Tax (21%): €7.20
**Total: €41.48**

---

## Database Integration (Next Steps)

### Current Status

- Pricing is **hardcoded** in `app/page.tsx`
- Invoice is previewed but **not saved to DB**

### To Enable Database Storage

1. Uncomment code in `app/api/invoices/route.ts` (lines marked TODO)
2. Run pricing table migration:
   ```bash
   npx ts-node migrate-pricing.ts
   ```
3. Update InvoiceGenerator component to call save API:
   ```tsx
   const handleSaveInvoice = async () => {
     const invoiceData = {
       /* ... */
     };
     const response = await fetch("/api/invoices", {
       method: "POST",
       body: JSON.stringify(invoiceData),
     });
   };
   ```

---

## File Structure

```
components/invoices/
├── InvoiceGenerator.tsx          # Main modal component

lib/
├── invoice-utils.ts              # Calculation logic

db/schema/
├── pricing.ts                    # DB tables: pricing_tiers, invoices, invoice_items

app/api/
├── invoices/
│   └── route.ts                 # Invoice API endpoints

app/
└── page.tsx                      # Main page with "Facturar" button
```

---

## Features Implemented ✅

- [x] Two billing modes (period vs monthly)
- [x] Flexible add-on selection
- [x] Real-time calculation preview
- [x] VAT (IVA) automatic calculation at 21%
- [x] Per-vehicle and line-item breakdown
- [x] Print support
- [x] Database schema (ready to use)
- [x] API skeleton

## Features To-Do

- [ ] PDF export (jsPDF or pdfkit)
- [ ] Save invoices to database
- [ ] Invoice numbering sequence
- [ ] Invoice status tracking (draft → issued → paid)
- [ ] Pricing management UI
- [ ] Invoice list/history page
- [ ] Email delivery
- [ ] Payment tracking
