# Test Suite for Vehicle Form

This directory contains comprehensive tests for the vehicle form submission and API endpoint.

## Test Types

### 1. **API Tests** (`__tests__/api/vehicles.test.ts`)

Unit and integration tests for the `/api/vehicles` endpoint.

**What it tests:**

- ✅ Successful vehicle creation with all fields
- ✅ Successful vehicle creation with minimal required fields
- ✅ Validation errors for missing required fields
- ✅ Invalid data types (strings instead of numbers, etc.)
- ✅ Edge cases (long VINs, special characters, etc.)
- ✅ GET endpoint returns vehicle list

**Run API tests:**

```bash
npm run test
# or watch mode
npm run test:watch
```

### 2. **E2E Tests** (`__tests__/e2e/vehicle-form.spec.ts`)

Browser-based end-to-end tests using Playwright.

**What it tests:**

- ✅ Form displays all fields correctly
- ✅ Validation errors show when submitting empty form
- ✅ Form submits successfully with all required fields
- ✅ Dropdowns populate with data from database
- ✅ Placeholder text displays in empty selectors
- ✅ Date field pre-filled with current date
- ✅ Optional fields can be left empty
- ✅ Form closes after successful submission

**Run E2E tests:**

```bash
npm run test:e2e
# or with UI
npm run test:e2e:ui
```

### 3. **All Tests**

Run both API and E2E tests:

```bash
npm run test:all
```

## Test Data

### Valid Vehicle Data

```javascript
{
  client_id: 1,              // Required
  brand_id: 1,               // Required
  model_id: 1,               // Required
  color_id: 1,               // Optional
  status_id: 1,              // Required
  vin: "TEST123456789",      // Optional (max 50 chars)
  plate_number: "ABC-1234",  // Optional (max 50 chars)
  notes: "Test vehicle",     // Optional
  entry_date: "2026-06-28",  // Required
  location_id: 1,            // Required
  exit_date: null,           // Optional
  delivery_place: "Location", // Optional
  request_date: null,        // Optional
  requested_by: null,        // Optional
  preparation_date: null,    // Optional
  preparation_type_id: null  // Optional
}
```

### Required Fields for Validation

- `client_id` (must be > 0)
- `brand_id` (must be > 0)
- `model_id` (must be > 0)
- `status_id` (must be > 0)
- `entry_date` (must be valid date)
- `location_id` (must be > 0)

## Running Tests

### Prerequisites

1. **Start the development server** (in one terminal):
   ```bash
   npm run dev
   ```
2. **Wait for the server to be ready** - You should see:

   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   ```

3. **In another terminal, run the tests:**
   ```bash
   npm run test           # API tests (must have dev server running)
   npm run test:watch    # Watch mode
   npm run test -- --coverage  # With coverage report
   ```

### Run Tests

**API Tests Only:** (requires dev server running on http://localhost:3000)

```bash
npm run test
npm run test:watch       # Watch mode
npm run test -- --coverage  # With coverage report
```

**E2E Tests Only:**

```bash
npm run test:e2e
npm run test:e2e:ui      # Interactive UI
```

**All Tests:**

```bash
npm run test:all
```

## Test Reports

### Jest (API Tests)

- Results printed to console
- Coverage report in `coverage/` directory (if using `--coverage`)

### Playwright (E2E Tests)

- HTML report: Opens automatically or run `npx playwright show-report`
- Screenshots on failure in `test-results/`
- Traces for debugging in `test-results/traces/`

## CI/CD Integration

For continuous integration:

```bash
# Install Playwright browsers
npm run playwright:install

# Run all tests
npm run test:all

# Or specific tests
npm run test
npm run test:e2e
```

## Debugging

### Debug API Tests

```bash
node --inspect-brk node_modules/.bin/jest __tests__/api/vehicles.test.ts
```

### Debug E2E Tests

```bash
npx playwright test --debug
# or with headed browser
npx playwright test --headed
```

## Common Issues

### Tests Can't Connect to API

- Ensure `npm run dev` is running
- Check that `baseURL` in `playwright.config.ts` is correct
- Verify the server is on `http://localhost:3000`

### Database Issues

- Run seed script: `npx tsx seed.ts`
- Verify database connection: `npx tsx verify-db.ts`
- Check that all required IDs exist in database

### Playwright Tests Not Finding Elements

- Run with `--headed` to see what's happening
- Use `--debug` for step-by-step execution
- Check element selectors match your HTML structure

## Tips

1. **Run tests in parallel** for speed:

   ```bash
   npm run test:e2e -- --workers=4
   ```

2. **Run specific test**:

   ```bash
   npm run test -- --testNamePattern="should create a vehicle"
   npm run test:e2e -- --grep="successfully submit"
   ```

3. **Update snapshots** (if using):

   ```bash
   npm run test -- -u
   ```

4. **Generate coverage** (API tests):
   ```bash
   npm run test -- --coverage
   ```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [React Testing Library](https://testing-library.com/react)
