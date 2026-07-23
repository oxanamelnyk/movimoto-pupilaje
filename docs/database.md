## Database

The application uses MySQL with Drizzle ORM for type-safe database operations and migrations.

### Connection

The shared connection pool is defined in:

```
db/drizzle.ts
```

All queries must use the same pool instance exported from this file. Do not create additional pools inside API routes.

Configuration:

```typescript
import mysql from "mysql2/promise";

export const poolConnection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "movimoto_bk2503",
  waitForConnections: true,
  connectionLimit: 10,
});
```

### Drizzle instance

The Drizzle ORM instance is created in `db/drizzle.ts`:

```typescript
import { drizzle } from "drizzle-orm/mysql2";
import { poolConnection } from "./drizzle";

export const db = drizzle(poolConnection);
```

Export and usage:

```typescript
// db/index.ts
export { db } from "./drizzle";

// In API routes or queries
import { db } from "@/db";
const vehicles = await db.select().from(vehiclesTable);
```

### Rules

- **Do not create a pool inside an API handler** — always use the shared pool from `db/drizzle.ts`
- **Use parameterized queries** — prevent SQL injection
- **Do not log database credentials** — sensitive data should never appear in logs
- **Keep schema definitions in `db/schema/`** — organized by entity
- **Keep queries in `db/queries/`** — reusable SELECT operations
- **Keep mutations in `db/mutations/`** — reusable INSERT/UPDATE/DELETE operations
- **Use Zod schemas** — validate data before database operations via `drizzle-zod`

### Drizzle ORM usage

Query example using Drizzle:

```typescript
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

// SELECT with where clause
const vehicle = await db
  .select()
  .from(vehicles)
  .where(eq(vehicles.id, vehicleId))
  .limit(1);

// INSERT
const newVehicle = await db.insert(vehicles).values({
  vin: "ABC123",
  brand: "Honda",
});

// UPDATE
const updated = await db
  .update(vehicles)
  .set({ status: "stored" })
  .where(eq(vehicles.id, vehicleId));

// DELETE
await db.delete(vehicles).where(eq(vehicles.id, vehicleId));
```

### Raw SQL usage

For complex queries, raw SQL with the connection pool from `db/index.ts`:

```typescript
import { query, execute } from "@/db";

// Safe parameterized query
const [rows] = await query("SELECT * FROM vehicles WHERE id = ?", [id]);

// Execute for INSERT/UPDATE/DELETE
await execute("UPDATE vehicles SET status = ? WHERE id = ?", ["stored", id]);
```

**Never write:**

```typescript
const query = `SELECT * FROM vehicles WHERE id = ${id}`; // ❌ SQL injection!
```

### Schema organization

Schema files are located in `db/schema/` and organized by entity:

```
db/schema/
├── brands.ts              # Vehicle manufacturers
├── colors.ts              # Paint colors
├── clients.ts             # Customer information
├── locations.ts           # Storage facility locations
├── models.ts              # Vehicle models (Honda Civic, etc.)
├── pricing.ts             # Billing configuration
├── storage_locations.ts   # Individual storage units
├── tariff_plans.ts        # Pricing plans
├── tariff_services.ts     # Additional services
├── tipos_estado_vehiculo.ts # Vehicle status types
├── users.ts               # User accounts and authentication
├── vehicles.ts            # Vehicle registry
├── vehicle_preparation.ts # Maintenance/prep work records
├── vehicle_statuses.ts    # Current vehicle status tracking
├── vehicle_storage.ts     # Vehicle-to-storage assignment
├── vehicle_storage_records.ts # Entry/exit history
└── index.ts               # Re-exports all schemas
```

Each schema file defines tables with proper types and constraints.

### Database migrations

Migrations are stored in the `drizzle/` directory and managed by Drizzle Kit.

To create a new migration after schema changes:

```bash
npm run db:generate
```

To apply migrations:

```bash
npm run db:migrate
```

To view the database in the Drizzle Studio UI:

