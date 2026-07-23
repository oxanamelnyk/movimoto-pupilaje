## Configuration

### Environment files

Local environment variables are stored in:

```text
.env.local
```

This file must not be committed.

Provide a safe example file when necessary:

```text
.env.example
```

The example file should contain variable names without real secrets.

### Database environment variables

The database connection uses:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=movimoto_bk2503
```

Available variables:

* `DB_HOST` — MySQL host
* `DB_USER` — MySQL username
* `DB_PASSWORD` — MySQL password
* `DB_NAME` — MySQL database name

The database connection limit is configured in the database module.

Current connection limit:

```text
10
```

### Application environment variables

Additional environment variables may be required for:

* Authentication
* Session encryption
* Public application URLs
* Email services
* External integrations
* Logging services

Document new variables in `.env.example`.

### Next.js configuration

Next.js configuration is located in:

```text
next.config.ts
```

Use this file for application-level Next.js settings such as:

* Image domains
* Redirects
* Rewrites
* Build settings
* Experimental options

### Drizzle configuration

Drizzle Kit configuration is located in:

```text
drizzle.config.ts
```

It defines:

* Schema paths
* Migration output directory
* Database dialect
* Database credentials

### TypeScript configuration

TypeScript configuration is located in:

```text
tsconfig.json
```

Use strict TypeScript settings where possible.

Avoid disabling type checking globally to fix local type errors.

### ESLint configuration

ESLint configuration is located in:

```text
eslint.config.mjs
```

It contains static analysis rules for JavaScript, TypeScript and React code.

### PostCSS configuration

PostCSS configuration is located in:

```text
postcss.config.mjs
```

This file configures PostCSS plugins used by the CSS build process.

It is not necessarily a dedicated Tailwind configuration file.

### Tailwind CSS

Tailwind CSS is integrated into the application styling pipeline.

Depending on the installed Tailwind version, the project may not require a separate:

```text
tailwind.config.js
```

or:

```text
tailwind.config.ts
```

Project styles should be defined in the global CSS files and component class names.

### Jest configuration

Jest configuration is located in:

```text
jest.config.js
```

### Playwright configuration

Playwright configuration is located in:

```text
playwright.config.ts
```

### Configuration rules

* Never commit production secrets
* Never expose server-only secrets to the browser
* Keep `.env.example` updated
* Validate required environment variables during application startup
* Use different credentials for development and production
* Do not hardcode database credentials in source files