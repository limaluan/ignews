import { getSession } from "../../../node_modules/next-auth/react/index";
import { query as q } from "../../../node_modules/faunadb/index";
import { stripe } from "../../services/stripe";
import { fauna } from "../../services/fauna";

interface IUser {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string;
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    if (req.method === 'POST') {
        const session = await getSession({ req });

        const user = await fauna.query<IUser>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        if (!customerId) {
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
            })

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id,
                        }
                    }
                )
            )

            customerId = stripeCustomer.id;
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            mode: 'subscription',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            line_items: [
                { price: 'price_1JkEDkDSdEKAherRzFxVhaug', quantity: 1 }
            ],
            allow_promotion_codes: true,
        });

        return res.status(200).json({ sessionId: checkoutSession.id });
    } else {
        res.setHeader('Allow', 'Post');
        res.status(405).end('Method not allowed');
    }
}
