# OTP Services

Microservice untuk Email dan WhatsApp OTP.

## Endpoints

### Email OTP
```
POST /api/otp/email/send
Body: { "email": "user@example.com", "otp": "123456" }
```

### WhatsApp OTP
```
POST /api/otp/whatsapp/send
Body: { "phoneNumber": "089502694005", "otp": "123456" }
```

### Health Check
```
GET /health
```

## Setup

1. Copy `.env.example` to `.env`
2. Set `SENDGRID_API_KEY` dan `SENDGRID_FROM_EMAIL`
3. Run: `npm install && npm run dev`

## Deploy

Push ke branch `main` untuk auto-deploy via GitHub Actions.

## K8s Secrets

```bash
kubectl create secret generic otp-secrets -n fuel-friend \
  --from-literal=sendgrid-api-key=YOUR_KEY \
  --from-literal=sendgrid-from-email=noreply@fuelagent.com
```
