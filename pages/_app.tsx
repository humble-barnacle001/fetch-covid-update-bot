import type { AppProps } from "next/app";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import "../assests/github.css";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Query COVID-19 India Cases Bot</title>
                <meta
                    property='description'
                    content='Query COVID-19 daily cases count in Telegram'
                />
            </Head>
            <Component {...pageProps} />
            <Analytics />
        </>
    );
}
