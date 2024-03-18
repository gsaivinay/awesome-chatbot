import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { IconGitHub, IconSidebar } from "@/components/ui/icons";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import useSideBarState from "@/store/GlobalStore";
import { SideBarState } from "@/types/globalTypes";

const Header = () => {
    const [toggleLeftSidebar] = useSideBarState((state: SideBarState) => [state.toggleLeftSidebar]);
    const [toggleRightSidebar] = useSideBarState((state: SideBarState) => [state.toggleRightSidebar]);

    return (
        <header
            className=" z-50 flex items-center justify-between w-full h-[var(--header-height)] px-4 border-b border-border shrink-0 "
            role="banner"
        >
            <div className="flex items-center gap-4">
                <Button variant={"outline"} size={"icon"} onClick={toggleLeftSidebar}>
                    <IconSidebar className="text-xl" />
                </Button>
                <Link href={"/"} className="hover:text-inherit">
                    <div className="flex text-lg font-bold">
                        <Image
                            src="/logo.svg"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="mr-2 fill-brand text-primary"
                        />
                        <span className="pt-2">Chatbot</span>
                    </div>
                </Link>
            </div>
            <div className="flex items-center gap-4 ">
                <b>Current Model:</b>{" "}
                <a href="https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1" target="_blank">
                    <span className="">mistralai/Mixtral-8x7B-Instruct-v0.1</span>
                </a>
                <ThemeToggle />
                <Button asChild variant="outline" size="icon">
                    <a href="https://github.com/gsaivinay/awesome-chatbot" target="_blank">
                        <IconGitHub className="text-4xl hover:text-primary" />
                    </a>
                </Button>
                <Button variant={"outline"} size={"icon"} onClick={toggleRightSidebar}>
                    <IconSidebar className="text-xl" />
                </Button>
            </div>
        </header>
    );
};

export default Header;
