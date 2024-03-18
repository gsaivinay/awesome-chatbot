"use client";

import { useTheme } from "next-themes";
import { useTransition } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();
    const [_, startTransition] = useTransition();

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => {
                startTransition(() => {
                    setTheme(theme === "light" ? "dark" : "light");
                });
            }}
        >
            {!theme ? null : theme === "dark" ? (
                <FiMoon className="transition-all" />
            ) : (
                <FiSun className="transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