```bash
npm run db:studio
```

Drizzle configuration is defined in `drizzle.config.ts`:

```typescript
export default defineConfig({
  dialect: "mysql",
  schema: "./db/schema",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Schema changes workflow

When modifying the database:

1. **Update the Drizzle schema** — modify files in `db/schema/`
2. **Generate the migration** — run `npm run db:generate` with a descriptive name
3. **Test locally** — run `npm run db:migrate` and verify functionality
4. **Back up production data** — before deploying to production
5. **Apply migration** — before deploying dependent code that uses new columns/tables

### Query organization

**Queries** (SELECT operations) are in `db/queries/`:

- Organized by entity (e.g., `vehicles.ts`, `clients.ts`)
- Exported as named functions
- Take parameters for filtering and pagination

Example:

```typescript
// db/queries/vehicles.ts
import { db } from "@/db";
import { vehicles } from "@/db/schema";

export async function getVehicles(offset: number, limit: number) {
  return db.select().from(vehicles).offset(offset).limit(limit);
}

export async function getVehicleCount() {
  const result = await db.select({ count: count() }).from(vehicles);
  return result[0]?.count || 0;
}
```

**Mutations** (INSERT/UPDATE/DELETE operations) are in `db/mutations/`:

- Organized by entity
- Exported as named functions
- Accept validated data

Example:

```typescript
// db/mutations/vehicles.ts
import { db } from "@/db";
import { vehicles } from "@/db/schema";

export async function createVehicle(data: NewVehicle) {
  const [result] = await db.insert(vehicles).values(data);
  return result;
}
```

### Validation

Use Zod schemas with `drizzle-zod` to derive validators from the Drizzle schema:

```typescript
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { vehicles } from "@/db/schema";

// Insert validation (without auto-generated fields)
export const vehicleCreateSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
});

// Select validation (full schema)
export const vehicleSelectSchema = createSelectSchema(vehicles);
```

### Connection pooling

The connection pool is configured with:

- **connectionLimit: 10** — maximum concurrent connections
- **waitForConnections: true** — queue requests when limit reached

For most applications, 10 connections is sufficient. Increase only after monitoring and confirming the need.

### Transactions

For multi-step operations that must succeed or fail together:

```typescript
import { db } from "@/db";

await db.transaction(async (tx) => {
  await tx.insert(vehicles).values(vehicleData);
  await tx.insert(storageRecords).values(storageData);
  // Both succeed or both rollback
});
```

Transaction utilities are available in `db/transaction.ts`.

### Troubleshooting

**Connection pool exhaustion**

- Symptom: "too many active pools" error
- Cause: Multiple pool instances created in different modules
- Solution: Always import pool from `db/drizzle.ts`

**Connection timeouts**

- Symptom: Queries timeout or hang
- Cause: Database is unreachable, credentials are wrong, or IP restrictions block the connection
- Solution: Check `.env.local` has correct `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

**Missing environment variables**

- Symptom: "undefined" errors when accessing database
- Cause: Environment variables not set
- Solution: Verify `.env.local` exists and contains all required variables

**Idle connections closed**

- Symptom: "Connection lost" after prolonged inactivity
- Cause: Database provider closes idle connections (common with cloud databases)
- Solution: Enable connection keep-alive or increase wait timeout

**Database IP restrictions**

- Symptom: Connection refused when deploying to production
- Cause: Database allows connections only from specific IPs
- Solution: Add deployment platform's IP range to database firewall rules (e.g., Vercel IPs for Vercel deployments)

Check database provider logs and Vercel deployment logs for detailed error messages before making configuration changes.

### Performance

- **Indexes** — defined in schema for frequently queried columns
- **Pagination** — always use `offset` and `limit` for large result sets
- **Connection pooling** — reuse connections, do not create new pools per request
- **Query optimization** — use Drizzle's query builder for efficient SQL generation

Run `npm run db:studio` to view and analyze data for performance tuning.
