import { Router } from 'express';
import { sendEmailOTP } from '../services/email';
import { sendWhatsAppOTP } from '../services/whatsapp';

const router = Router();

router.post('/email/send', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP required' });
  }

  const result = await sendEmailOTP(email, otp);
  res.status(result.success ? 200 : 500).json(result);
});

router.post('/whatsapp/send', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, error: 'Phone number and OTP required' });
  }

  const result = await sendWhatsAppOTP(phoneNumber, otp);
  res.status(result.success ? 200 : 500).json(result);
});

export default router;
