// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Webhook endpoint to receive messages from Maytapi
app.post('/webhook', async (req, res) => {
  // Log every incoming webhook request for debugging
  console.log('Webhook received:', JSON.stringify(req.body, null, 2));

  // Safely extract message and sender info
  const message = req.body.message?.text?.body;
  const from = req.body.message?.from;

  // If the message is "/", send the menu
  if (message === '/') {
    const reply = `welcome please select any option from below
1. delegation
2. helpticket
3. Stock Enquiry`;

    // Send the reply using Maytapi API
    try {
      const response = await axios.post(
        `https://api.maytapi.com/api/${process.env.MAYTAPI_PRODUCT_ID}/sendMessage`,
        {
          to_number: from,
          type: "text",
          message: reply
        },
        {
          headers: {
            'x-maytapi-key': process.env.MAYTAPI_API_TOKEN,
            'Content-Type': 'application/json'
          }
        }
      );
      // Log the response from Maytapi for debugging
      console.log('Message sent! Maytapi response:', response.data);
    } catch (error) {
      // Log any error that occurs while sending the message
      console.error('Error sending message:', error.response?.data || error.message);
    }
  }

  // Always respond with status 200 to acknowledge receipt
  res.sendStatus(200);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot running on port ${PORT}`);
});
