// server.js
const express = require('express');
const { GoogleAuth } = require('google-auth-library');
const cors = require('cors');

const app = express();
const port = 8081;

// --- CONFIGURATIO  N ---
// You no longer need the API Key here.
// The auth library will find your credentials from the gcloud command you ran.
const PROJECT_ID = 'utopian-bonito-347816'; // Your Project ID
const LOCATION_ID = 'global';
const CATALOG_ID = 'default_catalog';
const SERVING_CONFIG_ID = 'default_search';

const GOOGLE_API_ENDPOINT = `https://retail.googleapis.com/v2/projects/${PROJECT_ID}/locations/${LOCATION_ID}/catalogs/${CATALOG_ID}/servingConfigs/${SERVING_CONFIG_ID}:search`;

// --- MIDDLEWARE ---
app.use(cors({ origin: 'https://retail-ecom-266785126170.asia-southeast1.run.ap' }));
app.use(express.json());

// --- MAIN PROXY ENDPOINT ---
app.post('/', async (req, res) => {
  console.log('Proxying request to Google Retail API with OAuth2 token...');

  try {
    // 1. Initialize Google Auth and set the scope for the Retail API
    const auth = new GoogleAuth({
      projectId: 'utopian-bonito-347816', // <-- Add your correct Project ID here
      scopes: 'https://www.googleapis.com/auth/cloud-platform'
    });

    // 2. Get an authenticated client
    const client = await auth.getClient();
    
    // 3. Get the OAuth2 access token
    const accessToken = (await client.getAccessToken()).token;

    // 4. Make the request to Google, now using the Authorization header
    const response = await client.request({
      url: GOOGLE_API_ENDPOINT,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // Use Bearer token
        'Content-Type': 'application/json',
      },
      // Pass the request body from the frontend to the Google API
      data:{ ...req.body},
    });

    res.json(response.data);
    console.log(response);
  } catch (error) {
    console.error('Error in proxy server:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
        error: 'Internal Server Error', 
        details: error.response?.data || error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`CORS Proxy server running at http://localhost:${port}`);
});