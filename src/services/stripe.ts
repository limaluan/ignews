export const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY, {
    apiVersion: '2020-08-27',
    appInfo: {
        name: 'Ignews',
        version: '0.1.0',
    }
});
