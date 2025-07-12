require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const delegationLink = 'https://tinyurl.com/FFdelegation';
const helpticketLink = 'https://tinyurl.com/helptikt';
const stockfinderLink = 'https://tinyurl.com/stockfinder1';

app.post('/webhook', async (req, res) => {
  const message = req.body.message?.text?.body || req.body.message?.text || req.body.message?.body;
  const from = req.body.user?.phone || req.body.message?.from;

  console.log('Webhook received:', message, 'from', from);

  if (message && message.trim() === '/') {
    const menu = `welcome please select any option from below
1. delegation
2. helpticket
3. Stock Enquiry`;
    await sendWhatsAppMessage(from, menu);
    return res.sendStatus(200);
  }

  if (message && message.trim() === '1') {
    await sendWhatsAppMessage(from, delegationLink);
    return res.sendStatus(200);
  }

  if (message && message.trim() === '2') {
    await sendWhatsAppMessage(from, helpticketLink);
    return res.sendStatus(200);
  }

  if (message && message.trim() === '3') {
    await sendWhatsAppMessage(from, stockfinderLink);
    return res.sendStatus(200);
  }

  // Ignore any other input
  res.sendStatus(200);
});

async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `https://api.maytapi.com/api/${process.env.MAYTAPI_PRODUCT_ID}/${process.env.MAYTAPI_PHONE_ID}/sendMessage`,
      {
        to_number: to,
        type: "text",
        message: message
      },
      {
        headers: {
          'x-maytapi-key': process.env.MAYTAPI_API_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});
