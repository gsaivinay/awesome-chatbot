import { TextGenerationStreamOutput } from "@huggingface/inference";

import { type AIStreamCallbacks,createCallbacksTransformer } from "./ai-stream";

function createParser(res: AsyncGenerator<TextGenerationStreamOutput>, onError?: () => void) {
    // const trimStartOfStream = trimStartOfStreamHelper();
    return new ReadableStream<string>({
        async pull(controller): Promise<void> {
            try {
                const { value, done } = await res.next();
                if (done) {
                    controller.close();
                    return;
                }

                // console.log(value);

                // const text = trimStartOfStream(value.token?.text ?? "");
                const text = value.token?.text ?? "";

                if (value.details?.finish_reason === "length") {
                    // console.log(value);
                    controller.enqueue(text);
                    controller.enqueue("<|im_not_finished|>");
                    controller.close();
                    return;
                }
                if (!text) return;

                // some HF models return generated_text instead of a real ending token
                if (value.generated_text !== null && value.generated_text.length > 0) {
                    // console.log(value);
                    controller.close();
                    return;
                }

                // <|endoftext|> is for https://huggingface.co/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5
                // </s> is also often last token in the stream depending on the model
                if (text === "</s>" || text === "<|endoftext|>" || text === "<|system|>" || text === "<|end|>") {
                    // console.log(value);
                    controller.close();
                } else {
                    controller.enqueue(text);
                }
            } catch (error: unknown) {
                // console.log("terminated");
                if (onError) onError();
                // console.log(error);
                controller.close();
                res.throw("stop");
                res.return("stop");
            }
        },
    });
}

export function HuggingFaceStream(
    res: AsyncGenerator<TextGenerationStreamOutput>,
    onError?: () => void,
    callbacks?: AIStreamCallbacks
): ReadableStream {
    return createParser(res, onError).pipeThrough(createCallbacksTransformer(callbacks));
}
