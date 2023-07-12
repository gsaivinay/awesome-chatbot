/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { create } from "zustand";
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { ChatResponseStatus } from "@/types/chatMessageType";
import { GenerationSettings, GenerationSettingsState, PluginType, PluginTypeState } from "@/types/generationSettings";

const useChatResponseStatus = create<ChatResponseStatus>()(
    devtools(
        (set, get) => ({
            inProgress: false,
            updateProgress: (status: boolean) => set(() => ({ inProgress: status })),
            getProgressStatus: () => get().inProgress,
        }),
        { store: "MyStore" }
    )
);

const useGenerationSettings = create<GenerationSettingsState>()((set, get) => ({
    do_sample: true,
    max_new_tokens: 512,
    temperature: 0.9,
    repetition_penalty: 1.2,
    top_p: 0.95,
    top_k: 50,
    setGenerationSettings: (settings: GenerationSettings) => set(() => ({ ...settings })),
    getGenerationSettings: () => get(),
}));

const usePlugin = create<PluginTypeState>()((set, get) => ({
    info: "",
    image: "",
    openapi: "",
    label: "",
    value: "",
    description: "",
    id: "",
    setPlugin: (plugin: PluginType) => set(() => ({ ...plugin })),
    getPlugin: () => get(),
}));

export { useChatResponseStatus, useGenerationSettings, usePlugin };
