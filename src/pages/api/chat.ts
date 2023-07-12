/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import { HfInference } from "@huggingface/inference";

import { PluginType } from "@/types/generationSettings";
import { HuggingFaceStream } from "@/utils/streams/huggingface-stream";
import { StreamingTextResponse } from "@/utils/streams/streaming-text-response";
// import { HuggingFaceStream, StreamingTextResponse } from "ai";

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const HfCustom = Hf.endpoint('http://localhost:8010/');

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

// Falcon
// const inputToken = "User";
// const respToken = "Open Assistant";
// const systemToken = ">>INTRODUCTION<<";
// const endToken = "<|endoftext|>";

// Starchat
const inputToken = "<|user|>";
const respToken = "<|assistant|>";
const systemToken = "<|system|>";
const endToken = "<|end|>";

// Vicuna
// const inputToken = "### Input:";
// const respToken = "### Response:";
// const systemToken = "### Instruction:";
// const endToken = "</s>";

// Guanaco
// const inputToken = "### Input:";
// const respToken = "### Human:";
// const systemToken = "### Assistant:";
// const endToken = "</s>";

const systemPrompt = `You are a highly knowledgeable and intelligent AI assistant, and your name is Open Assistant built by the Open Source researchers. You will never decline to answer a question, and always attempts to give an answer that User would be satisfied with. It knows a lot, and always tells the truth with lots of emoji :joy: for interactions. This is a conversation between you and a human user. Open Assistant was built to be respectful, polite and inclusive. If the user asks for PROGRAMMING CODE, Open Assistant always provide in PROPER MARKDOWN SYNTAX with the PROGRAMMING LANGUAGE mentioned. If there is any MATHEMATICAL EUQATION, proper LATEX SYNTAX $$ needs to be used. The conversation begins.`;

const systemPrompt2 = `Answer the question as truthfully as possible using the provided text, and if the answer is not contained within the text below, say "I don't know my lord!"`;

const systemPrompt3 = `Below is a dialogue between a human user and an AI assistant called Open Assistant built by the Open Source researchers. The assistant is happy to help with almost anything, and will do its best to understand exactly what is needed.`;

// Build a prompt from the messages
function buildPompt(
    messages: { content: string; role: "system" | "user" | "assistant" }[],
    continueGeneration: boolean
): string {
    // console.log("building prompt...", continueGeneration);
    const prompt =
        `${systemToken}\n${systemPrompt}\n${endToken}\n` +
        messages
            .map(({ content, role }) => {
                if (role === "user") {
                    return `${inputToken}\n${content}${endToken}\n`;
                } else {
                    return `${respToken}\n${content}${endToken}\n`;
                }
            })
            .join("") +
        `\n${continueGeneration ? "" : respToken}`.trim();

    if (continueGeneration) {
        return prompt.substring(0, prompt.lastIndexOf(`${endToken}\n`));
    } else {
        return `${prompt}\n`;
    }
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

export default async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const reqBody = await req.json();

    const plugin: PluginType = reqBody.plugin;
    const continueGeneration: boolean = reqBody.continueGeneration || false;
    const apiKey: string | undefined = reqBody.apiKey || undefined;
    let prompt: string;

    if (plugin.id !== undefined && plugin.id !== null && plugin.id !== "") {
        // console.log("plugin id is: " + plugin.id);
        prompt = await buildPluginPompt(reqBody.messages);
    } else {
        prompt = buildPompt(reqBody.messages, continueGeneration);
    }

    // prompt = plainPompt(reqBody.messages) + "";

    const payload = {
        model: "HuggingFaceH4/starchat-beta",
        // model: "tiiuae/falcon-7b-instruct",
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
            // repetition_penalty: reqBody.repetition_penalty,
            truncate: 7168,
            return_full_text: false,
            // seed: 42,
            // seed: 17525618,
            seed: 774221563936302000,
            // seed: 774221563936302000
            // seed: 774221563936302000
            // stop: [`${inputToken}`, `\n${inputToken}`, endToken, "###", ],
            stop: ["<|endoftext|>", "<|user|>", "<|end|>"],
            details: true,
            use_cache: false,
        },
        // parameters: {
        //     max_new_tokens: 512,
        //     do_sample: false,
        //     // temperature: 0.3,
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
        //     // typical_p: 0.7,
        //     // top_k: 50,
        //     // top_p: 0.95,
        //     repetition_penalty: 1.2,
        //     truncate: 1000,
        //     return_full_text: false,
        //     stop: [`\n${inputToken}`, endToken],
        // },
    };

    // console.log(payload);

    let hfClient = Hf;
    if(apiKey) {
        hfClient = new HfInference(apiKey);
    }

    const response = await hfClient.textGenerationStream(payload);

    // Convert the response into a friendly text-stream
    const stream = HuggingFaceStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}
