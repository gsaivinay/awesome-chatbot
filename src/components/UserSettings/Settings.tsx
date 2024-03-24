import { TbSettings } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKey } from "@/store/GlobalStore";

export default function SettingsModal() {
    const [apiKey, setApiKey] = useApiKey(state => [state.apiKey, state.setApiKey]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={"ghost"}
                    className={`flex w-full cursor-pointer items-center gap-3 border-0 p-[0.85rem] text-sm`}
                >
                    <TbSettings size="1.2rem" />
                    <div className={`relative max-h-5 flex-1 truncate break-all text-left text-[14px]`}>Settings</div>
                </Button>
            </DialogTrigger>
            <DialogContent className="border-primary shadow-md shadow-primary sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="api_key" className="text-right">
                            API Key:
                        </Label>
                        <Input
                            type="password"
                            id="name"
                            value={apiKey}
                            onChange={e => {
                                setApiKey(e.target.value);
                            }}
                            className="col-span-3"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
