import "@/common/wdyr";
import "@/styles/globals.css";
import "@/components/App/App.css";
import "@/styles/catppuccin-macchiato.css";

import { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import Header from "@/components/Layout/Header";
import HydrationZustand from "@/components/Layout/HydrationZustand";
import LeftNavBar from "@/components/Layout/LeftNavBar";
import RightNavBar from "@/components/Layout/RightNavBar";

export const metadata: Metadata = {
    title: "Open Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <HydrationZustand>
                    <ThemeProvider
                        attribute="class"
                        storageKey="nightwind-mode"
                        defaultTheme="light"
                        disableTransitionOnChange
                    >
                        <div className={`container-core`}>
                            <Header />
                            <div className="content-main">
                                <LeftNavBar />
                                {children}
                                <RightNavBar />
                            </div>
                            {/* Footer */}
                            {/* <footer className='footer-main'>
                    <p>Copyright © 2023</p>
                </footer> */}
                        </div>
                    </ThemeProvider>
                </HydrationZustand>
            </body>
        </html>
    );
}
