import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { ApiKeyType, ChatResponseStatus, GenerationSettings, GenerationSettingsState } from "@/types/types";
import type { NavBar } from "@/types/types";

const useSideBarState = create<NavBar>()((set) => ({
    leftNavExpanded: true,
    rightNavExpanded: false,
    toggleLeftNav: () => set((state: { leftNavExpanded: boolean }) => ({ leftNavExpanded: !state.leftNavExpanded })),
    toggleRightNav: () =>
        set((state: { rightNavExpanded: boolean }) => ({ rightNavExpanded: !state.rightNavExpanded })),
}));

export default useSideBarState;

const useApiKey = create<ApiKeyType>()((set) => ({
    apiKey: undefined,
    setApiKey: (apiKey: string) => set(() => ({ apiKey })),
}));

const useChatResponseStatus = create<ChatResponseStatus>()(
    devtools(
        (set, get) => ({
            inProgress: false,
            updateProgress: (status: boolean) => set(() => ({ inProgress: status })),
            getProgressStatus: () => get().inProgress,
        }),
        { store: "MyStore" },
    ),
);

const useGenerationSettings = create<GenerationSettingsState>()((set, get) => ({
    do_sample: false,
    max_new_tokens: 2048,
    temperature: 0.7,
    repetition_penalty: 1.2,
    top_p: 0.95,
    top_k: 50,
    setGenerationSettings: (settings: GenerationSettings) => set(() => ({ ...settings })),
    getGenerationSettings: () => get(),
}));

export { useApiKey, useChatResponseStatus, useGenerationSettings };
