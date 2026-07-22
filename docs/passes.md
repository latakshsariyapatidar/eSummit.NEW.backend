# Passes Module API Documentation

This module manages registration passes/tickets, lookup requests, cancellation utilities, and event check-ins (gate scanning flow).

## Base URL
* **Local development:** `http://localhost:6996/api/passes`
* **Production:** `https://iic.iitdh.ac.in/esummit/api/api/passes`

---

## Pass Status Reference

A pass can have the following statuses:
* `active`: Valid pass, not yet used for entry.
* `used`: Holder has successfully checked in at the event gate.
* `cancelled`: Pass has been cancelled by an administrator or volunteer.

---

## Endpoints

### 1. Get Pass Details
Fetches full details of a single pass using its unique alphanumeric Pass ID.

* **Method:** `GET`
* **Path:** `/:passId`
* **Authentication Required:** No

#### Route Parameters
* `passId` (string, required): The unique ID of the pass (e.g., `PAS-LK4X2Z-CD5E1F`).

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "_id": "65ab9b3cf87c5304b4c8a2d5",
    "passId": "PAS-LK4X2Z-CD5E1F",
    "orderId": "ORD-LK4X2Y-AB3C9D",
    "order": {
      "_id": "65ab9b08f87c5304b4c8a2c2",
      "orderId": "ORD-LK4X2Y-AB3C9D",
      "amount": 1500,
      "status": "verified"
    },
    "type": "Day 1",
    "price": 750,
    "eventName": "Hackathon 2026",
    "attendeeName": "Riya Sharma",
    "attendeeEmail": "riya@example.com",
    "attendeeGender": "Female",
    "collegeName": "IIT Dharwad",
    "qr": "data:image/png;base64,...",
    "status": "active",
    "checkedIn": false,
    "checkedInAt": null,
    "checkedInBy": null,
    "createdAt": "2026-01-15T10:30:00.000Z"
  },
  "message": "Pass fetched successfully."
}
```

#### Error Responses
* **Status Code:** `404 Not Found` (Pass not found)
  ```json
  {
    "status": "error",
    "message": "Pass not found."
  }
  ```

---

### 2. Get Passes by Order ID
Retrieves all passes generated for a specific order.

* **Method:** `GET`
* **Path:** `/order/:orderId`
* **Authentication Required:** No

#### Route Parameters
* `orderId` (string, required): The target order ID (e.g., `ORD-LK4X2Y-AB3C9D`).

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b3cf87c5304b4c8a2d5",
      "passId": "PAS-LK4X2Z-CD5E1F",
      "orderId": "ORD-LK4X2Y-AB3C9D",
      "type": "Day 1",
      "price": 750,
      "eventName": "Hackathon 2026",
      "attendeeName": "Riya Sharma",
      "attendeeEmail": "riya@example.com",
      "attendeeGender": "Female",
      "collegeName": "IIT Dharwad",
      "qr": "data:image/png;base64,...",
      "status": "active",
      "checkedIn": false,
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  ],
  "message": "Passes fetched successfully."
}
```

---

### 3. Check-In Pass 🔒 Volunteer / Admin
Marks a pass as checked-in (used) for entry at the event gate.

* **Method:** `POST`
* **Path:** `/:passId/check-in`
* **Authentication Required:** Yes (JWT Bearer Token with Volunteer/Admin privileges)

#### Request Headers
```http
Authorization: Bearer <jwt_token>
```

#### Route Parameters
* `passId` (string, required): The Pass ID to check in.

#### Request Body
* None required.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "_id": "65ab9b3cf87c5304b4c8a2d5",
    "passId": "PAS-LK4X2Z-CD5E1F",
    "orderId": "ORD-LK4X2Y-AB3C9D",
    "type": "Day 1",
    "price": 750,
    "attendeeName": "Riya Sharma",
    "attendeeEmail": "riya@example.com",
    "attendeeGender": "Female",
    "collegeName": "IIT Dharwad",
    "status": "used",
    "checkedIn": true,
    "checkedInAt": "2026-02-14T09:30:00.000Z",
    "checkedInBy": 5
  },
  "message": "Pass checked in successfully."
}
```

#### Error Responses
* **Status Code:** `401 Unauthorized` (Token missing or invalid)
  ```json
  {
    "status": "error",
    "message": "Not authorized to access this route. Token is invalid or expired."
  }
  ```
* **Status Code:** `403 Forbidden` (Insufficient role level)
  ```json
  {
    "status": "error",
    "message": "Access denied. Volunteer privileges required."
  }
  ```
* **Status Code:** `404 Not Found` (Pass not found)
  ```json
  {
    "status": "error",
    "message": "Pass not found."
  }
  ```
* **Status Code:** `400 Bad Request` (Pass cancelled)
  ```json
  {
    "status": "error",
    "message": "Pass has been cancelled."
  }
  ```
* **Status Code:** `400 Bad Request` (Pass already checked in)
  ```json
  {
    "status": "error",
    "message": "Pass has already been checked in."
  }
  ```

---

### 4. Cancel Pass 🔒 Volunteer / Admin
Cancels an active pass. Useful for refund processing or administrative errors.

* **Method:** `POST`
* **Path:** `/:passId/cancel`
* **Authentication Required:** Yes (JWT Bearer Token with Volunteer/Admin privileges)

#### Request Headers
```http
Authorization: Bearer <jwt_token>
```

#### Route Parameters
* `passId` (string, required): The Pass ID to cancel.

#### Request Body
* None required.

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": {
    "_id": "65ab9b3cf87c5304b4c8a2d5",
    "passId": "PAS-LK4X2Z-CD5E1F",
    "status": "cancelled"
  },
  "message": "Pass cancelled successfully."
}
```

#### Error Responses
* **Status Code:** `404 Not Found` (Pass not found)
  ```json
  {
    "status": "error",
    "message": "Pass not found."
  }
  ```
* **Status Code:** `400 Bad Request` (Pass already checked in/used)
  ```json
  {
    "status": "error",
    "message": "Checked-in passes cannot be cancelled."
  }
  ```
