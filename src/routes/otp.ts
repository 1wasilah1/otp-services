import { Router } from 'express';
import { sendEmailOTP } from '../services/email';
import { sendWhatsAppOTP } from '../services/whatsapp';
import { generateOTP, saveOTP, verifyOTP } from '../otp';

const router = Router();

router.post('/email/send', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email required' });
  }

  const otpCode = otp || generateOTP();
  saveOTP(email, otpCode);

  const result = await sendEmailOTP(email, otpCode);
  res.status(result.success ? 200 : 500).json(result);
});

router.post('/email/verify', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP required' });
  }

  const result = verifyOTP(email, otp);
  res.status(result.success ? 200 : 400).json(result);
});

router.post('/whatsapp/send', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: 'Phone number required' });
  }

  const otpCode = otp || generateOTP();
  saveOTP(phoneNumber, otpCode);

  const result = await sendWhatsAppOTP(phoneNumber, otpCode);
  res.status(result.success ? 200 : 500).json(result);
});

router.post('/whatsapp/verify', async (req, res) => {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, error: 'Phone number and OTP required' });
  }

  const result = verifyOTP(phoneNumber, otp);
  res.status(result.success ? 200 : 400).json(result);
});

export default router;
