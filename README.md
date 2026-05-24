<div align="center">

  <h1>FlowTasks API</h1>

  <p align="center">
    A RESTful task management API with JWT authentication, drag-and-drop reordering, and auto-generated OpenAPI documentation - built with Node.js, Express, TypeScript, PostgreSQL, and Drizzle ORM.
    <br /><br />
    <a href="#api-documentation"><strong>API Docs (Swagger)</strong></a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="#running-locally">Run Locally</a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="https://github.com/alberto-rj/flowtasks/issues">Report a Bug</a>
  </p>

  <br />

  <img src="https://img.shields.io/badge/Status-In_Development-f0a500?style=for-the-badge" alt="In Development">
  &nbsp;
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  &nbsp;
  <img src="https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">

</div>

<br />

## About the Project

FlowTasks is a backend API for a todo application with per-user task isolation, flexible filtering, and atomic drag-and-drop reordering. The focus of this build was on **architecture before features**: strict separation between HTTP, use-case, and data layers; a single source of truth for validation and API documentation using Zod + `zod-to-openapi`; and a test suite that runs entirely against in-memory repositories so tests are fast, parallel, and stateless.

<br />

## Architecture

```
src/
├── config/          # Environment variables and Zod OpenAPI registry setup
├── controllers/     # HTTP layer - parse input, call use cases, return responses
├── drizzle/         # Schema definitions and seed scripts
├── dtos/            # Data Transfer Objects - shapes returned to the client
├── entities/        # Domain entities - internal data shapes
├── middlewares/     # Auth (JWT), error handler, 404 handler
├── openapi/         # Per-endpoint OpenAPI path definitions (zod-to-openapi)
├── repositories/
│   ├── global/      # Repository interfaces (contracts)
│   ├── in-memory/   # In-memory implementation - used in tests
│   └── pg/          # PostgreSQL implementation via Drizzle ORM
├── routes/          # Route definitions + co-located integration tests (Supertest)
├── schemas/         # Zod validation schemas shared across layers
├── use-cases/       # Business logic - pure TypeScript, no Express or DB dependency
└── utils/           # JWT, bcrypt, error classes, response helpers
```

**The layered architecture means:**
- Controllers know nothing about the database - they call use cases with plain objects
- Use cases know nothing about Express - they depend on repository interfaces, not implementations
- Repositories are swappable via dependency injection - tests use in-memory, production uses PostgreSQL via Drizzle
- Zod schemas are registered once and generate both runtime validation and OpenAPI spec automatically

<br />

## Key Technical Decisions

- **TypeScript end-to-end** - Using TypeScript across the entire codebase caught several bugs during development that would have been silent runtime errors in plain JS - particularly around the shape of Drizzle query results and the JWT payload. The build step (`tsc` + `tsc-alias`) also means path aliases (`@/use-cases/...`) work cleanly in both dev and production.

- **`zod-to-openapi` for documentation** - Rather than maintaining a separate OpenAPI YAML file or scattering `@swagger` JSDoc comments across controllers, every request/response schema is defined as a Zod schema registered with `@asteasolutions/zod-to-openapi`. The OpenAPI spec and Swagger UI are generated from those same schemas at startup. This means validation and documentation can never drift apart - changing a Zod schema updates both simultaneously.

