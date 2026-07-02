# E-Summit '26 Backend — Knowledge Transfer

Backend API for E-Summit '26, IIT Dharwad's flagship entrepreneurship festival. Handles ticketing, UPI payments, gate check-ins, dynamic content, and admin/volunteer access.

---

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS) |
| Framework | Express v5 |
| Database | MongoDB via Mongoose v9 |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod |
| QR Generation | `qrcode` (local, no external API) |
| Email | Nodemailer (SMTP) |
| Logging | Custom logger (`src/common/lib/logger.js`) |
| Job Scheduling | node-cron |
| Dev | nodemon, eslint, prettier, jest + supertest |

---

## Project Structure

```
src/
├── app.js                  # Express setup, middleware mounting, route mounting
├── server.js               # Entry point — DB connect, email init, worker boot
├── common/
│   ├── config/
│   │   ├── db.js           # Mongoose connection
│   │   └── env.js          # Zod-validated env schema (fails fast on boot)
│   ├── lib/
│   │   └── logger.js       # App-wide logger
│   ├── middleware/
│   │   ├── errorHandler.js # Global error handler (last middleware)
│   │   ├── rateLimiter.js  # express-rate-limit (authLimiter exported separately)
│   │   └── requestLogger.js
│   ├── models/
│   │   └── counter.model.js # Auto-increment counter (used for User.ID)
│   └── utils/
│       ├── apiResponse.js   # Unified { status, data, message } response helpers
│       ├── asyncHandler.js  # try/catch wrapper for async controllers
│       ├── generateOrderId.js
│       └── generatePassId.js
├── modules/
│   ├── auth/               # Key-based auth (admin + volunteer)
│   ├── admin/              # Volunteer key management
│   ├── orders/             # Order lifecycle (create → UTR → approve/reject)
│   ├── passes/             # Pass lookup & gate check-in
│   ├── content/            # Public CMS (events, sponsors, FAQs, schedule, merch, teams, config)
│   ├── notifications/      # Email notifications via queue + worker
│   └── qrService/          # UPI payment QR and pass QR generation
└── workers/
    └── notification.worker.js  # Polls Notification collection and sends emails
```

---

## Environment Variables

Validated at boot via Zod — the server will not start if any required key is missing.

| Variable | Required | Description |
|---|---|---|
| `PORT` | No (default: 5000) | HTTP server port |
| `NODE_ENV` | No (default: `development`) | `development` / `production` / `test` |
| `MONGODB_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | No (default: `7d`) | JWT expiry duration |
| `ADMIN_KEY` | No (default: `adminkey`) | Pre-shared admin passphrase |
| `UPI_VPA` | **Yes** | Primary UPI VPA (e.g. `esummit@okhdfc`) |
| `UPI_VPAS` | No | Comma-separated list of VPAs for load distribution |
| `UPI_MERCHANT_NAME` | **Yes** | Merchant name shown in UPI apps |
| `UPI_CURRENCY` | No (default: `INR`) | Currency code |
| `SMTP_HOST` | No | SMTP server host |
| `SMTP_PORT` | No | SMTP server port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_FROM` | No | Sender email address |

Copy `.env.example` → `.env` and fill in values before starting.

---

## Running Locally

```bash
npm install
cp .env.example .env
# fill in .env values
npm run dev       # nodemon watch mode
```

For production:

```bash
npm start         # node src/server.js
```

---

## Startup Sequence

`server.js` runs these steps in order before accepting traffic:

1. Load `.env` via `dotenv`
2. Validate env schema (Zod) — hard exit on failure
3. Connect to MongoDB
4. Initialize SMTP email provider
5. Start `notification.worker` (polls DB for pending emails)
6. `app.listen()` on `PORT`

---

## Global Middleware (app.js)

Applied in this order to every request:

1. **CORS** — `origin: '*'`, methods: GET, POST, OPTIONS, headers: Content-Type, X-Admin-Key
2. **JSON body parser** — 10 MB limit
3. **URL-encoded body parser** — 10 MB limit
4. **Cookie parser**
5. **Mongo sanitize** — strips keys starting with `$` or containing `.`
6. **Request logger**

---

## Route Map & API Documentation

| Prefix | Module / Documentation |
|---|---|
| `/api/auth` | [Auth Module API Documentation](auth.md) |
| `/api/admin` | [Admin Module (Key Management) API Documentation](admin.md) |
| `/api/orders` | [Orders Module API Documentation](orders.md) |
| `/api/passes` | [Passes Module API Documentation](passes.md) |
| `/api/content` | [Content Module (CMS) API Documentation](content.md) |
| `/health` | [Health Check API Documentation](health.md) |

---

## Auth System

Authentication is **key-based**, not email/password.

**Two access levels:**

- **Admin** — matches against the `ADMIN_KEY` env var; gets `role: 'admin'`, `id: 0` in JWT payload
- **Volunteer** — a randomly generated 8-char hex key stored in MongoDB (`User` collection); gets `role: 'volunteer'` in JWT

**Token delivery:** JWT is set as an `httpOnly` cookie (`token`) and also returned in the response body. Middleware reads from either `Authorization: Bearer <token>` or the cookie.

**Middleware chain:**
- `protect` — verifies JWT, attaches `req.user`
- `requireAdmin` — gates to `role === 'admin'`
- `requireVolunteer` — gates to `role === 'volunteer'` or `'admin'`
- `verifyAdminKey` — reads `X-Admin-Key` header, compares against `ADMIN_KEY` env var (used separately on `/api/admin` routes)

---

## Orders Lifecycle

```
PENDING
  └─→ PAYMENT_SUBMITTED  (after UTR submitted)
        ├─→ VERIFIED      (admin approves → passes generated + emails queued)
        └─→ REJECTED      (admin rejects → rejection emails queued)
PENDING
  └─→ CANCELLED           (order expires after 30 min without UTR submission)
```

Order approval runs inside a **Mongoose transaction** — pass creation and order status update are atomic.

---

## Notification System

Email sending is decoupled from the request cycle:

1. On order approve/reject, the controller inserts records into the `Notification` MongoDB collection
2. `notification.worker.js` polls the collection on a cron schedule and sends emails via Nodemailer
3. Email templates are Handlebars HTML files in `src/modules/notifications/templates/`

---

## Standard Response Shape

All endpoints return:

```json
// Success
{ "status": "success", "data": { ... }, "message": "optional" }

// Error
{ "status": "error", "message": "Human-readable description" }
```

---

## CI/CD

GitHub Actions workflow at `.github/workflows/deploy.yml`. Deploys to the college VPS (`iic.iitdh.ac.in`). Frontend is served from `/var/www/iic/esummit/`; backend runs on port 6996, proxied via nginx at `/esummit/api/`.
