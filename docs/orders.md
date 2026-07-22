# Orders Module API Documentation

This module manages the registration order lifecycle: creation, payment submission via UPI UTR, and admin verification (approval or rejection).

## Base URL
* **Local development:** `http://localhost:6996/api/orders`
* **Production:** `https://iic.iitdh.ac.in/esummit/api/api/orders`

---

## Order Status Lifecycle

An order progresses through the following states:
1. `pending`: Order created, awaiting payment (expires in 30 minutes).
2. `payment_submitted`: UPI UTR reference and optional screenshot submitted by the user; awaiting admin review.
3. `verified`: Admin approved the payment. Passes are generated and sent via email.
4. `rejected`: Admin rejected the payment. Rejection emails with reasons are sent.
5. `cancelled`: Order expired (30 min timeout) or cancelled before completion.

---

## Endpoints

### 1. Submit/Create Order
Creates a new pending ticket/pass order and returns a UPI payment QR code (Base64).

* **Method:** `POST`
* **Path:** `/submit`
* **Authentication Required:** No

#### Request Body
```json
{
  "cartValue": 1500,
  "passes": [
    {
      "eventName": "Hackathon 2026",
      "passType": "Day 1",
      "passPrice": 750,
      "attendeeName": "Riya Sharma",
      "attendeeEmail": "riya@example.com",
      "attendeeGender": "Female",
      "collegeName": "IIT Dharwad"
    },
    {
      "eventName": "Hackathon 2026",
      "passType": "Day 1",
      "passPrice": 750,
      "attendeeName": "Arjun Mehta",
      "attendeeEmail": "arjun@example.com",
      "attendeeGender": "Male",
      "collegeName": "NIT Surathkal"
    }
  ]
}
```

##### Validation Constraints:
* `cartValue` (number, positive, required): Must exactly equal the sum of all `passPrice` values.
* `passes` (array of objects, minimum 1 item, required):
  * `eventName` (string, minimum 1 character, required).
  * `passType` (string, required): Cannot be empty.
  * `passPrice` (number, positive, required): Price of individual pass.
  * `attendeeName` (string, minimum 2 characters, required).
  * `attendeeEmail` (string, valid email format, required).
  * `attendeeGender` (string, required): Must be one of `Male`, `Female`, `Other`.
  * `collegeName` (string, minimum 2 characters, required).

#### Success Response
* **Status Code:** `201 Created`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "orderId": "ORD-LK4X2Y-AB3C9D",
    "qrBase64": "data:image/png;base64,iVBORw0KGgo...",
    "paymentUPI": "esummit@okhdfc"
  },
  "message": "Order created successfully."
}
```
* **Note:** Display `qrBase64` inside an `<img src="..." />` element. This encodes a UPI deep-link containing the payee details, order reference, and amount.

#### Error Responses
* **Status Code:** `400 Bad Request` (Zod schema validation failed)
  ```json
  {
    "status": "error",
    "message": "passes.0.attendeeEmail: Invalid attendee email"
  }
  ```
* **Status Code:** `400 Bad Request` (Cart value total mismatch)
  ```json
  {
    "status": "error",
    "message": "Cart value mismatch."
  }
  ```

---

### 2. Submit Payment UTR
Submits the UPI transaction reference (UTR) and optional payment screenshot to transition order to `payment_submitted`.

* **Method:** `POST`
* **Path:** `/utr`
* **Authentication Required:** No

#### Request Body
```json
{
  "orderId": "ORD-LK4X2Y-AB3C9D",
  "utr": "423100123456",
  "paymentScreenshot": "data:image/jpeg;base64,..."
}
```
##### Validation Constraints:
* `orderId` (string, required): Active order ID.
* `utr` (string, required): 10 to 30 alphanumeric characters. Matching regex: `/^[A-Za-z0-9]{10,30}$/`.
* `paymentScreenshot` (string, base64 data URL, optional).

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "orderId": "ORD-LK4X2Y-AB3C9D",
    "status": "payment_submitted"
  },
  "message": "Payment submitted successfully."
}
```

#### Error Responses
* **Status Code:** `404 Not Found` (Order not found)
  ```json
  {
    "status": "error",
    "message": "Order not found."
  }
  ```
* **Status Code:** `400 Bad Request` (Order expired)
  ```json
  {
    "status": "error",
    "message": "Order has expired."
  }
  ```
* **Status Code:** `400 Bad Request` (Duplicate UTR submission)
  ```json
  {
    "status": "error",
    "message": "This UTR has already been used."
  }
  ```
* **Status Code:** `400 Bad Request` (Status invalid, e.g., already verified)
  ```json
  {
    "status": "error",
    "message": "Payment has already been submitted."
  }
  ```

---

### 3. Get Pending Orders 🔒 Admin
Retrieves all orders in `payment_submitted` state, awaiting verification.

* **Method:** `GET`
* **Path:** `/admin/pending`
* **Authentication Required:** Yes (JWT + `X-Admin-Key` header)

