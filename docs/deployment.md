## Deployment

The application is deployed on Vercel.

### Requirements

Before deployment, verify that:

* The application builds locally
* TypeScript checks pass
* ESLint checks pass
* Tests pass
* Production environment variables are configured
* The production database is accessible
* Database migrations are applied

### Local production build

Run:

```bash
npm run build
```

Start the production build locally with:

```bash
npm run start
```

### Vercel project

Connect the GitHub repository to Vercel.

Vercel automatically creates deployments for:

* Production branch changes
* Pull requests
* Other configured branches

Pull requests normally receive preview deployments.

### Environment variables

Add production environment variables in the Vercel project settings.

Required database variables include:

```text
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
```

Additional variables may be required for authentication and external services.

Do not commit production environment values to Git.

### Environments

Vercel supports separate environment values for:

* Production
* Preview
* Development

Production and preview deployments should not share sensitive credentials unless intentionally configured.

### Database connection pooling

The application must use the shared MySQL pool from:

```text
db/index.ts
```

Do not create a new connection pool for each API route.

The configured connection limit is:

```text
10
```

Because Vercel uses serverless functions, database connections must be managed carefully.

Collection endpoints should enforce:

```ts
const MAX_LIMIT = 100;
```

This reduces oversized queries and unnecessary database usage.

### Database migrations

Apply required database migrations before using new application code that depends on schema changes.

Migration configuration is defined in:

```text
drizzle.config.ts
```

Do not modify the production database manually unless necessary and documented.

### Automatic deployments

Recommended Git workflow:

```text
Feature branch
      ↓
Pull request
      ↓
Vercel preview deployment
      ↓
Review and testing
      ↓
Merge into production branch
      ↓
Production deployment
```

### Deployment verification

After a production deployment, verify:

* Login works
* Protected routes reject unauthenticated users
* Main lists load correctly
* Database queries succeed
* Create and update operations work
* Invoice generation works
* PDF export works
* No secrets appear in browser responses
* Server logs contain no repeated database connection errors

### Rollback

When a deployment causes a critical issue:

1. Open the Vercel deployment history
2. Locate the last stable deployment
3. Promote or redeploy the stable version
4. Investigate the failed deployment separately

Database changes may require a separate rollback strategy.

### Production security

* Use strong production secrets
* Rotate credentials when exposed
* Do not expose stack traces to users
* Keep dependencies updated
* Protect all sensitive API routes on the server
* Add `noindex` headers when the application must not appear in search engines
* Review Vercel logs after significant deployments