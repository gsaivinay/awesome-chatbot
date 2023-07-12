import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CustomThemeType, SideBarState } from "../types/globalTypes";

const useSideBarState = create<SideBarState>()(
    persist(
        (set) => ({
            leftSidebarOpen: true,
            rightSidebarOpen: false,
            toggleLeftSidebar: () => set((state: { leftSidebarOpen: boolean }) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
            toggleRightSidebar: () =>
                set((state: { rightSidebarOpen: boolean }) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
        }),
        {
            storage: createJSONStorage(() => localStorage),
            name: "sidebar-status",
        }
    )
);

export default useSideBarState;

const useCustomTheme = create<CustomThemeType>()(
    persist(
        (set) => ({
            currentTheme: "goldsand",
            setCurrentTheme: (currentTheme: string) => set(() => ({currentTheme})),
        }),
        {
            storage: createJSONStorage(() => localStorage),
            name: "theme",
        }
    )
);

export { useCustomTheme };
