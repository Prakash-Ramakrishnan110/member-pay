const express = require('express');
const cors = require('cors');
const { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Store active sessions
const sessions = new Map();

// Helper to handle WhatsApp connection
async function connectToWhatsApp(businessId, res = null) {
  const authFolder = `./auth_info_baileys_${businessId}`;
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && res) {
      // Send QR code as base64 to the frontend
      try {
        const qrBase64 = await QRCode.toDataURL(qr);
        res.json({ success: true, qr: qrBase64 });
        res = null; // Ensure we only respond once
      } catch (err) {
        if (res) res.status(500).json({ error: 'Failed to generate QR code' });
      }
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect.error?.output?.statusCode;
      // 401 is loggedOut. We should attempt to reconnect on 428 (Connection Closed) and 515 (Restart Required)
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      console.log(`Connection closed for ${businessId}. Error Code: ${statusCode}. Reconnecting:`, shouldReconnect);
      sessions.delete(businessId);
      
      if (shouldReconnect) {
        // Pass res down if reconnecting so we can still respond
        setTimeout(() => connectToWhatsApp(businessId, res), 3000);
      } else {
        // User logged out or session is corrupt, clear auth folder
        try {
          fs.rmSync(authFolder, { recursive: true, force: true });
          console.log(`Cleared corrupted/logged-out session for ${businessId}`);
        } catch(e) {}
        
        if (res) {
          res.status(500).json({ error: 'Failed to connect. WhatsApp rejected the connection. (Error ' + statusCode + ')' });
          res = null;
        }
      }
    } else if (connection === 'open') {
      console.log(`Connection opened for ${businessId}`);
      sessions.set(businessId, sock);
      
      // If we had a response object pending but no QR was needed (already authed)
      if (res) {
        res.json({ success: true, message: 'Already connected' });
        res = null;
      }

      // TODO: Here we could trigger a webhook to MemberPay to update the DB status to 'connected'
    }
  });

  return sock;
}

// Endpoint to start/get a session
app.post('/api/sessions/:businessId', async (req, res) => {
  const { businessId } = req.params;
  
  if (sessions.has(businessId)) {
    return res.json({ success: true, message: 'Already connected' });
  }

  // Start the connection process, passing res so it can send back the QR code if needed
  connectToWhatsApp(businessId, res).catch(err => {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to initialize WhatsApp session' });
    }
  });
});

// Endpoint to send a message
app.post('/api/send-message', async (req, res) => {
  const { businessId, phone, message } = req.body;

  if (!businessId || !phone || !message) {
    return res.status(400).json({ error: 'Missing businessId, phone, or message' });
  }

  const sock = sessions.get(businessId);
  if (!sock) {
    return res.status(400).json({ error: 'Session not connected for this business' });
  }

  try {
    // Format phone number to JID
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    
    // If it's exactly 10 digits, assume it's an Indian number and add 91
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    
    const jid = cleanPhone + '@s.whatsapp.net';
    
    console.log(`Checking if ${jid} exists on WhatsApp...`);
    const [result] = await sock.onWhatsApp(jid);
    
    if (!result || !result.exists) {
      console.log(`${jid} is not on WhatsApp.`);
      return res.status(400).json({ error: 'This phone number is not registered on WhatsApp.' });
    }

    console.log(`Sending message to ${result.jid}...`);
    await sock.sendMessage(result.jid, { text: message });
    console.log(`Message sent successfully to ${result.jid}`);
    
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Load existing sessions on startup
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`WhatsApp Microservice running on port ${port}`);
  
  // Reconnect saved sessions
  const folders = fs.readdirSync('./').filter(f => f.startsWith('auth_info_baileys_'));
  for (const folder of folders) {
    const businessId = folder.replace('auth_info_baileys_', '');
    console.log(`Reconnecting session for ${businessId}...`);
    connectToWhatsApp(businessId);
  }
});