- **Drizzle over Prisma** - Drizzle stays close to SQL, which was important for two specific operations: the atomic bulk `UPDATE` for reordering (updating multiple rows' `order` field in a single transaction) and filtered queries with dynamic `WHERE` clauses for the `all`/`active`/`completed` filter. Prisma would have required raw SQL for the reorder case; Drizzle's query builder handled it natively.

- **In-memory repositories for tests** - The test suite uses an in-memory implementation of each repository interface rather than a real PostgreSQL instance. Tests run in milliseconds, are fully isolated (no shared state between files), and require no Docker in the test environment. The tradeoff - in-memory tests won't catch DB-specific issues like constraint violations - is accepted, with a smaller set of integration tests covering those cases separately.

- **HTTP-only cookies for JWT** - Storing the auth token in an HTTP-only cookie rather than `localStorage` protects against XSS. Combined with `sameSite: strict` and the `secure` flag in production, this is a meaningfully more secure auth flow than the typical "store token in localStorage and send in Authorization header" pattern. The tradeoff is slightly more complex logout handling (server-side cookie clearing), which is worth it.

- **Co-located tests** - Integration tests live alongside their route files (`auth.login.route.spec.ts` next to `auth.login.route.ts`), and unit tests live alongside their use cases. This makes it immediately clear which tests cover which code, and avoids a separate `__tests__/` folder that drifts out of sync with the source.

<br />

## API Documentation

Full interactive documentation is available via Swagger UI once the app is running:

```
http://localhost:4224/api-docs
```

<br />

## Running Locally

**Prerequisites:** Docker, Make

The project uses Docker Compose override files for each environment - `dev`, `test`, and `prod` - managed through a Makefile.

```bash
git clone https://github.com/alberto-rj/flowtasks.git
cd flowtasks
cp docker-compose.example.yml docker-compose.yml
cp .env.example .env
```

Fill in `.env` (see [Environment Variables](#environment-variables) below), then:

```bash
# Start the API + PostgreSQL in development mode (with hot reload)
make dev-up

# Run database migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

The API will be available at `http://localhost:4224` and Swagger UI at `http://localhost:4224/api-docs`.

### Available Make Commands

| Command | Description |
|---------|-------------|
| `make dev-up` | Start API + DB containers for development |
| `make dev-down` | Stop development containers |
| `make test-up` | Start containers for the test environment |
| `make test-down` | Stop test containers |
| `make prod-up` | Start containers for production |
| `make prod-down` | Stop production containers |
| `make api-shell` | Open a shell inside the API container |
| `make db-shell` | Open a shell inside the database container |

### Environment Variables

```bash
# .env.example

# Server
NODE_ENV=development
PORT=4224
SERVER_URL=http://localhost:4224

# Database
DATABASE_URL=postgresql://user_example:password_example@localhost:5432/db_example
POSTGRES_USER=user_example
POSTGRES_PASSWORD=password_example

# JWT
JWT_ACCESS_SECRET=your-super-secret-jwt-key-change-this
JWT_ACCESS_EXPIRES_IN_DAYS=7

# Frontend URL
FRONTEND_URL=https://flowtasks.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

<br />

## Running Tests

Tests use Vitest and Supertest. Unit tests (use cases) and integration tests (routes) run against in-memory repositories - no database or Docker required.

```bash
# Run all tests
npm test

# Run with coverage report (target: >70%)
npm run test:coverage

# Run only unit tests (use cases)
npm run test:unit

# Run only integration tests (endpoints)
npm run test:integration

# Watch mode
npm run test:watch
```

<br />

## What I'd Do Differently

- **Add rate limiting from day one.** I planned it as a "nice to have" and it should be a default on any auth endpoint. Retrofitting `express-rate-limit` into existing middleware is more work than including it at the start - and it's the kind of omission that looks careless in a security review.

- **Standardize on `zod-to-openapi` from the first schema.** Some early Zod schemas were written without registering them with the OpenAPI registry. Going back to retroactively register them (and ensure the generated spec matched the actual behavior) was tedious. The discipline of "every Zod schema gets registered" should be established before writing the first endpoint.

- **Write the repository interface before the implementation.** On a few use cases I wrote the Drizzle implementation first and extracted the interface afterwards. Writing the interface first - treating it as a contract that both the in-memory and Drizzle implementations must satisfy - would have caught shape mismatches earlier and kept the in-memory layer more accurate.

<br />

## Roadmap

- [ ] Deploy to Railway
- [ ] Rate limiting - auth: 5 req/15 min, API: 100 req/15 min
- [ ] Helmet.js + CORS hardening for production
- [ ] GitHub Actions CI (lint → test → build on every PR)
- [ ] Structured JSON logging
- [ ] Atomic transactions for reorder and clear-completed operations
- [ ] Sentry integration for error tracking

<br />

## Technologies

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Swagger](https://img.shields.io/badge/OpenAPI_/_Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

<br />

## Author

- LinkedIn - [Alberto José](https://www.linkedin.com/in/alberto-rj)
- GitHub - [@alberto-rj](https://github.com/alberto-rj)
- Frontend Mentor - [@alberto-rj](https://www.frontendmentor.io/profile/alberto-rj)
- Twitter - [@albertorauljose](https://twitter.com/albertorauljose)
