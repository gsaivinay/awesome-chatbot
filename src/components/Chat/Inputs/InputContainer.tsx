import { InputArea } from "@/components/Chat/Inputs";

export default function InputContainer() {
    return (
        <div className="absolute bottom-0 left-0 flex w-[calc(100%-.5rem)] justify-center bg-background pt-2">
            <div className="relative flex h-full max-w-5xl flex-1 flex-col items-center justify-center shadow-2xl shadow-primary">
                <InputArea />
            </div>
        </div>
    );
}
