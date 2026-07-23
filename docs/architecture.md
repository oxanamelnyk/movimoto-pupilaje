## Architecture

This project is a Next.js application using the App Router for managing vehicle storage operations and invoicing.

### Main technologies

- Next.js 16 (with App Router)
- TypeScript
- React 19
- MySQL
- Drizzle ORM
- TanStack Router
- TanStack React Query
- TanStack React Form
- TanStack React Table
- shadcn/ui (Radix UI components)
- Tailwind CSS
- Zod (validation)

### Main application layers

```
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

- `app/` — pages, layouts and API routes (organized by entity)
- `components/` — reusable UI components (organized by feature)
- `db/` — database connection, schema and queries
- `lib/` — shared utilities (permissions, dates, exports, invoices)
- `hooks/` — custom React hooks
- `validators/` — Zod schemas for validation and type safety
- `public/` — static assets

### Database access

All database queries must use the shared database instance exported from:

```
db/index.ts
```

The Drizzle ORM instance is initialized in:

```
db/drizzle.ts
```

Connection pooling is configured with:

- Host: `DB_HOST` (default: localhost)
- User: `DB_USER` (default: root)
- Password: `DB_PASSWORD`
- Database: `DB_NAME` (default: movimoto_bk2503)
- Connection Limit: 10

Do not create additional MySQL pools inside API routes.

### Database schema organization

Schema files are organized in `db/schema/` by entity:

- `users.ts` — user accounts and authentication
- `vehicles.ts` — vehicle registry and details
- `clients.ts` — customer information
- `locations.ts` — storage locations
- `storage_locations.ts` — individual storage units
- `vehicle_storage.ts` — vehicle-to-storage assignment
- `vehicle_storage_records.ts` — entry/exit history
- `tariff_plans.ts` — pricing plans
- `tariff_services.ts` — additional services
- `pricing.ts` — billing configuration
- `vehicle_preparation.ts` — maintenance records
- `brands.ts` — vehicle brands/manufacturers
- `models.ts` — vehicle models
- `colors.ts` — vehicle colors
- And others for lookup tables

### Query and mutation patterns

- **Queries** — Located in `db/queries/`, use Drizzle ORM for SELECT operations
- **Mutations** — Located in `db/mutations/`, use Drizzle ORM for INSERT/UPDATE/DELETE operations
- **Validation** — Use Zod schemas from `validators/` to validate input before mutations

### API route organization

API routes are organized by entity in `app/api/`:

- `app/api/vehicles/` — vehicle management
- `app/api/clients/` — customer management
- `app/api/invoices/` — invoice generation and retrieval
- `app/api/tariff-plans/` — pricing plan management
- And other entity endpoints

Standard endpoints follow REST conventions:

- `GET /api/[entity]` — list with pagination (offset/limit)
- `POST /api/[entity]` — create
- `GET /api/[entity]/[id]` — fetch single
- `PUT /api/[entity]/[id]` — update
- `DELETE /api/[entity]/[id]` — delete

### Authentication and authorization

The application uses a **role-based access control (RBAC)** system:

- Permission checks are handled by `lib/permissions/` middleware
- Available roles and actions are defined in `validators/permissions.ts`
- Client-side checks use the `usePermission()` hook from `hooks/usePermission.ts`
- Server-side checks use `assertPermission()` from `lib/permissions/middleware.ts`

**Important**: Always verify permissions on the server. Client-side checks are for UI only.

Protected API routes must validate the current user's role before accessing data.

Unauthenticated requests should return:

```
{
  "error": "Authentication required"
}
```

with HTTP status `401`.

Permission-denied requests should return:

```
{
  "error": "Permission denied"
}
```

with HTTP status `403`.

### Form handling

Forms use:

- **TanStack Form** — form state management with `@tanstack/react-form`
- **React Hook Form** — alternative form library integration
- **Zod** — schema validation with `drizzle-zod` for ORM schema reuse
- **Shadcn UI** — pre-built form components

Form components are organized in `components/` by feature (e.g., `add-vehicle-form/`).

### Data fetching and caching

- **Client-side**: TanStack React Query for server state management
- **Pagination**: Implemented via query parameters (`offset` and `limit`)
- **List limits**: Enforced with `MAX_LIMIT = 100` to prevent connection pool exhaustion

### Client state management

- **Zustand** — lightweight state management for client-side state

### UI components

- **Radix UI** — unstyled accessible component library
- **shadcn/ui** — pre-built Radix UI components styled with Tailwind CSS
- **Lucide React** — icon library
- **TanStack React Table** — headless table library for data display

### Data export functionality

The `lib/export-utils.ts` module provides utilities for exporting data (CSV, Excel, etc.).

### Invoice system

The invoice system is fully integrated for vehicle storage billing:

- Located in `components/invoices/InvoiceGenerator.tsx`
- Utilities in `lib/invoice-utils.ts`
- Database schema in `db/schema/pricing.ts`
- Supports multiple billing modes (by period or by month)
- Generates PDF exports using jsPDF and html2canvas

### Error handling

- API routes catch errors and return appropriate HTTP status codes
- Database connection errors are logged and returned as 500 errors
- Validation errors return 400 with error details
- Permission errors return 403
- Not found errors return 404

### Configuration

- Environment variables are defined in `.env.local` (not committed)
- Next.js config in `next.config.ts`
- Drizzle config in `drizzle.config.ts`
- TypeScript config in `tsconfig.json`
- ESLint config in `eslint.config.mjs`
- Tailwind config in `postcss.config.mjs`

### Testing

- **Unit tests**: Jest configured in `jest.config.js`
- **E2E tests**: Playwright configured in `playwright.config.ts`
- Test files located in `__tests__/` directory

### Deployment

- **Vercel** is the recommended deployment platform
- Set environment variables in Vercel dashboard
- GitHub integration for automatic deployments
