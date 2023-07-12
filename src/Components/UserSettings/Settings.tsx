import { Group, Modal, PasswordInput, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PropsWithChildren } from "react";
import { TbSettings, TbX } from "react-icons/tb";

import { useCustomTheme } from "@/Store/GlobalStore";
import { CustomThemeType } from "@/types/globalTypes";

export const SettingsModal: React.FC<PropsWithChildren> = () => {
    const [currentTheme, setCurrentTheme] = useCustomTheme((state: CustomThemeType) => [
        state.currentTheme,
        state.setCurrentTheme,
    ]);

    const [opened, { open, close }] = useDisclosure(false);

    // tailwind classes
    const SelectInputClasses = {
        input: `manual-mantine-input`,
        item: `manual-mantine-dropdown-list`,
        label: `manual-mantine-label self-center`,
        icon: `fill-primary`,
        root: `grid-container `,
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                // title="Settings"
                // scrollAreaComponent={ScrollArea.Autosize}
                centered
                classNames={{
                    content: `shadow-none h-full w-auto flex justify-center items-center`,
                    body: `rounded-lg overflow-hidden`,
                }}
                withCloseButton={false}
                size="auto"
                overlayProps={{
                    opacity: 0.65,
                    // blur: 3,
                }}
            >
                <div className={`flex h-[15rem] w-[30rem] flex-col justify-between rounded-lg theme-${currentTheme}`}>
                    <div className="flex justify-between bg-primary p-3 text-brand">
                        <span className="text-lg font-semibold">Settings</span>
                        <button className="p-1" onClick={close}>
                            <TbX size="1rem" />
                        </button>
                    </div>
                    <div className={`flex-grow flex flex-col gap-2 bg-gray-100 p-5 theme-${currentTheme}`}>
                        <Select
                            label="Theme:"
                            data={[
                                "oceanblue",
                                "purple",
                                "riptide",
                                "goldsand",
                                "tonyspink",
                                "cornflower",
                                "mantis",
                                "contessa",
                                "bostonblue",
                                "logan",
                            ]}
                            value={currentTheme}
                            classNames={SelectInputClasses}
                            maxDropdownHeight={180}
                            onChange={setCurrentTheme}
                        />
                        <PasswordInput
                            label="API Key:"
                            placeholder="API Key"
                            classNames={SelectInputClasses}
                        />
                    </div>
                </div>
            </Modal>

            <Group position="center" className=" items-cente flex w-full cursor-pointer rounded-lg border-0">
                <button
                    className={`button-core flex w-full cursor-pointer items-center gap-3 border-0 p-[0.85rem] text-sm`}
                    onClick={open}
                >
                    <TbSettings className="text-brand" size="1.2rem" />
                    <div
                        className={`relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[14px]`}
                    >
                        Settings
                    </div>
                </button>
            </Group>
        </>
    );
};
