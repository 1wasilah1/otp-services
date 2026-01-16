import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeWhatsApp } from './services/whatsapp';
import otpRoutes from './routes/otp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'otp-services' });
});

app.use('/api/otp', otpRoutes);

initializeWhatsApp().catch(console.error);

app.listen(PORT, () => {
  console.log(`🚀 OTP Service running on port ${PORT}`);
});
