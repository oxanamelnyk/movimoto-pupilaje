## Testing

The project uses Jest for unit and integration tests and Playwright for end-to-end tests.

### Test directory

Test files are located in:

```text
__tests__/
```

Tests may also be placed next to the file being tested when appropriate.

Examples:

```text
vehicle-utils.test.ts
permissions.test.ts
invoice-calculation.test.ts
```

### Unit tests

Unit tests use Jest.

Unit tests should cover isolated logic such as:

* Validation schemas
* Permission logic
* Invoice calculations
* Date utilities
* Export utilities
* Data transformations

Run unit tests with:

```bash
npm test
```

Use watch mode during development:

```bash
npm test -- --watch
```

### Integration tests

Integration tests should verify interactions between multiple modules.

Examples:

* API route and validation schema
* Database query and mutation behavior
* Permission middleware and API routes
* Invoice generation and pricing rules

Integration tests must use a dedicated test database when they access MySQL.

Do not run database tests against the production database.

### End-to-end tests

End-to-end tests use Playwright.

E2E tests should cover important user workflows such as:

* User login
* Creating a vehicle
* Updating a client
* Assigning vehicle storage
* Generating an invoice
* Permission-restricted actions

Run Playwright tests with:

```bash
npx playwright test
```

Run Playwright with the visual interface:

```bash
npx playwright test --ui
```

Open the test report with:

```bash
npx playwright show-report
```

### Test data

Tests should create their own predictable data.

Avoid depending on existing development or production records.

Clean up created test data when necessary.

### Mocking

Mock external dependencies when the real service is not required.

Examples:

* Email providers
* File storage services
* External APIs
* Browser-only APIs

Avoid mocking the main logic being tested.

### Permission testing

Protected endpoints should include tests for:

* Authenticated and authorized users
* Authenticated users without permission
* Unauthenticated users

Expected responses:

```text
401 — Authentication required
403 — Permission denied
```

### Validation testing

Validation tests should cover:

* Valid input
* Missing required fields
* Invalid field types
* Invalid identifiers
* Boundary values
* Maximum lengths
* Pagination limits

### Before merging

Run:

```bash
npm run lint
npm run typecheck
npm test
npx playwright test
```

Playwright may be skipped for changes that cannot affect user flows, but important features should always include E2E coverage.