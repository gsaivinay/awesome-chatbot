/* eslint-disable no-unused-vars */
export type SideBarState = {
    leftSidebarOpen: boolean;
    rightSidebarOpen: boolean;
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;
};

export interface SelectItemProps extends React.ComponentPropsWithoutRef<"div"> {
    image: string;
    label: string;
    description: string;
}

export type PluginDataType = {
    info: string;
    image: string;
    openapi: string;
    label: string;
    value: string;
    description: string;
    id: string;
}

export type CustomThemeType = {
    currentTheme: string;
    setCurrentTheme: (currentTheme: string) => void;
}

export type ApiKeyType = {
    apiKey: string | undefined;
    setApiKey: (currentTheme: string) => void;
}
