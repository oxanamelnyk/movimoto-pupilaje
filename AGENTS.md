<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Agent Rules

## Project

This is a SaaS-style invoice application.

The app works with an existing MySQL / MariaDB database already used by the company.

## Stack

* Next.js 16 App Router
* React 19
* TypeScript
* Tailwind CSS 4
* shadcn/ui
* Drizzle ORM
* MySQL / MariaDB
* Zod
* TanStack Query
* TanStack Table
* TanStack Form
* Zustand
* Playwright for PDF generation

## Main Rules

* Read Next.js local docs before changing Next-specific code.
* Use TypeScript everywhere.
* Prefer simple, readable code.
* Do not over-engineer.
* Do not introduce new libraries without a strong reason.
* Keep business logic separated from UI.
* Keep database logic outside UI components.
* Prefer named exports.
* Prefer small, focused files.
* Do not create very large components.

## Next.js Rules

* Use Next.js routing only.
* Do not add React Router.
* Do not add TanStack Router.
* Use the App Router conventions from the installed Next.js version.
* Before writing Next.js-specific code, check `node_modules/next/dist/docs/`.
* Heed deprecation notices from the installed Next.js version.

## State Management

Use TanStack Query for server data:

* invoices
* clients
* products
* taxes
* payments
* user/company settings from the database

Use Zustand only for local UI state:

* sidebar open / closed
* modal state
* selected table rows
* temporary UI filters
* draft panel state
* active tabs

Do not store fetched database data in Zustand.

Do not use Zustand as a replacement for TanStack Query.

## Database

The app uses an existing MySQL / MariaDB database.

Rules:

* Do not assume the database can be freely redesigned.
* Be careful with existing table names and column names.
* Prefer explicit Drizzle schemas.
* Use Drizzle ORM for database access.
* Keep DB queries in `src/db/queries`.
* Keep DB mutations in `src/db/mutations`.
* Keep DB schema files in `src/db/schema`.
* Do not write raw SQL unless necessary.
* Do not put database access inside React UI components.

Preferred structure:

```txt
src/db/
  schema/
  queries/
  mutations/
```

## Validation

Use Zod for validation.

Put validation schemas in:

```txt
src/validators/
```

Use Zod for:

* form validation
* server action validation
* API input validation
* invoice data validation
* client data validation
* product data validation
* payment data validation

Example:

```ts
import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
});
```

## Forms

Use TanStack Form for complex forms.

Use it especially for:

* invoices
* clients
* products
* taxes
* payments
* company settings

Do not use uncontrolled complex forms for invoice creation.

Keep form logic clear and typed.

Prefer Zod schemas for validation.

## Tables

Use TanStack Table for data tables.

Use it for:

* invoices table
* clients table
* products table
* payments table
* taxes table

Style tables with shadcn/ui.

Do not add AG Grid unless explicitly requested.

Tables should support only the features needed by the current screen. Do not add unnecessary complexity.

## PDFs

Generate invoice PDFs on the server with Playwright.

Preferred flow:

```txt
invoice data -> HTML template -> Playwright -> PDF
```

Keep PDF logic in:

```txt
src/lib/pdf/
```

Rules:

* Do not put PDF generation logic inside random UI components.
* Do not use React PDF unless there is a specific reason.
* Keep invoice PDF templates isolated.
* Use normal HTML/CSS for invoice layout where possible.
* PDF generation should be server-side.

## UI

Use:

* Tailwind CSS
* shadcn/ui components
* accessible forms
* responsive layouts
* clean spacing
* clear loading states
* clear empty states
* clear error states

Avoid heavy custom CSS unless needed.

## Components

Preferred component naming:

```txt
InvoiceTable
InvoiceForm
CreateInvoiceButton
ClientSelect
ProductLineItem
PaymentStatusBadge
```

Avoid vague names:

```txt
DataComponent
MainForm
ThingCard
Wrapper
```

## Suggested Structure

```txt
src/
  app/
  components/
    ui/
    shared/
    invoices/
    clients/
    products/
  db/
    schema/
    queries/
    mutations/
  hooks/
  lib/
    pdf/
  stores/
  types/
  validators/
```

## Do Not Add

Do not add these unless explicitly requested:

* Redux
* React Router
* TanStack Router
* AG Grid
* React PDF
* large state management libraries
* unnecessary UI libraries

## Package Scripts

Recommended scripts in `package.json`:

```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "playwright:install": "playwright install chromium"
}
```
