import { SessionProvider } from "../../node_modules/next-auth/react/index";
import { AppProps } from "../../node_modules/next/app";
import { Header } from "../components/Header/index";

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider>
            <Header />
            <Component {...pageProps} />
        </SessionProvider>
    )
}

export default MyApp
