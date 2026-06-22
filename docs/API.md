# E-Summit '26 — API Reference

> Complete endpoint documentation with request/response schemas.
>
> **Base URL**: `http://localhost:3000/api` (local) · `https://iic.iitdh.ac.in/api` (production)

---

## Table of Contents

- [Health Check](#health-check)
- [Public Content Endpoints](#1-public-content-endpoints)
  - [Get Events](#11-get-events)
  - [Get Sponsors](#12-get-sponsors)
  - [Get FAQs](#13-get-faqs)
  - [Get Schedule](#14-get-schedule)
  - [Get Merchandise](#15-get-merchandise)
  - [Get Teams](#16-get-teams)
  - [Get Config](#17-get-config)
- [Order Management](#2-order-management)
  - [Submit Order](#21-submit-order)
  - [Check Order Status](#22-check-order-status)
- [Gate Check-in / Attendance](#3-gate-check-in--attendance)
  - [Verify QR Code](#31-verify-qr-code)
  - [Mark Attendance](#32-mark-attendance)
- [Admin Dashboard](#4-admin-dashboard)
  - [Verify Admin Key](#41-verify-admin-key)
  - [Get Database State](#42-get-database-state)
  - [Verify Order Status](#43-verify-order-status)
  - [Get Payment Screenshot](#44-get-payment-screenshot)
  - [Get Pass Availability](#45-get-pass-availability)
  - [Update Pass Settings](#46-update-pass-settings)
- [Standard Response Format](#standard-response-format)
- [Error Codes](#error-codes)

---

## Standard Response Format

All API responses follow a consistent JSON envelope:

**Success**:
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional success message"
}
```

**Error**:
```json
{
  "status": "error",
  "message": "Human-readable error description"
}
```

---

## Health Check

```
GET /api/health
```

**Response** (`200 OK`):
```json
{
  "message": "Server is running",
  "timestamp": 1719100000000
}
```

---

## 1. Public Content Endpoints

These endpoints require no authentication and serve CMS content to the frontend.

---

### 1.1 Get Events

Retrieve all events/competitions catalogued for the summit.

```
GET /api/content/events
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": [
    {
      "_id": "647f3b6192305a415a78fa81",
      "slug": "innovex",
      "name": "INNOVEX 3.0",
      "tagline": "Where Ideas Meet Expertise and Innovation Takes Flight",
      "day": "Day 2",
      "time": "03:30 PM",
      "about": "INNOVEX 3.0 is the flagship pitch deck competition...",
      "brief": "The event brings together innovative minds...",
      "format": [
        "Startup idea submission & screening",
        "Pitch deck validation & mentorship",
        "Presentation to panel of industry experts",
        "Winners declared & startup support"
      ]
    }
  ]
}
```

---

### 1.2 Get Sponsors

Retrieve the metadata and branding tiers of partners and sponsors.

```
GET /api/content/sponsors
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": [
    {
      "_id": "647f3b6192305a415a78fa89",
      "name": "VELOCITAS",
      "tier": "Title Sponsor",
      "logoType": "engine"
    }
  ]
}
```

---

### 1.3 Get FAQs

Fetch frequently asked questions and policies.

```
GET /api/content/faqs
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": [
    {
      "_id": "647f3b6192305a415a78fa9b",
      "q": "When and where is E-Summit 2026?",
      "a": "March 6–8, 2026 at IIT Dharwad."
    }
  ]
}
```

---

### 1.4 Get Schedule

Fetch day-wise timelines with event titles, times, categories, and venue locations.

```
GET /api/content/schedule
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": [
    {
      "_id": "647f3b6192305a415a78fa91",
      "day": "Day 01",
      "items": [
        {
          "time": "09:45 AM",
          "title": "Inauguration",
          "category": "Ceremony",
          "location": "F020",
          "_id": "647f3b6192305a415a78fa92"
        }
      ]
    }
  ]
}
```

---

### 1.5 Get Merchandise

Fetch available E-Summit themed merchandise items.

```
GET /api/content/merch
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": [
    {
      "_id": "647f3b6192305a415a78fa7e",
      "id": "m1",
      "name": "Team Jacket",
      "price": 1299,
      "img": "jacket"
    }
  ]
}
```

---

### 1.6 Get Teams

Retrieve E-Summit coordinators and team member details.

```
GET /api/content/teams
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": [
    {
      "_id": "647f3b6192305a415a78faa5",
      "lead": {
        "name": "Rajat Gupta",
        "role": "Overall Coordinator",
        "team": "Core Committee",
        "email": "outreach.iic@iitdh.ac.in",
        "bio": "Directing the overall execution...",
        "image": "https://ui-avatars.com/api/?name=Rajat+Gupta..."
      },
      "crew": []
    }
  ]
}
```

---

### 1.7 Get Config

Retrieve dynamic configuration values stored in the database.

```
GET /api/content/config/:key
```

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `key` | `string` | Config key name (e.g. `UPI_IDS`, `TARGET_DATE`) |

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": ["esummit@iitdh", "esummit26@okhdfcbank"]
}
```

**Error** (`404 Not Found`):
```json
{
  "status": "error",
  "message": "Config key not found"
}
```

---

## 2. Order Management

---

### 2.1 Submit Order

Submit a new pass or merchandise order with UPI payment proof.

```
POST /api/order/submit
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `phone` | `string` | ✅ | Buyer's phone number (10 digits) |
| `email` | `string` | ✅ | Buyer's email address |
| `gender` | `string` | ✅ | `"male"` / `"female"` / `"other"` |
| `order_type` | `string` | ✅ | `"pass"` or `"merch"` |
| `items` | `string[]` | ✅ | List of item descriptions |
| `payment_utr` | `string` | ✅ | 12-digit UPI Transaction Reference |
| `payment_screenshot` | `string` | ✅ | Base64-encoded payment proof image |
| `showPassDetails` | `boolean` | No | Whether pass attendee details are included |
| `pass_details` | `object[]` | Conditional | Required when `order_type` is `"pass"` |

**`pass_details` Object:**

| Field | Type | Description |
|---|---|---|
| `passType` | `string` | Type of pass (e.g. `"Pit Pass"`) |
| `passPrice` | `number` | Price of the pass |
| `attendeeName` | `string` | Full name of the attendee |
| `attendeeEmail` | `string` | Email of the attendee |
| `attendeeGender` | `string` | Gender of the attendee |
| `collegeName` | `string` | College/university name |

**Example Request:**
```json
{
  "phone": "9876543210",
  "email": "buyer@example.com",
  "gender": "male",
  "order_type": "pass",
  "items": ["Pit Pass - Attendee Registration"],
  "payment_utr": "123456789012",
  "payment_screenshot": "data:image/png;base64,iVBORw0KGgoAAAAN...",
  "showPassDetails": true,
  "pass_details": [
    {
      "passType": "Pit Pass",
      "passPrice": 299,
      "attendeeName": "John Doe",
      "attendeeEmail": "john@example.com",
      "attendeeGender": "male",
      "collegeName": "IIT Dharwad"
    }
  ]
}
```

**Success Response** (`201 Created`):
```json
{
  "status": "success",
  "data": {
    "order_id": 2
  },
  "message": "Order created successfully"
}
```

**Error Response** (`400 Bad Request`):
```json
{
  "status": "error",
  "message": "Duplicate UTR detected. This transaction reference has already been submitted."
}
```

---

### 2.2 Check Order Status

Look up orders by the buyer's phone number.

```
GET /api/order/status?phone=9876543210
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `phone` | `string` | ✅ | Buyer's registered phone number |

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": [
    {
      "ID": 2,
      "Status": "pending",
      "OrderType": "pass",
      "PaymentUTR": "123456789012",
      "Items": ["Pit Pass - Attendee Registration"],
      "CreatedAt": "2026-06-23T01:31:00.000Z",
      "UpdatedAt": "2026-06-23T01:31:00.000Z"
    }
  ]
}
```

**Status Values:** `pending` → `verified` / `rejected`

---

## 3. Gate Check-in / Attendance

---

### 3.1 Verify QR Code

Validate a scanned QR code and return attendee details.

```
POST /api/attendance/verify-qr
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `qr_content` | `string` | ✅ | Raw content from QR scan (e.g. `"ES26-PIT-A8F2"`) |

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": {
    "attendee_name": "John Doe",
    "attendee_email": "john@example.com",
    "college_name": "IIT Dharwad",
    "pass_type": "Pit Pass",
    "pass_price": 299,
    "is_present": false
  }
}
```

**Error** (`404 Not Found`):
```json
{
  "status": "error",
  "message": "Invalid QR code — pass not found"
}
```

---

### 3.2 Mark Attendance

Mark an attendee as checked-in at the venue.

```
POST /api/attendance/mark
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `qr_content` | `string` | ✅ | Raw content from QR scan |

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": {
    "attendee_name": "John Doe",
    "attendee_email": "john@example.com",
    "attended_at": "2026-06-23T01:32:00.000Z"
  }
}
```

**Error — Already Checked In** (`400 Bad Request`):
```json
{
  "status": "error",
  "message": "Already marked present"
}
```

---

## 4. Admin Dashboard

> ⚠️ **All admin endpoints require the `X-Admin-Key` header** containing the configured admin key.

```
X-Admin-Key: your-admin-key-here
```

---

### 4.1 Verify Admin Key

Authenticate an admin key before granting dashboard access.

```
POST /api/admin/verify-key
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `admin_key` | `string` | ✅ | The admin access key |

**Response** (`200 OK`):
```json
{
  "status": "success",
  "message": "Key verified successfully"
}
```

**Error** (`401 Unauthorized`):
```json
{
  "status": "error",
  "message": "Invalid admin key"
}
```

---

### 4.2 Get Database State

Fetch the full database state for the admin dashboard (all orders and users).

```
GET /api/admin/db-state
X-Admin-Key: {admin_key}
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "ID": 2,
        "UserID": 1,
        "Status": "pending",
        "OrderType": "pass",
        "PaymentUTR": "123456789012",
        "PaymentSSPath": "screenshots/2_168750123.png",
        "Items": ["Pit Pass - Attendee Registration"],
        "amount": 299,
        "CreatedAt": "2026-06-23T01:31:00.000Z",
        "UpdatedAt": "2026-06-23T01:31:00.000Z"
      }
    ],
    "users": [
      {
        "ID": 1,
        "Email": "buyer@example.com",
        "Phone": "9876543210",
        "Name": "John Doe",
        "CreatedAt": "2026-06-23T01:31:00.000Z"
      }
    ]
  }
}
```

---

### 4.3 Verify Order Status

Approve or reject a pending order.

```
POST /api/admin/order/verify
Content-Type: application/json
X-Admin-Key: {admin_key}
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `order_id` | `number` | ✅ | The order's auto-incremented ID |
| `status` | `string` | ✅ | `"verified"` or `"rejected"` |
| `rejection_reason` | `string` | No | Reason for rejection (when applicable) |

**Example Request:**
```json
{
  "order_id": 2,
  "status": "verified",
  "rejection_reason": ""
}
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "message": "Order status updated"
}
```

---

### 4.4 Get Payment Screenshot

Retrieve a payment proof screenshot by filename.

```
GET /api/admin/payment-screenshot/:filename
X-Admin-Key: {admin_key}
```

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `filename` | `string` | Screenshot file name (from `PaymentSSPath` in order data) |

**Response**: Binary image file (`image/png` or `image/jpeg`).

---

### 4.5 Get Pass Availability

Fetch current pass configuration including availability and sold-out status.

```
GET /api/admin/passes
X-Admin-Key: {admin_key}
```

**Response** (`200 OK`):
```json
{
  "passes": [
    {
      "id": 1,
      "name": "Pit Pass",
      "description": "Access to all keynotes, Expo floor, Refreshments",
      "price": 299,
      "soldOut": false,
      "available": true
    },
    {
      "id": 2,
      "name": "Grid Pass",
      "description": "All Pit perks, Workshops, Networking dinner, Swag kit",
      "price": 499,
      "soldOut": false,
      "available": true
    },
    {
      "id": 3,
      "name": "Podium Pass",
      "description": "All Grid perks, VIP lounge, Founder meet & greet, Track day ride",
      "price": 899,
      "soldOut": false,
      "available": true
    }
  ]
}
```

---

### 4.6 Update Pass Settings

Toggle pass availability or sold-out status.

```
POST /api/admin/passes/update
Content-Type: application/json
X-Admin-Key: {admin_key}
```

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `passes` | `object[]` | ✅ | Array of pass updates |

**Pass Update Object:**

| Field | Type | Description |
|---|---|---|
| `id` | `number` | Pass ID |
| `soldOut` | `boolean` | Whether the pass is sold out |
| `available` | `boolean` | Whether the pass is available for purchase |

**Example Request:**
```json
{
  "passes": [
    { "id": 1, "soldOut": true, "available": false }
  ]
}
```

**Response** (`200 OK`):
```json
{
  "status": "success",
  "message": "Passes updated"
}
```

---

## Error Codes

| HTTP Code | Meaning | Common Causes |
|---|---|---|
| `200` | OK | Request succeeded |
| `201` | Created | Resource successfully created (e.g. new order) |
| `400` | Bad Request | Validation failure, duplicate UTR, already checked in |
| `401` | Unauthorized | Missing or invalid `X-Admin-Key` |
| `404` | Not Found | Endpoint doesn't exist, resource not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |

---

<p align="center">
  <em>For setup instructions and contribution guidelines, see the <a href="../README.md">README</a> and <a href="CONTRIBUTING.md">CONTRIBUTING.md</a>.</em>
</p>
