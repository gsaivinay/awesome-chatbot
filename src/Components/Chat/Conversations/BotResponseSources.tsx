import { Accordion } from "@mantine/core";
import { FC } from "react";

type BotResponseSourcesProps = {
    sources: string[] | undefined;
    urls: string[] | undefined;
};

const BotResponseSourcesDisplay: FC<BotResponseSourcesProps> = ({ sources, urls }) => {
    return sources?.length || -1 > 0 ? (
        <Accordion variant="filled" radius="md">
            <Accordion.Item value="sources">
                <Accordion.Control>Sources</Accordion.Control>
                <Accordion.Panel>
                    {sources?.map((source, idx) => (
                        <div key={idx}>
                            Source:{" "}
                            <a className="underline" href={urls ? urls[idx] : ""} target="_blank" rel="noreferrer">
                                {source}
                            </a>
                        </div>
                    ))}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    ) : null;
};

export default BotResponseSourcesDisplay;
