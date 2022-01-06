import type { AppProps } from "next/app";
import "../assests/github.css";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
        </>
    );
}
