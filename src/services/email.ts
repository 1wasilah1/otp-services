import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@fuelagent.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export const sendEmailOTP = async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!SENDGRID_API_KEY) {
      return { success: false, error: 'SendGrid not configured' };
    }

    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
      html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`
    });

    console.log('✅ Email OTP sent to:', email);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};
