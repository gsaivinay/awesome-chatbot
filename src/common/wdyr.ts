/**
 * WDYR (why-did-you-render) helps locate unnecessary re-renders.
 * Applied in development environment, on the frontend only.
 *
 * It will only log unnecessary re-renders, not expected re-renders.
 *
 * @see https://github.com/welldone-software/why-did-you-render
 * @see https://github.com/vercel/next.js/tree/canary/examples/with-why-did-you-render
 */
import React from "react";

if (process.env.NODE_ENV === "development") {
    if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const whyDidYouRender = require("@welldone-software/why-did-you-render");

        // eslint-disable-next-line no-console
        console.log(
            "Applying whyDidYouRender, to help you locate unnecessary re-renders during development. See https://github.com/welldone-software/why-did-you-render",
        );

        // See https://github.com/welldone-software/why-did-you-render#options
        whyDidYouRender(React, {
            onlyLogs: true,
            titleColor: "green",
            diffNameColor: "purple",
            diffPathColor: "orange",
            trackAllPureComponents: true,
            trackHooks: true,
            logOwnerReasons: true,
            collapseGroups: true,
            hotReloadBufferMs: 500,
            trackExtraHooks: [[require("zustand"), "useConversationStore", "useConversationEntityStore"]],
        });
    }
}
