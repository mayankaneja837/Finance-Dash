# Finance Dash Backend Assignment for Zorvyn Fintech

Backend for a finance dashboard with user management, role-based access control, transaction management, dashboard analytics, pagination, search, rate limiting, and API documentation.

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma + PostgreSQL
- JWT + bcrypt
- Zod
- Swagger UI
- Vitest + Supertest

## Features

- User registration and login with JWT authentication
- Role-based permissions for `VIEWER`, `ANALYST`, and `ADMIN`
- Admin user management, including role assignment and active/inactive status
- Seed script for creating the first `ADMIN` user, after which most admin tasks can be handled easily through the API
- Transaction CRUD with soft delete
- Transaction filters by type, category, date range, and search
- Offset pagination for transaction listing
- Dashboard summary APIs for totals, category breakdowns, trends, and recent activity
- Structured validation and error responses
- Global and auth-specific rate limiting
- OpenAPI JSON and Swagger UI documentation

## Roles

| Role | Permissions |
|---|---|
| `VIEWER` | View transactions |
| `ANALYST` | Everything VIEWER can do, plus create/update transactions and access dashboard analytics |
| `ADMIN` | Everything ANALYST can do, plus delete transactions and creat/manage users |

## Setup

1. Install dependencies

```bash
npm install
```

2. Create environment variables

```bash
cp .env.example .env
```

3. Fill in the required values

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used for JWT signing |
| `PORT` | API port, defaults to `8080` |
| `TEST_DATABASE_URL` | Optional dedicated database URL for tests; if omitted, tests use `DATABASE_URL` with schema `finance_dash_test` |

4. Start the development server

```bash
npm run dev
```

The API runs on `http://localhost:8080`.

## Admin Bootstrap

The project includes a seed script to create the first admin user:

```bash
npm run seed
```

Once this initial `ADMIN` account is created, most admin tasks can then be performed easily through the API, such as creating users, assigning roles, updating account status, and deleting users.

## API Docs

- OpenAPI JSON: `GET /openapi.json`
- Swagger UI: `GET /docs`

## Main Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new `VIEWER` account |
| `POST` | `/auth/login` | Public | Login and receive a JWT |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/user` | `ADMIN` | Create a user with an explicit role |
| `GET` | `/user` | `ADMIN` | List all users |
| `GET` | `/user/:id` | `ADMIN` | Get a single user |
| `PATCH` | `/user/:id` | `ADMIN` | Update user role or active status |
| `DELETE` | `/user/:id` | `ADMIN` | Delete a user |

### Transactions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/transaction` | `VIEWER+` | List transactions with filters, search, and pagination |
| `GET` | `/transaction/:id` | `VIEWER+` | Get a single transaction |
| `POST` | `/transaction` | `ANALYST+` | Create a transaction |
| `PATCH` | `/transaction/:id` | `ANALYST+` | Update a transaction |
| `DELETE` | `/transaction/:id` | `ADMIN` | Soft delete a transaction |

Supported `GET /transaction` query params:

| Param | Type | Notes |
|---|---|---|
| `type` | `Income` or `Expense` | Optional |
| `category` | `string` | Optional exact category filter |
| `search` | `string` | Searches `category` and `notes` |
| `startDate` | ISO datetime string | Optional |
| `endDate` | ISO datetime string | Optional |
| `page` | `number` | Default `1` |
| `pageSize` | `number` | Default `20`, max `100` |

Paginated transaction responses include:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Dashboard

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/dashboard/summary` | `ANALYST+` | Total income, expenses, and net balance |
| `GET` | `/dashboard/categories` | `ANALYST+` | Category-wise totals |
| `GET` | `/dashboard/trends` | `ANALYST+` | Monthly income vs expense trends |
| `GET` | `/dashboard/recent` | `ANALYST+` | Recent transactions, default limit `5`, max `50` |

## Error Handling

Validation, permission, and not-found errors return JSON in this shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "email: Invalid email"
  ]
}
```

Unhandled server errors return:

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Rate Limiting

- Global limiter: `100` requests per `15` minutes per IP
- Auth limiter: `10` requests per `15` minutes per IP on `/auth/register` and `/auth/login`

## Testing

Run the full suite with:

```bash
npm test
```

This automatically prepares the isolated test schema before running Vitest.
