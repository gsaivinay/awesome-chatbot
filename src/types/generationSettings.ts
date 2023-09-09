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

export type PluginType = {
    info: string | undefined;
    image: string | undefined;
    openapi: string | undefined;
    label: string | undefined;
    value: string | undefined;
    description: string | undefined;
    id: string | undefined;
};

export type PluginTypeState = PluginType & {
    setPlugin: (settings: PluginType) => void;
    getPlugin: () => PluginType;
};
