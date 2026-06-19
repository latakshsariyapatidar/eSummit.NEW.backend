# Notifications Module (Module 6)

This module handles templating and asynchronous email/SMS notification dispatches.

## Responsibilities
- Compile HTML templates (`orderConfirmed`, `orderVerified`, `orderRejected`) with client-specific interpolation variables.
- Connect to NodeMailer / SMTP hosts.
- Interface with SMS gateways to text entry codes to buyers.

## Templates Directory
- [orderConfirmed.html](file:///d:/Projects/ESummit26.NEW.Backend/src/modules/notifications/templates/orderConfirmed.html) - Booking request saved.
- [orderVerified.html](file:///d:/Projects/ESummit26.NEW.Backend/src/modules/notifications/templates/orderVerified.html) - Tickets active, displays Pass IDs.
- [orderRejected.html](file:///d:/Projects/ESummit26.NEW.Backend/src/modules/notifications/templates/orderRejected.html) - Bad receipt reference alert.
