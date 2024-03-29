import "@/styles/catppuccin-macchiato.css";
import "@/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";

import RightNavBar from "@/components/controlNav";
import Header from "@/components/header";
import { Providers } from "@/components/providers";
import LeftNavBar from "@/components/sideNav";

export const metadata: Metadata = {
    title: "Open Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers
                    attribute="class"
                    storageKey="nightwind-mode"
                    defaultTheme="system"
                    disableTransitionOnChange
                >
                    <div className="flex h-screen w-screen flex-col items-stretch">
                        <Header />
                        <div className="flex min-h-0 min-w-0 flex-1 grow items-stretch justify-between rounded-md border-border">
                            <LeftNavBar />
                            {children}
                            <RightNavBar />
                        </div>
                    </div>
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}
