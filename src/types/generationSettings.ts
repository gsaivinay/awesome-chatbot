export type GenerationSettings = {
    max_new_tokens: number;
    do_sample: boolean | string;
    temperature: number;
    repetition_penalty: number;
    top_k: number;
    top_p: number;
};

export type GenerationSettingsState = GenerationSettings & {
    setGenerationSettings: (settings: GenerationSettings) => void;
    getGenerationSettings: () => GenerationSettings;
};
