# Zigxo Backend

Multi-tenant REST API built with TypeScript, Node.js, Express, and PostgreSQL. Each tenant represents a bot that can register devices (phone numbers) and upload files.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Database | PostgreSQL |
| DB Driver | pg (raw queries, no ORM) |
| File Upload | Multer |
| Logging | Custom logger (timestamped) |
| Dev Server | ts-node-dev |

---

## Folder Structure

```
zigxo-task/
├── migrations/                      # SQL migration files (run in order)
│   ├── 001_create_tenants.sql       # tenants table
│   ├── 002_create_devices.sql       # devices table (FK → tenants)
│   └── 003_create_pdf_uploads.sql   # uploads table (FK → tenants)
│
├── src/
│   ├── config/
│   │   ├── database.ts              # PostgreSQL pool setup
│   │   ├── env.ts                   # Environment variable config
│   │   └── migrate.ts               # Migration runner
│   │
│   ├── controllers/
│   │   ├── tenant.controller.ts     # Request handlers for tenants
│   │   ├── device.controller.ts     # Request handlers for devices
│   │   └── upload.controller.ts     # Request handlers for file uploads
│   │
│   ├── middleware/
│   │   ├── error.middleware.ts      # Global error handler + 404 handler
│   │   └── upload.middleware.ts     # Multer file upload config
│   │
│   ├── models/
│   │   ├── tenant.model.ts          # Raw SQL queries for tenants
│   │   ├── device.model.ts          # Raw SQL queries for devices
│   │   └── upload.model.ts          # Raw SQL queries for uploads
│   │
│   ├── routes/
│   │   ├── index.ts                 # Root router — mounts all routes
│   │   ├── tenant.routes.ts         # /api/v1/tenants
│   │   ├── device.routes.ts         # /api/v1/tenants/:tenantId/devices
│   │   └── upload.routes.ts         # /api/v1/tenants/:tenantId/uploads
│   │
│   ├── services/
│   │   ├── tenant.service.ts        # Business logic for tenants
│   │   ├── device.service.ts        # Business logic for devices
│   │   └── upload.service.ts        # Business logic for file uploads
│   │
│   ├── types/
│   │   └── index.ts                 # All TypeScript interfaces and DTOs
│   │
│   ├── utils/
│   │   ├── logger.ts                # Timestamped console logger
│   │   └── response.ts              # sendSuccess / sendError helpers
│   │
│   ├── app.ts                       # Express app setup (middleware, routes)
│   └── server.ts                    # Entry point — connects DB then starts server
│
├── uploads/                         # Uploaded files stored here (auto-created)
│   └── <tenantId>/                  # Files are grouped per tenant
│
├── .env                             # Local environment variables (not committed)
├── .env.example                     # Template for environment variables
├── package.json
└── tsconfig.json
```

---

## Database Schema

```
tenants
├── tenant_id    VARCHAR(255)  PRIMARY KEY
├── tenant_name  VARCHAR(255)  NOT NULL UNIQUE
├── created_at   TIMESTAMPTZ
└── updated_at   TIMESTAMPTZ

devices
├── id            UUID          PRIMARY KEY (auto-generated)
├── tenant_id     VARCHAR(255)  FK → tenants.tenant_id  ON DELETE CASCADE
├── phone_number  VARCHAR(20)   NOT NULL UNIQUE
├── device_id     VARCHAR(255)  NOT NULL
└── created_at    TIMESTAMPTZ

pdf_uploads
├── id             UUID          PRIMARY KEY (auto-generated)
├── tenant_id      VARCHAR(255)  FK → tenants.tenant_id  ON DELETE CASCADE
├── original_name  VARCHAR(500)  NOT NULL
├── file_path      VARCHAR(1000) NOT NULL
├── file_size      INTEGER       NOT NULL
├── mime_type      VARCHAR(100)  NOT NULL
└── uploaded_at    TIMESTAMPTZ
```

> Deleting a tenant automatically deletes all its devices and uploads (CASCADE).

---

## Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+ running on port 5432

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=zigxo_db
DB_USER=postgres
DB_PASSWORD=your_password

UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### 4. Create the database

Run this in pgAdmin or psql:

```sql
CREATE DATABASE zigxo_db;
```

### 5. Create tables

Run these SQL files in order in pgAdmin Query Tool:

1. `migrations/001_create_tenants.sql`
2. `migrations/002_create_devices.sql`
3. `migrations/003_create_pdf_uploads.sql`

Or use the migration script:

```bash
npm run migrate
```

### 6. Start the server

```bash
# Development (auto-restart on file change)
npm run dev

# Production build
npm run build
npm start
```

Server starts at `http://localhost:3000`

---

## API Reference

### Base URL
```
http://localhost:3000/api/v1
```

### Health Check
```
GET /health
```

---

### Tenants

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tenants/create` | Create a new tenant (bot) |
| GET | `/tenants/list` | List all tenants |
| GET | `/tenants/get/:tenantId` | Get tenant by ID |
| PUT | `/tenants/update/:tenantId` | Update tenant name |
| DELETE | `/tenants/delete/:tenantId` | Delete tenant and all its data |

**Create Tenant — Request Body:**
```json
{
  "tenant_id": "bot-001",
  "tenant_name": "SalesBot"
}
```
> `tenant_id` is optional. If not provided, a UUID is auto-generated.

---

### Devices

All device routes are scoped under a tenant: `/tenants/:tenantId/devices`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tenants/:tenantId/devices/create` | Register a new device |
| GET | `/tenants/:tenantId/devices/list` | List all devices for tenant |
| GET | `/tenants/:tenantId/devices/get/:id` | Get device by ID |
| PUT | `/tenants/:tenantId/devices/update/:id` | Update device details |
| DELETE | `/tenants/:tenantId/devices/delete/:id` | Delete a device |

**Create Device — Request Body:**
```json
{
  "phone_number": "+919876543210",
  "device_id": "DEVICE-ABC-001"
}
```

---

### File Uploads

All upload routes are scoped under a tenant: `/tenants/:tenantId/uploads`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tenants/:tenantId/uploads/upload` | Upload a file |
| GET | `/tenants/:tenantId/uploads/list` | List all uploads for tenant |
| DELETE | `/tenants/:tenantId/uploads/delete/:uploadId` | Delete an upload |

**Upload File — Form Data:**
- Content-Type: `multipart/form-data`
- Field name: `file`
- Accepted types: PDF, Word, DOCX, and all other file types
- Max size: 10 MB (configurable via `MAX_FILE_SIZE` in `.env`)

**Access uploaded files directly:**
```
GET http://localhost:3000/files/<tenantId>/<filename>
```

---

### API Response Format

All endpoints return the same structure:

**Success:**
```json
{
  "success": true,
  "message": "Tenant created successfully",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Tenant not found: bot-001"
}
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run migrate` | Run all SQL migration files |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment name |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `zigxo_db` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | _(empty)_ | Database password |
| `UPLOAD_DIR` | `uploads` | Directory to store uploaded files |
| `MAX_FILE_SIZE` | `10485760` | Max upload size in bytes (default 10 MB) |
