import { useSession, signIn } from "../../../node_modules/next-auth/react/index";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface ISubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: ISubscribeButtonProps) {
    const { data: session } = useSession();

    const handleSubscribe = async () => {
        if (!session) {
            return signIn('github');
        }

        try {
            const response = await api.post('createCheckout');

            const { sessionId } = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({sessionId});
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}
