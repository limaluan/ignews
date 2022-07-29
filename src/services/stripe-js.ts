import { loadStripe } from "../../node_modules/@stripe/stripe-js/pure";

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

    return stripeJs;
}
