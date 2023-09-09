/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */

import { Message, SourceTypes } from "../../types/chatMessageType";

const prefix = `Instruction: As a language model, your task is to answer questions based on a given context. To do this effectively, carefully read and understand the context, pay attention to important details and key phrases that relate to the question, and provide a clear and concise response that directly addresses the question.

Context:

The Great Barrier Reef is the world's largest coral reef system off the coast of Australia, home to diverse marine life, including thousands of species of fish, turtles, sharks, and rays. However, the reef is under threat from climate change, ocean acidification, and pollution, causing more frequent and severe coral bleaching events and significant damage.

Question: What is the Great Barrier Reef and what makes it special?
Answer: The Great Barrier Reef is the world's largest coral reef system off the coast of Australia, home to diverse marine life, including thousands of species of fish, turtles, sharks, and rays.
###
Question: What threatens the Great Barrier Reef?
Answer: The Great Barrier Reef is threatened by climate change, ocean acidification, and pollution causing more frequent and severe coral bleaching events and significant damage.
###


Context:

The COVID-19 pandemic is a global health crisis caused by a highly infectious virus that first emerged in late 2019. Governments have implemented a range of measures to slow the spread of the virus, including lockdowns, social distancing, and vaccination campaigns. These measures have had significant economic, social, and psychological impacts.

Question: What is the COVID-19 pandemic and why is it a global health crisis?
Answer: The COVID-19 pandemic is a global health crisis caused by a highly infectious virus that emerged in late 2019.
###
Question: What measures have governments taken to slow the spread of COVID-19?
Answer: Governments have implemented measures to slow the spread of COVID-19, including lockdowns, social distancing, and vaccination campaigns.
###


`;

interface similarityResp {
    results: [
        {
            query: "string";
            results: [
                {
                    id: "string";
                    text: "string";
                    metadata: {
                        source_id: "string";
                        url: "string";
                        created_at: "string";
                        author: "string";
                        document_id: "string";
                    };
                    embedding: [0];
                    score: 0;
                }
            ];
        }
    ];
}

const getResponseForInput = async (
    text: string,
    generateFurther: string | null,
    onResponseCallback?: (status: boolean) => void,
    addMessage?: (botResponse: Message) => void
) => {
    // Perform API call
    const similaritySearchBody = {
        queries: [
            {
                query: text,
                top_k: 3,
            },
        ],
    };
    const context: string[] = [];
    const sources: string[] = [];
    let matchedDocs: {
        text: "string";
        source: "string";
    }[];
    return fetch("http://127.0.0.1:8030/get_smiliarities", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(similaritySearchBody),
    })
        .then((response) => response.json())
        .then(async (data: similarityResp) => {
            // console.log(data);
            matchedDocs = data.results[0].results.map((result) => {
                return {
                    text: result.text,
                    source: result.metadata.url,
                };
            });
            await fetch("http://127.0.0.1:8010/invocations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: {
                        text_inputs: `${prefix}\n\n${matchedDocs
                            .reduce((_text, doc) => `${_text}${doc.text}. `, "Context:\n\n")
                            .trim()}\n\nQuestion: ${text}\nAnswer:`,
                        parameters: {
                            do_sample: false,
                            temperature: 0.01,
                            max_new_tokens: 200,
                            repetition_penalty: 1.1,
                            num_beams: 3,
                            top_p: 0.95,
                            top_k: 50,
                        },
                    },
                }),
            })
                .then((response) => response.json())
                .then((_data) => {
                    // console.log(_data);
                    if (addMessage) {
                        matchedDocs.forEach((doc) => {
                            context.push(doc.text);
                            sources.push(doc.source);
                        });
                        addMessage({
                            role: SourceTypes.BOT,
                            content: _data.response[0].generated_text,
                            // context,
                            sources,
                        });
                        if (onResponseCallback) {
                            onResponseCallback(false);
                        }
                    }
                });
            return matchedDocs;
        })
        .catch((_error) => {
            // console.error(error);
            return "";
        });

    // return fetch('http://localhost:8000/generate', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         prompt: text,
    //         generateFurther: generateFurther || null,
    //     }),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         if (onResponseCallback) {
    //             onResponseCallback(false);
    //         }
    //         const respText = data.text;
    //         if (addMessage) {
    //             addMessage({
    //                 source: SourceTypes.BOT,
    //                 message: respText,
    //             });
    //         }
    //         return respText;
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         return '';
    //     });
};

const getResponseForInputProgressive = async (
    text: string,
    generateFurther: string | null,
    onResponseCallback: (status: boolean) => void,
    addMessage: (botResponse: Message) => void,
    getProgressStatus: () => boolean
) => {
    // const similaritySearchBody = {
    //     queries: [
    //         {
    //             query: text,
    //             top_k: 3,
    //         },
    //     ],
    // };
    let urls: string[] = [];
    let sources: string[] = [];
    let generatedResponse = "";
    // const requestUrl = window.location.href.split(":").splice(0, 2).concat("3000/").join(":");
    // const response = await fetch('http://10.33.126.39:3000/getCompletions', {
    const controller = new AbortController();
    const responsePromise = fetch(`/api/getCompletionsStreamed`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            accept: "text/event-stream",
            Connection: "keep-alive",
        },
        body: JSON.stringify({
            inputText: `${text}`,
        }),
        signal: controller.signal,
    });
    if (!getProgressStatus()) {
        controller.abort();
        console.log("request aborted...");
    }
    const response = await responsePromise;
    if (!response.body) return;
    const reader = response.body.getReader();
    // let streamData = '';
    let isRunning = true;
    while (isRunning) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read();

        if (done) {
            // console.log('breaking');
            isRunning = false;
        }
        let data;
        // let dataArray;
        let respData;
        try {
            respData = new TextDecoder().decode(value);
            // dataArray = JSON.parse(respData.trim().split('<endofjson>').join(',') || 'null');
            const splits = respData
                .trim()
                .split("<endofjson>")
                .filter((i) => i);
            if (splits.length === 0) {
                break;
            }
            data = JSON.parse(splits[0]);
            data.completion = splits.reduceRight((str, itm) => JSON.parse(itm).completion + str, "");
        } catch (e) {
            // console.log(respData);
            if (onResponseCallback) onResponseCallback(false);
            throw e;
        }
        if (!data) break;
        // streamData += (new TextDecoder().decode(value)).trim();

        generatedResponse += data.completion || "";
        // generatedResponse += data?.token?.text || '';

        if (data.url && data.url.length > 0) {
            urls = data.url;
        }

        if (data.title && data.title.length > 0) {
            sources = data.title;
        }
        if (addMessage)
            addMessage({
                role: SourceTypes.BOT,
                content: generatedResponse,
                sources,
                urls,
            });
        if (!getProgressStatus()) {
            reader.cancel();
            controller.abort();
            console.log("request aborted...");
        }
    }
    if (onResponseCallback) onResponseCallback(false);
};

export { getResponseForInput, getResponseForInputProgressive };
