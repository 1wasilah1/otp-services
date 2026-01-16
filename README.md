# OTP Services

Microservice untuk Email dan WhatsApp OTP yang terintegrasi dengan Fuel Friend backend.

## 🚀 Features

- ✅ Email OTP via SendGrid
- ✅ WhatsApp OTP via Baileys (WhatsApp Web API)
- ✅ Support semua negara (international phone numbers)
- ✅ Persistent WhatsApp session dengan Kubernetes PVC
- ✅ Auto-deploy via GitHub Actions

## 📡 API Endpoints

### 1. Email OTP

**Send Email OTP**
```bash
POST /api/otp/email/send
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### 2. WhatsApp OTP

**Send WhatsApp OTP**
```bash
POST /api/otp/whatsapp/send
Content-Type: application/json

{
  "phoneNumber": "+628123456789",
  "otp": "123456"
}
```

**Supported Phone Formats:**
- 🇺🇸 USA: `+1234567890` atau `1234567890`
- 🇨🇳 China: `+8613800138000` atau `8613800138000`
- 🇳🇬 Nigeria: `+2348012345678` atau `2348012345678`
- 🇬🇧 UK: `+447700900123` atau `447700900123`
- 🇮🇩 Indonesia: `+628123456789`, `628123456789`, atau `08123456789`

**Response:**
```json
{
  "success": true,
  "message": "WhatsApp OTP sent successfully"
}
```

### 3. Health Check

```bash
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "otp-services"
}
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 20 (Alpine)
- **Framework:** Express.js + TypeScript
- **Email:** SendGrid API
- **WhatsApp:** @whiskeysockets/baileys v7.0.0-rc.9
- **Deployment:** Kubernetes (K3s)
- **CI/CD:** GitHub Actions
- **Storage:** Kubernetes PVC (WhatsApp session persistence)

## 📦 Setup Local

1. **Clone & Install**
```bash
git clone https://github.com/1wasilah1/otp-services.git
cd otp-services
npm install
```

2. **Environment Variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=verified@yourdomain.com
```

3. **Run Development**
```bash
npm run dev
```

4. **WhatsApp Setup**
- Service akan generate QR code di console
- Scan dengan WhatsApp di HP
- Session tersimpan di `auth_info_baileys/`

## ☸️ Kubernetes Deployment

### Prerequisites

1. **Create Namespace**
```bash
kubectl create namespace fuel-friend
```

2. **Create Secrets**
```bash
kubectl create secret generic otp-secrets -n fuel-friend \
  --from-literal=sendgrid-api-key=YOUR_SENDGRID_KEY \
  --from-literal=sendgrid-from-email=verified@yourdomain.com
```

3. **Deploy**
```bash
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/deployment.yaml
```

### GitHub Actions Setup

**Required Secrets:**
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password
- `KUBE_CONFIG`: Base64-encoded kubeconfig
- `K8S_DEPLOYMENT`: Combined k8s manifests (pvc + deployment + service)

**Auto-deploy on push to `main` branch**

## 🔧 Configuration

### SendGrid Setup

1. Create account: https://sendgrid.com
2. Generate API Key (Settings → API Keys) dengan **Full Access**
3. Verify sender email (Settings → Sender Authentication)
4. Update Kubernetes secret

### WhatsApp Session Management

**First Time Setup:**
1. Deploy service
2. Check logs: `kubectl logs -n fuel-friend -l app=otp-services -f`
3. Scan QR code dengan WhatsApp
4. Session tersimpan di PVC

**Session Persistence:**
- WhatsApp session disimpan di Kubernetes PVC
- Pod restart tidak perlu scan ulang
- Jika logout (error 401), hapus PVC dan scan ulang

**Troubleshooting:**
```bash
# Cek WhatsApp connection
kubectl logs -n fuel-friend -l app=otp-services --tail=50

# Reset WhatsApp session
kubectl delete pvc otp-whatsapp-pvc -n fuel-friend
kubectl delete pod -l app=otp-services -n fuel-friend

# Scan QR code baru
kubectl logs -n fuel-friend -l app=otp-services -f
```

## 🔗 Integration dengan Backend

**Fuel Friend Backend** sudah terintegrasi dengan OTP service:

```typescript
// Email OTP
const response = await fetch('http://otp-services.fuel-friend.svc.cluster.local:3000/api/otp/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, otp })
});

// WhatsApp OTP
const response = await fetch('http://otp-services.fuel-friend.svc.cluster.local:3000/api/otp/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber, otp })
});
```

## 📊 Monitoring

```bash
# Check service status
kubectl get pod -n fuel-friend -l app=otp-services

# View logs
kubectl logs -n fuel-friend -l app=otp-services --tail=100 -f

# Check WhatsApp connection
kubectl logs -n fuel-friend -l app=otp-services | grep "WhatsApp"

# Test endpoints
curl http://otp-services.fuel-friend.svc.cluster.local:3000/health
```

## 🐛 Common Issues

### Email "Forbidden" Error
- ✅ Verify sender email di SendGrid dashboard
- ✅ Check API key permissions (harus Full Access)
- ✅ Pastikan email di secret sama dengan yang diverifikasi

### WhatsApp Disconnect (401/515)
- **401**: Logged out → Hapus PVC, scan QR ulang
- **515**: Restart required → Auto-reconnect dalam 5 detik
- **405**: Version issue → Sudah fixed di v7.0.0-rc.9

### Pod Pending
- Check PVC status: `kubectl get pvc -n fuel-friend`
- Ensure storage class available: `kubectl get storageclass`

## 📝 License

MIT

## 👥 Author

Fuel Friend Team
