import "../Components/App/App.css";
import "../Components/App/index.css";
import "../Components/App/nprogress.css";
import '@/Common/wdyr';

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import NProgress from "nprogress";
import { type PropsWithChildren,useEffect } from "react";

import { useCustomTheme } from "@/Store/GlobalStore";
import { CustomThemeType } from "@/types/globalTypes";

// import CustomLayout from "@/Components/Layout/CustomLayout";
const CustomLayout = dynamic(() => import("@/Components/Layout/CustomLayout"), {
    ssr: false,
    // loading: () => <Intro />,
});

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
    getLayout?: (props: PropsWithChildren) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const [currentTheme] = useCustomTheme((state: CustomThemeType) => [state.currentTheme]);
    const Layout = Component.getLayout || CustomLayout;
    const router = useRouter();
    NProgress.configure({
        template: `<div class="bar theme-${currentTheme}" role="bar"><div class="peg"></div></div>`
    });

    useEffect(() => {
        const handleStart = (_url: string) => {
            NProgress.start();
        };

        const handleStop = () => {
            NProgress.done();
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        };
    }, [router]);

    return (
        <ThemeProvider
            attribute="class"
            storageKey="nightwind-mode"
            defaultTheme="system" // default "light"
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    );
}

// export default MyApp;
export default dynamic(() => Promise.resolve(MyApp), { ssr: false });
