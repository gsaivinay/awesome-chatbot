/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { create } from "zustand";
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { devtools } from "zustand/middleware";

import { ChatResponseStatus } from "@/types/chatMessageType";
import { GenerationSettings, GenerationSettingsState } from "@/types/generationSettings";

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

export { useChatResponseStatus, useGenerationSettings };
