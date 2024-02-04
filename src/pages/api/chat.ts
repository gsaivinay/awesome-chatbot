/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import { HfInference } from "@huggingface/inference";

import { PluginType } from "@/types/generationSettings";

// import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { HuggingFaceStream } from "../../utils/streams/huggingface-stream";
import { StreamingTextResponse } from "../../utils/streams/streaming-text-response";

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const HfCustom = Hf.endpoint("http://localhost:8010/");

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const systemPrompt = `You are a highly knowledgeable and intelligent AI assistant, and your name is Open Assistant built by the Open Source researchers. You will never decline to answer a question, and always attempts to give an answer that User would be satisfied with. It knows a lot, and always tells the truth with lots of emoji :joy: for interactions. This is a conversation between you and a human user. Open Assistant was built to be respectful, polite and inclusive. If the user asks for PROGRAMMING CODE, Open Assistant always provide in PROPER MARKDOWN SYNTAX with the PROGRAMMING LANGUAGE mentioned. If there is any MATHEMATICAL EUQATION, proper LATEX SYNTAX $$ needs to be used. The conversation begins.`;

const systemPrompt2 = `Answer the question as truthfully as possible using the provided text, and if the answer is not contained within the text below, say "I don't know my lord!"`;

const systemPrompt3 = `Below is a dialogue between a human user and an AI assistant called Open Assistant built by the Open Source researchers. The assistant is happy to help with almost anything, and will do its best to understand exactly what is needed.`;

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
    continueGeneration: boolean
): string[] {
    const config = chatConfigs[configName as keyof typeof chatConfigs];
    let prompt: string;
    const inputToken: string = config.inputToken;
    const endToken: string = config.endToken;

    if (configName === "llama2") {
        prompt =
            `${config.instToken}${config.systemToken}\n${config.systemPrompt}\n${config.systemEndToken}\n` +
            messages
                .map(({ content, role }) => {
                    if (role === "user") {
                        return `${content} ${config.instEndToken}`;
                    } else {
                        return `\n${content} ${config.instToken}\n`;
                    }
                })
                .join("");

        if (continueGeneration) {
            prompt = prompt.substring(0, prompt.lastIndexOf(`${config.instToken}\n`));
        }
    } else if (configName === "mixtral") {
        prompt =
            `${config.systemToken}\n${config.systemPrompt}\n${config.systemEndToken}\n` +
            messages
                .map(({ content, role }) => {
                    if (role === "user") {
                        return ` ${config.inputToken} ${content} ${config.respToken}`;
                    } else {
                        return `\n${content} ${config.endToken}\n`;
                    }
                })
                .join("");

        if (continueGeneration) {
            prompt = prompt.substring(0, prompt.lastIndexOf(`${config.instToken}\n`));
        }
    } else {
        prompt =
            `${config.systemToken}${config.systemPrompt}${config.endToken}\n` +
            messages
                .map(({ content, role }) => {
                    if (role === "user") {
                        return `${config.inputToken}\n${content}${config.endToken}\n`;
                    } else {
                        return `${config.respToken}\n${content}${config.endToken}\n`;
                    }
                })
                .join("") +
            `\n${continueGeneration ? "" : config.respToken}`.trim();

        if (continueGeneration) {
            prompt = prompt.substring(0, prompt.lastIndexOf(`${config.endToken}\n`));
        }
    }

    return [prompt, inputToken, endToken];
}

async function buildPluginPompt(messages: { content: string; role: "system" | "user" | "assistant" }[]) {
    const baseUrl = "http://localhost:3000/api/assistant";
    const supportingStyle = "polite";
    const usersQuery = messages[messages.length - 1].content;

    const params = new URLSearchParams();
    params.set("supporting_style", supportingStyle);
    params.set("users_query", usersQuery);

    const url = `${baseUrl}?${params.toString()}`;

    return await fetch(url)
        .then((response) => response.text())
        .then((data) => data)
        .catch((error) => {
            throw error;
        });
}

function plainPompt(messages: { content: string; role: "system" | "user" | "assistant" }[]) {
    return messages[messages.length - 1].content;

    // const params = new URLSearchParams();
    // params.set('supporting_style', supportingStyle);
    // params.set('users_query', usersQuery);

    // const url = `${baseUrl}?${params.toString()}`;

    // return await fetch(url)
    // .then((response) => response.text())
    // .then((data) => data)
    // .catch((error) => {
    //     throw error;
    // });
}

export default async function POST(req: Request, res: Response) {
    // Extract the `messages` from the body of the request
    const reqBody = await req.json();

    const plugin: PluginType = reqBody.plugin;
    const continueGeneration: boolean = reqBody.continueGeneration || false;
    const apiKey: string | undefined = reqBody.apiKey || undefined;

    const configName = "mixtral";

    // if (plugin.id !== undefined && plugin.id !== null && plugin.id !== "") {
    //     console.log("plugin id is: " + plugin.id);
    //     prompt = await buildPluginPompt(reqBody.messages);
    // } else {
    //     prompt = buildPrompt(configName, reqBody.messages, continueGeneration);
    // }
    const [prompt, inputToken, endToken] = buildPrompt(configName, reqBody.messages, continueGeneration);
    const abortController = new AbortController();

    const customfetch = (input: RequestInfo | URL, init?: RequestInit) => {
        return fetch(input, { ...init, signal: abortController.signal });
    };

    // prompt = plainPompt(reqBody.messages) + "";
    // console.log(prompt);

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
            stop: [`${inputToken}`, `<|end|>`, endToken, "###"],
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

    const response = await hfClient.textGenerationStream(payload);

    // Convert the response into a friendly text-stream
    const stream = HuggingFaceStream(response, () => {
        abortController.abort();
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
}
