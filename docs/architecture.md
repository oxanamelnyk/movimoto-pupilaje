# `docs/architecture.md`

## Architecture

This project is a Next.js application using the App Router for managing vehicle storage operations and invoicing.

### Main technologies

* Next.js 16 with App Router
* TypeScript
* React 19
* MySQL
* Drizzle ORM
* TanStack React Query
* TanStack React Form
* TanStack React Table
* Zustand
* shadcn/ui
* Radix UI
* Tailwind CSS
* Zod

### Application layers

```text
Browser
   ↓
Next.js pages and components
   ↓
API routes
   ↓
Service and validation logic
   ↓
Drizzle ORM / raw SQL
   ↓
MySQL
```

### Important directories

* `app/` — pages, layouts and API routes organized by entity
* `components/` — reusable UI components organized by feature
* `db/` — database connection, schemas, queries and mutations
* `lib/` — shared utilities and application services
* `hooks/` — custom React hooks
* `validators/` — Zod schemas for validation and type safety
* `public/` — static assets
* `__tests__/` — automated tests

### Database architecture

The application uses one shared MySQL connection pool.

The shared database instance is exported from:

```text
db/index.ts
```

The Drizzle ORM instance and database pool are initialized in:

```text
db/drizzle.ts
```

Both Drizzle queries and raw SQL queries must use this shared database connection.

### Database schema organization

Database schema files are organized by entity in `db/schema/`.

Important schema files include:

* `users.ts` — user accounts and authentication
* `vehicles.ts` — vehicle registry and details
* `clients.ts` — customer information
* `locations.ts` — storage locations
* `storage_locations.ts` — individual storage units
* `vehicle_storage.ts` — vehicle-to-storage assignments
* `vehicle_storage_records.ts` — vehicle entry and exit history
* `tariff_plans.ts` — pricing plans
* `tariff_services.ts` — additional services
* `pricing.ts` — billing configuration
* `vehicle_preparation.ts` — preparation and maintenance records
* `brands.ts` — vehicle manufacturers
* `models.ts` — vehicle models
* `colors.ts` — vehicle colors

Additional schema files contain lookup tables and supporting entities.

### Query and mutation organization

Database operations are separated by purpose:

```text
db/
├── queries/
├── mutations/
└── schema/
```

* `db/queries/` contains read operations
* `db/mutations/` contains create, update and delete operations
* `db/schema/` contains Drizzle table definitions and relationships

Drizzle ORM is the default database access method.

Raw SQL may be used when a query cannot be implemented clearly or efficiently with Drizzle.

### API architecture

API routes are located in `app/api/` and organized by entity.

Examples:

```text
app/api/
├── vehicles/
├── clients/
├── invoices/
└── tariff-plans/
```

Standard endpoints follow REST-style conventions:

```text
GET    /api/[entity]
POST   /api/[entity]
GET    /api/[entity]/[id]
PUT    /api/[entity]/[id]
DELETE /api/[entity]/[id]
```

Collection endpoints support pagination through `offset` and `limit` query parameters.

### Authentication and authorization

The application uses role-based access control.

Permission-related files include:

* `lib/permissions/` — permission utilities and middleware
* `validators/permissions.ts` — roles, resources and available actions
* `hooks/usePermission.ts` — client-side permission checks
* `lib/permissions/middleware.ts` — server-side permission checks

Client-side permission checks control what the user sees in the interface.

Server-side permission checks protect API routes and database operations.

### Form architecture

Forms use:

* TanStack React Form for form state
* Zod for input validation
* `drizzle-zod` for generating schemas from Drizzle tables
* shadcn/ui components for form controls

Form components are grouped by feature inside `components/`.

Example:

```text
components/
└── add-vehicle-form/
```

### Data fetching and caching

TanStack React Query manages client-side server state.

It is responsible for:

* Fetching API data
* Caching responses
* Loading and error states
* Refetching stale data
* Invalidating queries after mutations

Pagination is implemented using `offset` and `limit`.

### Client state

Zustand is used for client-side state that does not belong to server data.

Examples include:

* Temporary interface state
* Shared filters
* Modal state
* Local user selections

Server data should normally remain in TanStack React Query.

### UI architecture

The interface uses:

* Tailwind CSS for styling
* Radix UI for accessible primitives
* shadcn/ui for reusable components
* Lucide React for icons
* TanStack React Table for data tables

Feature-specific components belong in their corresponding feature directories.

Generic reusable components belong in shared UI directories.

### Invoice architecture

The invoice system handles vehicle storage billing.

Important files include:

* `components/invoices/InvoiceGenerator.tsx`
* `lib/invoice-utils.ts`
* `db/schema/pricing.ts`

The invoice system supports:

* Period-based billing
* Monthly billing
* Additional services
* PDF generation
* Export with jsPDF and html2canvas