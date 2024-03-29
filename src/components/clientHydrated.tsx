"use client";

import { useEffect, useState } from "react";

export default function ClientHydrated({ children }: { children: React.ReactNode }) {
    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    if (!hasHydrated) {
        return null;
    }

    return children;
}
