import Head from "../../node_modules/next/head";
import { GetStaticProps } from "../../node_modules/next/types/index";
import { SubscribeButton } from "../components/SubscribeButton/index";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

interface IProductProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: IProductProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl Coding" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JkEDkDSdEKAherRzFxVhaug');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: "currency",
      currency: "USD"
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}
