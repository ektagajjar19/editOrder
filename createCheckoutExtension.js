const fetch = require('node-fetch');

// Shopify store and API credentials
const shop = 'your-shop-name.myshopify.com';
const accessToken = 'your-access-token';

// Endpoint URL for Checkout Extensions
const endpoint = `https://${shop}/admin/api/2023-01/checkouts.json`;

// Example Checkout Extension data
const checkoutExtensionData = {
  checkout_extension: {
    type: 'post_checkout',
    target: 'body',
    content: '<script src="https://your-app-domain.com/path/to/your/script.js"></script>'
  }
};

// Function to create Checkout Extension
const createCheckoutExtension = async () => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify(checkoutExtensionData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Checkout Extension created:', data);
    return data;
  } catch (error) {
    console.error('Error creating Checkout Extension:', error);
    throw error;
  }
};

// Call function to create Checkout Extension
createCheckoutExtension();
