import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ApiKeyType, CustomThemeType, SideBarState } from "../types/globalTypes";

const useSideBarState = create<SideBarState>()(
    persist(
        (set) => ({
            leftSidebarOpen: true,
            rightSidebarOpen: false,
            toggleLeftSidebar: () =>
                set((state: { leftSidebarOpen: boolean }) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
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
            setCurrentTheme: (currentTheme: string) => set(() => ({ currentTheme })),
        }),
        {
            storage: createJSONStorage(() => localStorage),
            name: "theme",
        }
    )
);

const useApiKey = create<ApiKeyType>()((set) => ({
    apiKey: undefined,
    setApiKey: (apiKey: string) => set(() => ({ apiKey })),
}));

export { useApiKey, useCustomTheme };
