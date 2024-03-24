"use client";

import { useEffect, useState } from "react";

export default function HydrationZustand({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    // Wait till Next.js rehydration completes
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return <>{isHydrated ? <div>{children}</div> : null}</>;
}
