# Passes Module (Module 3)

This module handles ticket stock configuration, pass validation lookups, and unique ticket visual key generation.

## Responsibilities
- Track remaining capacity for general, VIP, and student tiers.
- Generate cryptographically secure ticket numbers to avoid brute-forcing.
- Control active state and revoke credentials where payment is flagged.

## Structure and Schema
- `passId` formatted as: `ES26-[TIER]-[RANDOM_ALPHANUMERIC]`
- Connects directly with `Orders` and `Checkin` modules.

## Routes
- `GET /api/passes/inventory` - Fetch counts of remaining tickets
- `GET /api/passes/:id` - Read ticket status & credentials
