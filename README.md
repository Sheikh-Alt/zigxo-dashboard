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
backend-zigxo/
├── migrations/                            # SQL migration files (run in order)
│   ├── 001_create_tenants.sql
│   ├── 002_create_devices.sql
│   ├── 003_create_pdf_uploads.sql
│   ├── 004_create_users.sql
│   ├── 005_agents_schema.sql
│   ├── 006_rename_topics_to_agents.sql
│   ├── 007_add_raw_content.sql
│   └── 008_agent_tenant_link.sql
│
├── src/
│   ├── config/                            # App configuration
│   │   ├── anthropic.ts                   # Anthropic SDK setup
│   │   ├── database.ts                    # PostgreSQL pool
│   │   ├── env.ts                         # Environment variables
│   │   ├── migrate.ts                     # Migration runner
│   │   ├── openai.ts                      # OpenAI SDK setup
│   │   ├── queue.ts                       # BullMQ queue config
│   │   └── storage.ts                     # Cloud storage config
│   │
│   ├── controllers/                       # Route handlers
│   ├── middleware/                        # Error handler, upload middleware
│   ├── models/                            # Raw SQL query functions
│   ├── routes/                            # Express routers
│   ├── services/                          # Business logic layer
│   ├── types/                             # TypeScript interfaces & DTOs
│   ├── utils/                             # Logger, response helpers, pipeline
│   ├── app.ts                             # Express app setup
│   ├── server.ts                          # Entry point
│   └── worker.ts                          # BullMQ background worker
│
├── .env                                   # Local env variables (not committed)
├── package.json
└── tsconfig.json
```

---

## Setup

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (for BullMQ queue)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file with your values:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=zigxo_db
DB_USER=postgres
DB_PASSWORD=your_password

OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### 4. Run migrations

```bash
npm run migrate
```

### 5. Start the server

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm run migrate` | Run all SQL migrations |
| `npm run dev:worker` | Start background job worker (dev) |
| `npm run worker` | Start background job worker (prod) |
