// import { version } from "../../package.json";

export const stripe = require('stripe')(process.env.STRIPE_PUBLIC_API_KEY);
