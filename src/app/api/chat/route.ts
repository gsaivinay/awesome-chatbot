/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const HfCustom = Hf.endpoint("http://localhost:8010/");

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const systemPrompt =
    "You are a highly knowledgeable and intelligent AI assistant, and your name is Open Assistant built by the Open Source researchers. Below is a dialogue between a human user and you, the AI assistant. The assistant is happy to help with almost anything, and will do its best to understand exactly what is needed. Conversation begins.";

type ChatConfig = {
    inputToken: string;
    respToken: string;
    systemToken: string;
    systemEndToken?: string;
    endToken: string;
    instToken?: string;
    instEndToken?: string;
    systemPrompt?: string;
};

// Configuration for different chat systems
const chatConfigs: Record<string, ChatConfig> = {
    llama2: {
        inputToken: "[INST]",
        respToken: "[/INST]",
        systemToken: "<<SYS>>",
        systemEndToken: "<</SYS>>",
        endToken: "</s>",
        instToken: "[INST]",
        instEndToken: "[/INST]",
        systemPrompt: systemPrompt,
    },
    mixtral: {
        inputToken: "[INST]",
        respToken: "[/INST]",
        systemToken: "<<SYS>>",
        systemEndToken: "<</SYS>>",
        endToken: "</s>",
        systemPrompt: systemPrompt,
    },
    falcon: {
        inputToken: "User",
        respToken: "OpenAssistant",
        systemToken: ">>INTRODUCTION<<",
        endToken: "<|endoftext|>",
        systemPrompt: systemPrompt,
    },
    starchat: {
        inputToken: "<|user|>",
        respToken: "<|assistant|>",
        systemToken: "<|system|>",
        endToken: "<|endoftext|>",
        systemPrompt: systemPrompt,
    },
    openassistantOrcaLlama: {
        inputToken: "<|prompter|>",
        respToken: "<|assistant|>",
        systemToken: "<|system|>",
        endToken: "</s>",
        systemPrompt: systemPrompt,
    },
    openOrcaPreview2: {
        inputToken: "<|user|>",
        respToken: "<|bot|>",
        systemToken: "",
        endToken: "<|end_of_turn|>",
        systemPrompt: systemPrompt,
    },
    vicuna: {
        inputToken: "### Input:",
        respToken: "### Response:",
        systemToken: "### Instruction:",
        endToken: "</s>",
        systemPrompt: systemPrompt,
    },
    guanaco: {
        inputToken: "### Input:",
        respToken: "### Human:",
        systemToken: "### Assistant:",
        endToken: "</s>",
        systemPrompt: systemPrompt,
    },
};

// Build a prompt from the messages
function buildPrompt(
    configName: string,
    messages: { content: string; role: "system" | "user" | "assistant" }[],
    continueGeneration: boolean,
): string[] {
    const config = chatConfigs[configName as keyof typeof chatConfigs];
    let prompt: string;
    const inputToken: string = config.inputToken;
    const endToken: string = config.endToken;

    if (configName === "llama2") {
        prompt = `${config.instToken}${config.systemToken}\n${config.systemPrompt}\n${config.systemEndToken}\n${messages
            .map(({ content, role }) => {
                if (role === "user") {
                    return `${content} ${config.instEndToken}`;
                }
                return `\n${content} ${config.instToken}\n`;
            })
            .join("")}`;

        if (continueGeneration) {
            prompt = prompt.substring(0, prompt.lastIndexOf(`${config.instToken}\n`));
        }
    } else if (configName === "mixtral") {
        prompt = `${config.systemToken}\n${config.systemPrompt}\n${config.systemEndToken}\n${messages
            .map(({ content, role }) => {
                if (role === "user") {
                    return ` ${config.inputToken} ${content} ${config.respToken}`;
                }
                return `\n${content} ${config.endToken}\n`;
            })
            .join("")}`;

        if (continueGeneration) {
            prompt = prompt.substring(0, prompt.lastIndexOf(`${config.instToken}\n`));
        }
    } else {
        prompt = `${config.systemToken}${config.systemPrompt}${config.endToken}\n${messages
            .map(({ content, role }) => {
                if (role === "user") {
                    return `${config.inputToken}\n${content}${config.endToken}\n`;
                }
                return `${config.respToken}\n${content}${config.endToken}\n`;
            })
            .join("")}${`\n${continueGeneration ? "" : config.respToken}`.trim()}`;

        if (continueGeneration) {
            prompt = prompt.substring(0, prompt.lastIndexOf(`${config.endToken}\n`));
        }
    }

    return [prompt, inputToken, endToken];
}

export async function POST(req: Request, res: Response) {
    // Extract the `messages` from the body of the request
    const reqBody = await req.json();

    const continueGeneration: boolean = reqBody.continueGeneration || false;
    const apiKey: string | undefined = reqBody.apiKey || undefined;

    const configName = "mixtral";

    const [prompt, inputToken, endToken] = buildPrompt(configName, reqBody.messages, continueGeneration);
    const abortController = new AbortController();

    const customfetch = (input: RequestInfo | URL, init?: RequestInit) => {
        return fetch(input, { ...init, signal: abortController.signal });
    };

    const payload = {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        inputs: prompt,
        parameters: {
            max_new_tokens: reqBody.max_new_tokens,
            do_sample: reqBody.do_sample,
            temperature: reqBody.temperature,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
            // typical_p: 0.7,
            top_k: reqBody.top_k,
            top_p: reqBody.top_p,
            repetition_penalty: reqBody.repetition_penalty,
            truncate: 12000,
            return_full_text: false,
            stop: [`${inputToken}`, "<|end|>", endToken, "###"],
            // stop: ["<|endoftext|>", "<|user|>", "</s>", instToken_Llama2],
            details: true,
            watermark: false,
            decoder_input_details: false,
            use_cache: false,
        },
    };

    // console.log(payload);

    let hfClient = Hf;
    if (apiKey) {
        hfClient = new HfInference(apiKey);
    }

    const response = hfClient.textGenerationStream(payload);
    const stream = HuggingFaceStream(response);
    return new StreamingTextResponse(stream);
}