#### Request Headers
```http
Authorization: Bearer <jwt_token>
X-Admin-Key: <admin_key>
```

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2c2",
      "orderId": "ORD-LK4X2Y-AB3C9D",
      "amount": 1500,
      "paymentUPI": "esummit@okhdfc",
      "paymentUTR": "423100123456",
      "paymentScreenshot": "data:image/jpeg;base64,...",
      "status": "payment_submitted",
      "expiresAt": "2026-01-15T10:30:00.000Z",
      "passRequests": [
        {
          "eventName": "Hackathon 2026",
          "passType": "Day 1",
          "passPrice": 750,
          "attendeeName": "Riya Sharma",
          "attendeeEmail": "riya@example.com",
          "attendeeGender": "Female",
          "collegeName": "IIT Dharwad"
        }
      ],
      "history": [
        { "status": "pending", "at": "2026-01-15T10:00:00.000Z", "by": null },
        { "status": "payment_submitted", "at": "2026-01-15T10:05:00.000Z", "by": null }
      ],
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "message": "Pending orders fetched successfully."
}
```

---

### 4. Get Complete Order Details 🔒 Admin
Retrieves full details of a single order (including database-populated passes).

* **Method:** `GET`
* **Path:** `/admin/:orderId`
* **Authentication Required:** Yes (JWT + `X-Admin-Key` header)

#### Route Parameters
* `orderId` (string, required): The target order ID.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "_id": "65ab9b08f87c5304b4c8a2c2",
    "orderId": "ORD-LK4X2Y-AB3C9D",
    "amount": 1500,
    "status": "verified",
    "paymentUTR": "423100123456",
    "passRequests": [...],
    "passes": [
      {
        "_id": "65ab9b3cf87c5304b4c8a2d5",
        "passId": "PAS-LK4X2Z-CD5E1F",
        "orderId": "ORD-LK4X2Y-AB3C9D",
        "type": "Day 1",
        "price": 750,
        "attendeeName": "Riya Sharma",
        "attendeeEmail": "riya@example.com",
        "attendeeGender": "Female",
        "collegeName": "IIT Dharwad",
        "qr": "data:image/png;base64,...",
        "status": "active",
        "checkedIn": false
      }
    ],
    "history": [
      { "status": "pending", "at": "2026-01-15T10:00:00.000Z", "by": null },
      { "status": "payment_submitted", "at": "2026-01-15T10:05:00.000Z", "by": null },
      { "status": "verified", "at": "2026-01-15T10:30:00.000Z", "by": "0" }
    ],
    "verifiedAt": "2026-01-15T10:30:00.000Z",
    "verifiedBy": "0"
  },
  "message": "Order fetched successfully."
}
```

#### Error Responses
* **Status Code:** `404 Not Found`
  ```json
  {
    "status": "error",
    "message": "Order not found."
  }
  ```

---

### 5. Approve Order 🔒 Admin
Approves an order that is awaiting verification. Generates ticket passes and queues emails in the background.

* **Method:** `POST`
* **Path:** `/admin/:orderId/approve`
* **Authentication Required:** Yes (JWT + `X-Admin-Key` header)

#### Route Parameters
* `orderId` (string, required): The target order ID to approve.

#### Request Body
* None required.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "orderId": "ORD-LK4X2Y-AB3C9D",
    "status": "verified",
    "passes": [
      {
        "passId": "PAS-LK4X2Z-CD5E1F",
        "attendeeName": "Riya Sharma",
        "attendeeEmail": "riya@example.com",
        "qr": "data:image/png;base64,..."
      }
    ]
  },
  "message": "Order approved successfully."
}
```

#### Error Responses
* **Status Code:** `404 Not Found` (Order not found)
  ```json
  {
    "status": "error",
    "message": "Order not found."
  }
  ```
* **Status Code:** `400 Bad Request` (Order is in an invalid state for approval)
  ```json
  {
    "status": "error",
    "message": "Order has already been verified."
  }
  ```

---

### 6. Reject Order 🔒 Admin
Rejects an order that is awaiting verification and logs the reason. Queues rejection emails in the background.

* **Method:** `POST`
* **Path:** `/admin/:orderId/reject`
* **Authentication Required:** Yes (JWT + `X-Admin-Key` header)

#### Route Parameters
* `orderId` (string, required): The target order ID to reject.

#### Request Body
```json
{
  "reason": "UTR not found in bank statement"
}
```
* `reason` (string, min 5 characters, required): Reason for rejecting payment.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "orderId": "ORD-LK4X2Y-AB3C9D",
    "status": "rejected",
    "rejectedReason": "UTR not found in bank statement"
  },
  "message": "Order rejected successfully."
}
```

#### Error Responses
* **Status Code:** `404 Not Found` (Order not found)
  ```json
  {
    "status": "error",
    "message": "Order not found."
  }
  ```
* **Status Code:** `400 Bad Request` (Order is in an invalid state for rejection)
  ```json
  {
    "status": "error",
    "message": "Only submitted payments can be rejected."
  }
  ```
* **Status Code:** `400 Bad Request` (Reason missing or too short validation error)
  ```json
  {
    "status": "error",
    "message": "reason: Please provide a valid rejection reason"
  }
  ```
