# Content (Public CMS) Module API Documentation

This module serves public content for the E-Summit website (FAQ, sponsors, event details, schedules, organizing team, merchandise, pass pricing categories, and system feature flags). All requests in this module are read-only (`GET`) and do not require authentication.

## Base URL
* **Local development:** `http://localhost:6996/api/content`
* **Production:** `https://iic.iitdh.ac.in/esummit/api/api/content`

---

## Endpoints

### 1. Get Events list
Retrieves E-Summit competitions and events list.

* **Method:** `GET`
* **Path:** `/events`
* **Authentication Required:** No

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2a0",
      "slug": "startup-pitch",
      "name": "Startup Pitch",
      "tagline": "Make your pitch count",
      "day": "Day 1",
      "time": "10:00 AM",
      "about": "Full description of the competition rules and judging criteria...",
      "brief": "Pitch your business idea to esteemed venture capitalists.",
      "format": ["Team of 3-5", "2 rounds"]
    }
  ]
}
```

---

### 2. Get Sponsors
Retrieves active sponsors metadata.

* **Method:** `GET`
* **Path:** `/sponsors`
* **Authentication Required:** No

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2a1",
      "name": "TechCorp",
      "tier": "gold",
      "logoType": "svg"
    }
  ]
}
```

---

### 3. Get FAQs
Retrieves the list of frequently asked questions.

* **Method:** `GET`
* **Path:** `/faqs`
* **Authentication Required:** No

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2a2",
      "q": "Is accommodation provided?",
      "a": "Yes, accommodation is provided for outstation participants."
    }
  ]
}
```

---

### 4. Get Schedules
Retrieves the overall event timeline/schedule grouped by day.

* **Method:** `GET`
* **Path:** `/schedule`
* **Authentication Required:** No

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2a3",
      "day": "Day 1",
      "items": [
        {
          "time": "09:00 AM",
          "title": "Inauguration Ceremony",
          "category": "keynote",
          "location": "Main Auditorium"
        },
        {
          "time": "11:30 AM",
          "title": "Panel Discussion: Future of AI",
          "category": "panel",
          "location": "Seminar Hall 2"
        }
      ]
    }
  ]
}
```

---

### 5. Get Organizing Teams
Retrieves the organizing committee team structure and crew details.

* **Method:** `GET`
* **Path:** `/teams`
* **Authentication Required:** No

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2a4",
      "lead": {
        "name": "Aarav Patel",
        "role": "Head",
        "team": "Tech",
        "email": "aarav@iitdh.ac.in",
        "bio": "Lead coordinator of Web Operations",
        "image": "aarav.jpg",
        "event": "Web Development"
      },
      "crew": [
        {
          "name": "Sneha R",
          "image": "sneha.jpg"
        }
      ]
    }
  ]
}
```

---

### 6. Get Passes Categories
Retrieves the categories, prices, and benefits of registration passes available for purchase.

* **Method:** `GET`
* **Path:** `/passes`
* **Authentication Required:** No

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2a5",
      "id": "day-1-pass",
      "name": "Day 1 Access Pass",
      "price": 750,
      "benefits": [
        "Access to all Keynotes on Day 1",
        "Lunch coupon included",
        "Entry to Startup Showcase"
      ],
      "soldOut": false,
      "tags": "Popular"
    }
  ]
}
```

---

### 7. Get Merchandise List ⚠️ *(Service Endpoint Only)*
Retrieves listed merchandise details.

* **Method:** `GET`
* **Path:** `/merch`
* **Authentication Required:** No
* *Note: This route is defined at the service layer for future client integrations.*

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "65ab9b08f87c5304b4c8a2a6",
      "id": "tshirt-black",
      "name": "E-Summit Tee",
      "price": 499,
      "img": "tshirt.png"
    }
  ]
}
```

---

### 8. Get Configuration Value by Key ⚠️ *(Service Endpoint Only)*
Fetches a single workspace configuration value by its specific key.

* **Method:** `GET`
* **Path:** `/config/:key`
* **Authentication Required:** No
* *Note: This route is defined at the service layer for configuration parameters.*

#### Route Parameters
* `key` (string, required): Key representing target setting (e.g. `pass_price`).

#### Success Response
* **Status Code:** `200 OK`
* **Body:**
```json
{
  "status": "success",
  "data": 750
}
```

#### Error Responses
* **Status Code:** `404 Not Found` (Config key not found)
  ```json
  {
    "status": "error",
    "message": "Config key not found"
  }
  ```
