"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BsRobot } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import { IconGitHub, IconSidebar } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import useSideBarState from "@/store/globalStore";
import type { NavBar } from "@/types/types";

export default function Header() {
    const [toggleLeftNav] = useSideBarState((state: NavBar) => [state.toggleLeftNav]);
    const [toggleRightNav] = useSideBarState((state: NavBar) => [state.toggleRightNav]);

    const [hydrated, setHydrated] = useState(false);

    // to force client component
    useEffect(() => {
        setHydrated(true);
    }, []);

    return (
        <header className=" z-50 flex h-12 w-full shrink-0 items-center justify-between border-b border-border px-4 ">
            <div className="flex items-center gap-4">
                <Button variant={"outline"} size={"icon"} onClick={toggleLeftNav}>
                    <IconSidebar className="text-xl" />
                </Button>
                <Link href={"/"} className="hover:text-inherit">
                    <div className="flex items-center gap-2 text-lg font-bold">
                        <BsRobot size={30} className="text-primary dark:text-primary-foreground" />
                        <span className="pt-2">Chatbot</span>
                    </div>
                </Link>
            </div>
            <div className="flex items-center gap-2 ">
                <b>Powered By:</b>{" "}
                <a href="https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1" target="_blank" rel="noreferrer">
                    <span className=" hover:text-primary">mistralai/Mixtral-8x7B-Instruct-v0.1</span>
                </a>
                {hydrated ? <ThemeToggle /> : null}
                <Button asChild variant="outline" size="icon">
                    <a href="https://github.com/gsaivinay/awesome-chatbot" target="_blank" rel="noreferrer">
                        <IconGitHub className="text-4xl hover:text-primary" />
                    </a>
                </Button>
                <Button variant={"outline"} size={"icon"} onClick={toggleRightNav}>
                    <IconSidebar className="text-xl" />
                </Button>
            </div>
        </header>
    );
}
