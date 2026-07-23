# Development Guidelines

## Database Connections

Always use the shared database instance exported from:

```ts
db/index.ts
```

Do not create additional MySQL connection pools inside:

* API routes
* React components
* Query files
* Mutation files
* Utility modules

Creating multiple pools can exhaust the database connection limit, especially in serverless environments.

## Database Operations

Place database read operations in:

```text
db/queries/
```

Place database create, update, and delete operations in:

```text
db/mutations/
```

Use Drizzle ORM by default.

Use raw SQL only when it provides a clear technical advantage.

## Input Validation

Validate all external input before using it in database operations.

External input includes:

* Request bodies
* URL parameters
* Query parameters
* Form data
* Imported files

Use Zod schemas from:

```text
validators/
```

Do not treat TypeScript types as runtime validation.

## Permissions

Always verify permissions on the server.

Client-side checks using `usePermission()` should only control the user interface.

Protected API routes must use server-side permission checks such as:

```ts
assertPermission();
```

Do not rely only on:

* Hidden buttons
* Disabled form controls
* Protected pages
* Client-side redirects
* Authentication errors

Unauthenticated requests should return HTTP status `401`:

```json
{
  "error": "Authentication required"
}
```

Permission-denied requests should return HTTP status `403`:

```json
{
  "error": "Permission denied"
}
```

## API Responses

Use consistent HTTP status codes:

| Status | Meaning                             |
| ------ | ----------------------------------- |
| `200`  | Successful request                  |
| `201`  | Resource created                    |
| `400`  | Invalid request or validation error |
| `401`  | Authentication required             |
| `403`  | Permission denied                   |
| `404`  | Resource not found                  |
| `409`  | Resource conflict                   |
| `500`  | Unexpected server error             |

Do not expose the following information in API responses:

* Database credentials
* SQL statements
* Internal stack traces
* Sensitive implementation details

## Pagination

Collection endpoints should use:

* `offset`
* `limit`

The maximum allowed limit is:

```ts
const MAX_LIMIT = 100;
```

Always validate and normalize pagination values.

```ts
const offset = Math.max(
  0,
  Number(searchParams.get("offset")) || 0
);

const requestedLimit =
  Number(searchParams.get("limit")) || 20;

const limit = Math.min(
  Math.max(1, requestedLimit),
  MAX_LIMIT
);
```

## React Query

Use TanStack React Query for server state.

After a successful mutation, invalidate the related queries.

```ts
queryClient.invalidateQueries({
  queryKey: ["vehicles"],
});
```

Use stable and descriptive query keys.

```ts
["vehicles"]
["vehicles", filters]
["vehicle", vehicleId]
["clients"]
["invoice", invoiceId]
```

## Client State

Use Zustand only for client-side state.

Do not duplicate API data in Zustand when it is already managed by React Query.

## Components

Organize components by feature.

```text
components/
├── vehicles/
├── clients/
├── invoices/
└── ui/
```

Keep each component focused on one responsibility.

Move reusable logic into:

* Hooks
* Utility functions
* Query modules
* Mutation modules
* Service modules

## Forms

Use a Zod schema as the source of truth for form validation.

Validation should happen:

* In the browser for immediate user feedback
* On the server for security and data integrity

Do not rely only on client-side validation.

## Error Handling

API routes should catch expected errors and return an appropriate HTTP status code.

Unexpected errors should be logged on the server.

```ts
try {
  // Route logic
} catch (error) {
  console.error("Failed to create vehicle:", error);

  return Response.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

Avoid empty `catch` blocks.

## Environment Variables

Do not commit secrets.

Never place sensitive values in environment variables prefixed with:

```text
NEXT_PUBLIC_
```

Only browser-safe values may use the `NEXT_PUBLIC_` prefix.

## Code Quality

Before merging changes, run:

```bash
npm run lint
npm run typecheck
npm test
```

Run Playwright tests when changing important user flows.