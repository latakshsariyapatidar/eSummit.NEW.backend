# Payments Module (Module 4)

This module handles UPI dynamic QR code generation and proof-of-payment submission checks.

## UPI Deep Linking Specifications
UPI dynamic QR codes are created by generating a standard URI schema:
`upi://pay?pa=[VPA]&pn=[MERCHANT_NAME]&am=[AMOUNT]&tn=[ORDER_ID]&cu=INR`

## Workflow
1. User proceeds to checkout.
2. Server generates a dynamic UPI URL with the exact order total and E-Summit transaction note.
3. Client displays QR code generated from that URL.
4. User pays in their preferred UPI App (GPay, PhonePe, Paytm, etc.).
5. User copies the 12-digit UTR/transaction ref number and uploads a screenshot of the receipt.
6. Server stores transaction references and marks the order as `pending_verification`.

## Routes
- `GET /api/payments/:orderId/qr` - Stream QR image bytes
- `POST /api/payments/:orderId/pay` - Submit UTR and transaction proof screenshot URL
