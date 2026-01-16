interface OTPData {
  otp: string;
  expiresAt: number;
}

const otpStore = new Map<string, OTPData>();

export const saveOTP = (identifier: string, otp: string): void => {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(identifier.toLowerCase(), { otp, expiresAt });
  console.log(`💾 OTP saved for ${identifier}: ${otp}`);
};

export const verifyOTP = (identifier: string, otp: string): { success: boolean; message?: string; error?: string } => {
  const normalizedIdentifier = identifier.toLowerCase();
  const stored = otpStore.get(normalizedIdentifier);

  if (!stored) {
    return { success: false, error: 'OTP not found or expired' };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedIdentifier);
    return { success: false, error: 'OTP expired' };
  }

  if (stored.otp !== otp) {
    return { success: false, error: 'Invalid OTP' };
  }

  otpStore.delete(normalizedIdentifier);
  return { success: true, message: 'OTP verified successfully' };
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
