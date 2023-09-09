import { PropsWithChildren } from "react";

import Header from "@/Components/Layout/Header";
import LeftNavBar from "@/Components/Layout/LeftNavBar";
import RightNavBar from "@/Components/Layout/RightNavBar";
import { useCustomTheme } from "@/Store/GlobalStore";
import { CustomThemeType } from "@/types/globalTypes";

import HydrationZustand from "./HydrationZustand";

const CustomLayout: React.FC<PropsWithChildren> & { whyDidYouRender: boolean } = ({ children }) => {
    const [currentTheme] = useCustomTheme((state: CustomThemeType) => [state.currentTheme]);

    return (
        <HydrationZustand>
            <div className={`container-core theme-${currentTheme}`}>
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
        </HydrationZustand>
    );
};

CustomLayout.displayName = "CustomLayout";
CustomLayout.whyDidYouRender = true;
export default CustomLayout;
