import { PropsWithChildren } from "react";

import Header from "@/components/Layout/Header";
import LeftNavBar from "@/components/Layout/LeftNavBar";
import RightNavBar from "@/components/Layout/RightNavBar";
import { useCustomTheme } from "@/store/GlobalStore";
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
