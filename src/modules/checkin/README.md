# Check-in Module (Module 5)

This module handles physical gate ticket validation, scanning logs, and analytics metrics of visitors entering the venue.

## Responsibilities
- Scan ticket credentials and check validity.
- Prevent double-entry (a ticket can only be checked in once).
- Log scanning events with volunteer IDs and gate tags for security/audit.

## Gateway Check Flow
```mermaid
graph TD
    A[Scanner App scans QR code] --> B{Verify passId format}
    B -- Invalid --> C[Reject: Malformed Ticket]
    B -- Valid --> D{Find Pass in DB}
    D -- Not Found --> E[Reject: Ticket Non-existent]
    D -- Found --> F{Check Pass Status}
    F -- Revoked --> G[Reject: Cancelled/Refunded]
    F -- Reserved --> H[Reject: Unpaid Ticket]
    F -- Active --> I{Check if Scanned Already}
    I -- Yes --> J[Reject: Double Entry Alert]
    I -- No --> K[Approve Access & Log Check-in]
```

## Routes
- `POST /api/checkin/scan` - Validate ticket QR code
- `GET /api/checkin/stats` - Fetch live dashboard analytics
