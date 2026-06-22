<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" />
</p>

# 🏁 E-Summit '26 — Backend Server

> The modular API server powering **E-Summit '26**, the flagship entrepreneurship festival of **IIT Dharwad**. Handles ticketing, UPI payments, gate check-ins, content management, and the admin dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Seeding](#-database-seeding)
- [API Reference](#-api-reference)
- [Testing & Linting](#-testing--linting)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview

This backend powers the entire digital infrastructure of E-Summit '26:

| Capability | Description |
|---|---|
| 🎟️ **Ticketing** | Pass ordering with UPI payment proof uploads |
| 💳 **Payments** | Dynamic UPI QR code generation and UTR verification |
| 🔐 **Admin Dashboard** | Admin-key protected order management and DB insights |
| 📋 **Content CMS** | Serve events, sponsors, FAQs, schedule, merch, and team data |
| 🚪 **Gate Check-in** | QR-based venue entry scanning and attendance tracking |
| 📧 **Notifications** | Email (SMTP/Nodemailer) and SMS integrations |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | [Node.js](https://nodejs.org/) v18+ |
| **Framework** | [Express.js](https://expressjs.com/) v5.x |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) v9 |
| **Validation** | [Zod](https://zod.dev/) v4 |
| **Security** | [Helmet](https://helmetjs.github.io/), CORS, custom NoSQL injection sanitizer |
| **Auth** | Admin-key verification, [bcrypt](https://www.npmjs.com/package/bcrypt), [JWT](https://www.npmjs.com/package/jsonwebtoken) |
| **Notifications** | [Nodemailer](https://nodemailer.com/) (Email) + SMS gateway |
| **QR Codes** | [qrcode](https://www.npmjs.com/package/qrcode) |
| **Testing** | [Jest](https://jestjs.io/) + [Supertest](https://www.npmjs.com/package/supertest) + [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) |
| **Linting** | [ESLint](https://eslint.org/) (flat config) + [Prettier](https://prettier.io/) |
| **Dev Tools** | [Nodemon](https://nodemon.io/) |

---

## 🏗️ Architecture

The server follows a **modular monolith** architecture. Each domain feature is isolated inside its own module directory with its own routes, controllers, services, models, and validations. Shared infrastructure lives in `src/common/`.

```
                  ┌──────────────────────────────┐
                  │        Express App (app.js)    │
                  │  Helmet · CORS · Body Parser   │
                  │  Cookie Parser · Sanitizer     │
                  │  Rate Limiter · Request Logger  │
                  └───────────┬────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    ┌─────────────┐  ┌──────────────┐  ┌────────────┐
    │  /api/admin  │  │  /api/order  │  │/api/content│
    │  Auth Module │  │ Orders Module│  │Content CMS │
    └──────┬──────┘  └──────┬───────┘  └─────┬──────┘
           │                │                 │
    ┌──────┴──────┐  ┌──────┴───────┐  ┌─────┴──────┐
    │  /api/attend│  │   Payments   │  │   Passes   │
    │  Check-in   │  │   Module     │  │   Module   │
    └─────────────┘  └──────────────┘  └────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                  ┌────────────────────────┐
                  │     MongoDB (Mongoose)  │
                  └────────────────────────┘
```

---

## 📂 Directory Structure

```
esummit26-backend/
│
├── docs/                                 # Project documentation
│   └── CONTRIBUTING.md                   # Contribution guidelines
│
├── scripts/                              # Automation scripts
│   └── seed.js                           # Database seeder (passes, events, sponsors, etc.)
│
├── src/
│   ├── common/                           # ── Shared Infrastructure ──
│   │   ├── config/
│   │   │   ├── db.js                     # Mongoose connection manager
│   │   │   └── env.js                    # Zod-validated environment variables
│   │   ├── lib/
│   │   │   └── logger.js                 # Coloured console logger utility
│   │   ├── middleware/
│   │   │   ├── errorHandler.js           # Global error handler (Zod, Mongoose, duplicates)
│   │   │   ├── rateLimiter.js            # Express rate limiter presets
│   │   │   └── requestLogger.js          # HTTP request logging middleware
│   │   ├── models/
│   │   │   └── counter.model.js          # Auto-incrementing ID counter
│   │   └── utils/
│   │       ├── apiResponse.js            # Standardised API response wrappers
│   │       └── asyncHandler.js           # Async route handler wrapper
│   │
│   ├── modules/                          # ── Feature Modules ──
│   │   ├── auth/                         # Admin authentication & key verification
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.middleware.js         # verifyAdminKey guard
│   │   │   ├── auth.model.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   └── README.md
│   │   │
│   │   ├── checkin/                      # Gate entry QR scanning & attendance
│   │   │   ├── checkin.controller.js
│   │   │   ├── checkin.model.js
│   │   │   ├── checkin.routes.js
│   │   │   ├── checkin.service.js
│   │   │   └── README.md
│   │   │
│   │   ├── content/                      # Public CMS content (events, sponsors, FAQs…)
│   │   │   ├── content.controller.js
│   │   │   ├── content.model.js
│   │   │   ├── content.routes.js
│   │   │   ├── content.service.js
│   │   │   └── README.md
│   │   │
│   │   ├── notifications/               # Email & SMS dispatch
│   │   │   ├── notifications.service.js
│   │   │   ├── providers/
│   │   │   ├── templates/
│   │   │   └── README.md
│   │   │
│   │   ├── orders/                       # Ticket checkout & order management
│   │   │   ├── orders.controller.js
│   │   │   ├── orders.model.js
│   │   │   ├── orders.routes.js
│   │   │   ├── orders.service.js
│   │   │   ├── orders.validation.js
│   │   │   └── README.md
│   │   │
│   │   ├── passes/                       # Pass inventory & unique ID generation
│   │   │   ├── passAvailability.model.js
│   │   │   ├── passId.generator.js
│   │   │   ├── passes.controller.js
│   │   │   ├── passes.model.js
│   │   │   ├── passes.routes.js
│   │   │   ├── passes.service.js
│   │   │   └── README.md
│   │   │
│   │   └── payments/                     # UPI QR generation & transaction handling
│   │       ├── payments.controller.js
│   │       ├── payments.routes.js
│   │       ├── payments.service.js
│   │       ├── qr.util.js
│   │       └── README.md
│   │
│   ├── app.js                            # Express app initialisation & middleware
│   └── server.js                         # Entry point, DB connect, listen
│
├── tests/                                # Integration & unit tests
│   ├── auth.test.js
│   ├── checkin.test.js
│   └── orders.test.js
│
├── .env.example                          # Environment variable template
├── .gitignore
├── eslint.config.js                      # ESLint flat config
├── package.json
└── README.md                             # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| [Node.js](https://nodejs.org/) | v18 or higher |
| [MongoDB](https://www.mongodb.com/try/download/community) | v6 or higher (local or Atlas) |
| npm | v9+ (bundled with Node) |

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/esummit26-backend.git
cd esummit26-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in your local values (see [Environment Variables](#-environment-variables) below).

### 4. Seed the Database

Populate the database with initial content data (events, sponsors, passes, FAQs, schedule, merch, team, config):

```bash
npm run seed
```

### 5. Start the Server

**Development** (hot-reload via Nodemon):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

The server will start at `http://localhost:3000` (or the port configured in `.env`).

### 6. Verify Health

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "message": "Server is running",
  "timestamp": 1719100000000
}
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root. Refer to [`.env.example`](.env.example) for a template.

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | HTTP server port |
| `NODE_ENV` | No | `development` | Environment mode (`development` / `production`) |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiration duration |
| `ADMIN_KEY` | **Yes** | `adminkey` | Admin dashboard access key |
| `UPI_VPA` | No | — | UPI Virtual Payment Address for QR generation |
| `UPI_MERCHANT_NAME` | No | — | Merchant display name on UPI QR |
| `UPI_CURRENCY` | No | `INR` | Payment currency code |
| `SMTP_HOST` | No | — | SMTP server hostname |
| `SMTP_PORT` | No | — | SMTP server port |
| `SMTP_USER` | No | — | SMTP authentication username |
| `SMTP_PASS` | No | — | SMTP authentication password |
| `SMTP_FROM` | No | — | Default "From" email address |
| `SMS_API_KEY` | No | — | SMS gateway API key |
| `SMS_SENDER_ID` | No | — | SMS sender ID |
| `SMS_PROVIDER_URL` | No | — | SMS gateway API endpoint |

---

## 🌱 Database Seeding

The seed script populates the database with all content data required for the website to function:

```bash
npm run seed
```

**What gets seeded:**

| Collection | Records | Description |
|---|---|---|
| `passes` | 3 | Pit, Grid, and Podium passes with pricing & perks |
| `merch` | 4 | Merchandise items (jacket, cap, tee, gloves) |
| `events` | 12 | Competition and event details with formats |
| `sponsors` | 8 | Sponsor entries across tiers |
| `schedules` | 2 | Day 1 & Day 2 event schedules |
| `faqs` | 10 | Frequently asked questions |
| `teams` | 6 | Team structure with leads and crew members |
| `configs` | 2 | Dynamic config values (UPI IDs, target date) |

> **Note**: The seed script drops existing collections before inserting. Running it again will reset all content data.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Below is a quick-reference table — for full request/response schemas, see [`docs/API.md`](docs/API.md).

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Server health status |

### Public Content Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/content/events` | List all events/competitions |
| `GET` | `/api/content/sponsors` | List all sponsors by tier |
| `GET` | `/api/content/faqs` | List all FAQs |
| `GET` | `/api/content/schedule` | Day-wise event schedule |
| `GET` | `/api/content/merch` | Available merchandise |
| `GET` | `/api/content/teams` | Team structure & members |
| `GET` | `/api/content/config/:key` | Dynamic config values (e.g. `UPI_IDS`, `TARGET_DATE`) |

### Order Management

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/order/submit` | — | Submit a new pass/merch order |
| `GET` | `/api/order/status?phone=XXX` | — | Check order status by phone number |

### Gate Check-in / Attendance

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/attendance/verify-qr` | — | Verify a scanned QR code |
| `POST` | `/api/attendance/mark` | — | Mark an attendee as present |

### Admin Dashboard

> All admin endpoints require the `X-Admin-Key` header.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/verify-key` | Authenticate admin key |
| `GET` | `/api/admin/db-state` | Fetch full database state (orders + users) |
| `POST` | `/api/admin/order/verify` | Update order verification status |
| `GET` | `/api/admin/payment-screenshot/:filename` | Retrieve payment proof image |
| `GET` | `/api/admin/passes` | Fetch pass availability settings |
| `POST` | `/api/admin/passes/update` | Toggle pass availability/sold-out |

---

## 🧪 Testing & Linting

### Run Tests

```bash
npm test
```

Tests use **Jest** + **Supertest** with **mongodb-memory-server** for an isolated in-memory MongoDB instance.

### Run Linter

```bash
npx eslint .
```

ESLint is configured with a [flat config](eslint.config.js) enforcing:
- Strict equality (`===`)
- Single quotes, semicolons, 2-space indent
- Curly braces on all blocks
- No undefined variables

### NPM Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `nodemon src/server.js` | Development server with hot-reload |
| `npm start` | `node src/server.js` | Production server |
| `npm test` | `jest` | Run test suite |
| `npm run seed` | `node scripts/seed.js` | Seed database with initial content |

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's a bug fix, new feature, or documentation improvement — every contribution counts.

1. **Read** the [Contributing Guide](docs/CONTRIBUTING.md) for coding standards and branch conventions.
2. **Fork** the repository and create your feature branch from `dev`:
   ```bash
   git checkout -b feat/your-feature dev
   ```
3. **Follow** the modular pattern — each module has its own `routes`, `controller`, `service`, `model`, and `validation` files.
4. **Write tests** for new endpoints under `tests/`.
5. **Ensure** all checks pass:
   ```bash
   npx eslint .
   npm test
   ```
6. **Submit** a Pull Request to the `dev` branch with a clear description.

### Branch Naming

| Prefix | Purpose |
|---|---|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring |
| `test/` | Adding or fixing tests |

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the <strong>IIC, IIT Dharwad</strong> team for E-Summit '26
</p>
