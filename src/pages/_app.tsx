import "@/common/wdyr";
import "@/styles/globals.css";
import "@/components/App/App.css";
import "@/styles/catppuccin-macchiato.css";

import { Analytics } from "@vercel/analytics/react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { type PropsWithChildren } from "react";

import CustomLayout from "@/components/Layout/CustomLayout";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
    getLayout?: (props: PropsWithChildren) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const Layout = Component.getLayout || CustomLayout;

    return (
        <ThemeProvider
            attribute="class"
            storageKey="nightwind-mode"
            defaultTheme="light"
            disableTransitionOnChange
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <Analytics />
        </ThemeProvider>
    );
}

export default MyApp;
// export default dynamic(() => Promise.resolve(MyApp), { ssr: false });
