import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';

let sock: any = null;
let isConnected = false;

export const initializeWhatsApp = async () => {
  try {
    console.log('🔄 Initializing WhatsApp...');
    
    const authPath = '/app/auth_info_baileys';
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    
    sock = makeWASocket({
      auth: state,
      logger: {
        level: 'error',
        child: () => ({ level: 'error', trace: () => {}, debug: () => {}, info: () => {}, warn: () => {}, error: () => {}, fatal: () => {} }),
        trace: () => {}, debug: () => {}, info: () => {}, warn: () => {}, error: () => {}, fatal: () => {}
      }
    });

    sock.ev.on('connection.update', (update: any) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        console.log('📱 Scan QR code:');
        qrcode.generate(qr, { small: true });
      }
      
      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        isConnected = false;
        console.log('❌ WhatsApp disconnected:', statusCode);
        
        if (statusCode === 401 || statusCode === 515) {
          // Clear auth and reconnect to get new QR
          console.log('🔄 Clearing auth and generating new QR...');
          sock = null;
          setTimeout(() => initializeWhatsApp(), 3000);
        } else if (shouldReconnect) {
          console.log('🔄 Reconnecting in 5s...');
          sock = null;
          setTimeout(() => initializeWhatsApp(), 5000);
        } else {
          sock = null;
        }
      } else if (connection === 'open') {
        console.log('✅ WhatsApp connected');
        isConnected = true;
      }
    });

    sock.ev.on('creds.update', saveCreds);
  } catch (error: any) {
    console.error('❌ WhatsApp error:', error.message);
    setTimeout(() => initializeWhatsApp(), 10000);
  }
};

export const sendWhatsAppOTP = async (phoneNumber: string, otp: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!sock || !isConnected) {
      return { success: false, error: 'WhatsApp not connected' };
    }

    let formattedNumber = phoneNumber.replace(/\D/g, '');
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '62' + formattedNumber.substring(1);
    } else if (!formattedNumber.startsWith('62')) {
      formattedNumber = '62' + formattedNumber;
    }
    
    const jid = `${formattedNumber}@s.whatsapp.net`;
    const message = `Your verification code is: ${otp}\n\nExpires in 10 minutes.`;

    await sock.sendMessage(jid, { text: message });
    console.log('✅ OTP sent to:', formattedNumber);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Send error:', error.message);
    return { success: false, error: error.message };
  }
};
