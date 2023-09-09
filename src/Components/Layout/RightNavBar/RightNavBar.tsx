import { Avatar, Group, NumberInput, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { forwardRef, memo, useEffect, useState } from "react";

import { useChatResponseStatus, useGenerationSettings, usePlugin } from "@/Store/ChatSettings";
import { useConversationEntityStore, useConversationStore } from "@/Store/ChatStore";
import useSideBarState from "@/Store/GlobalStore";
import { ChatResponseStatus, ConversationEntityStore, ConversationStore, SourceTypes } from "@/types/chatMessageType";
import { GenerationSettings, GenerationSettingsState, PluginTypeState } from "@/types/generationSettings";
import { SelectItemProps, SideBarState } from "@/types/globalTypes";

const RightNavBar = memo(() => {
    const [conversation, id, title, setCurrentConversation, removeLastMessage, getCurrentConversationInfo] =
        useConversationStore((state: ConversationStore) => [
            state.conversation,
            state.id,
            state.title,
            state.setCurrentConversation,
            state.removeLastMessage,
            state.getCurrentConversationInfo,
        ]);
    const [setConversationMap] = useConversationEntityStore((state: ConversationEntityStore) => [
        state.setConversation,
    ]);
    const [updateProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.updateProgress]);
    const [rightSidebarOpen] = useSideBarState((state: SideBarState) => [state.rightSidebarOpen]);
    const [setGenerationSettings] = useGenerationSettings((state: GenerationSettingsState) => [
        state.setGenerationSettings,
    ]);
    const [_setPlugin] = usePlugin((state: PluginTypeState) => [state.setPlugin]);
    const [rightSidebarClasses, setRightSidebarClasses] = useState<string[]>([]);

    useEffect(() => {
        if (!rightSidebarOpen) {
            setRightSidebarClasses(["w-0"]);
            // rightSideBarRef.current.classList.add('w-0');
            // leftSideBarRef.current.classList.add('hidden');
        } else {
            setRightSidebarClasses([]);
            // leftSideBarRef.current.classList.remove('hidden');
            // rightSideBarRef.current.classList.remove('w-0');
        }
    }, [rightSidebarOpen]);

    const _pluginData = [
        {
            info: "http://localhost:3000/api/assistant/ai-plugin.json",
            image: "http://localhost:3000/api/assistant/icon.png",
            openapi: "http://localhost:3000/api/assistant/openapi.json",
            label: "Default Plugin",
            value: "Default Plugin",
            description: "Experimental plugin",
            id: "1",
        },
    ];

    // const setSelectedPlugin = (label: string) => {
    //     if (label === null) {
    //         const pluginValue: PluginType = {
    //             info: undefined,
    //             image: undefined,
    //             openapi: undefined,
    //             label: undefined,
    //             value: undefined,
    //             description: undefined,
    //             id: undefined,
    //         };
    //         setPlugin(pluginValue);
    //     } else {
    //         setPlugin(pluginData.filter((item) => item.label === label)[0]);
    //     }
    // };

    const form = useForm<GenerationSettings>({
        initialValues: {
            max_new_tokens: 1024,
            do_sample: "true",
            temperature: 0.2,
            repetition_penalty: 1.2,
            top_k: 100,
            top_p: 0.96,
        },
        transformValues: (values) => ({
            max_new_tokens: values.max_new_tokens,
            do_sample: values.do_sample === "true",
            temperature: values.temperature,
            repetition_penalty: values.repetition_penalty,
            top_k: values.top_k,
            top_p: values.top_p,
        }),
    });

    const selectItem = forwardRef<HTMLDivElement, SelectItemProps>(
        ({ image, label, description, ...others }: SelectItemProps, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={image} size={"md"} />

                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            {description}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );

    selectItem.displayName = "SelectItem";

    useEffect(() => {
        setGenerationSettings(form.getTransformedValues());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.values]);

    const SelectInputClasses = {
        input: "manual-mantine-input",
        item: "manual-mantine-dropdown-list",
        label: "manual-mantine-label",
        icon: "manual-mantine-icon",
    };

    return (
        <div
            className={`sidebar-core flex-shrink-0 overflow-hidden p-0 ${rightSidebarClasses.join(" ")}`}
            role="right-navigation"
        >
            <div className={`h-full w-[var(--sidebar-width)] overflow-x-hidden`}>
                <div className="m-2 flex flex-col gap-2 rounded-lg border border-gray-300 p-2">
                    <div className="mb-1 text-center text-lg font-bold text-brand">Generation Settings</div>
                    <NumberInput
                        label="Max new tokens"
                        {...form.getInputProps("max_new_tokens")}
                        type="number"
                        min={1}
                        max={4096}
                        step={10}
                        classNames={SelectInputClasses}
                    />
                    <Select
                        label="Sampling"
                        data={["true", "false"]}
                        placeholder="Creative/Deterministic"
                        {...form.getInputProps("do_sample")}
                        classNames={SelectInputClasses}
                    />
                    <NumberInput
                        label="Temperature"
                        {...form.getInputProps("temperature")}
                        type="number"
                        precision={2}
                        min={0.01}
                        max={1.0}
                        step={0.1}
                        classNames={SelectInputClasses}
                    />
                    <NumberInput
                        label="Repetition penalty"
                        type="number"
                        {...form.getInputProps("repetition_penalty")}
                        precision={2}
                        min={1.0}
                        max={1.5}
                        step={0.1}
                        classNames={SelectInputClasses}
                    />
                    <NumberInput
                        label="Top K"
                        {...form.getInputProps("top_k")}
                        type="number"
                        min={1}
                        max={100}
                        step={1}
                        classNames={SelectInputClasses}
                    />
                    <NumberInput
                        label="Top P"
                        {...form.getInputProps("top_p")}
                        type="number"
                        precision={2}
                        min={0.1}
                        max={1}
                        step={0.1}
                        classNames={SelectInputClasses}
                    />
                </div>
                {/* <div className="m-2 p-2 border border-gray-300 rounded-md flex flex-col gap-2">
                <div className="text-lg font-bold text-center mb-1">Plugins</div>
                <Select
                    label="Choose a plugin"
                    placeholder="Pick one"
                    itemComponent={selectItem}
                    data={pluginData}
                    searchable
                    allowDeselect
                    maxDropdownHeight={400}
                    nothingFound="No plugins found"
                    filter={(value, item) =>
                        item.label!.toLowerCase().includes(value.toLowerCase().trim()) ||
                        item.description.toLowerCase().includes(value.toLowerCase().trim())
                    }
                    onChange={setSelectedPlugin}
                />
            </div> */}
                {id !== null && id !== undefined && id !== "" && (
                    <div className="m-2 flex flex-col  gap-2 rounded-lg border border-gray-300 p-2 text-center">
                        <div className="mb-1 text-center text-lg font-bold text-brand">Controls</div>
                        <button
                            // className=" flex-1 bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-300 hover:border-transparent rounded"
                            className="button-core"
                            onClick={() => {
                                setConversationMap(id!, [], title);
                                setCurrentConversation(id!, [], title);
                            }}
                        >
                            Clear chat
                        </button>
                        <button
                            className="button-core"
                            onClick={() => {
                                updateProgress(false);
                                removeLastMessage();
                                const info = getCurrentConversationInfo();
                                if (info[info.length - 1].role === SourceTypes.USER) {
                                    // Remove another time
                                    removeLastMessage();
                                }
                                setConversationMap(id!, conversation);
                            }}
                        >
                            Clear last turn
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
});

RightNavBar.displayName = "RightNavBar";

export default RightNavBar;
