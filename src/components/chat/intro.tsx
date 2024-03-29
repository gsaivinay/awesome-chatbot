export default function Intro() {
    const currentHour = new Date().getHours();

    let greeting = "";

    if (currentHour >= 1 && currentHour < 5) {
        greeting = "Happy late night";
    } else if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    return (
        <div className="transition-width relative mt-8 flex h-fit flex-col items-center justify-center rounded-lg border border-border bg-muted p-8 text-center text-secondary-foreground">
            <h1 className="mb-4 text-3xl font-bold text-primary dark:text-secondary-foreground">
                {greeting}, welcome to Open Assistant
            </h1>
            <p className="mb-8 text-lg">
                Powered by{" "}
                <a
                    href="https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1"
                    className="underline decoration-dotted underline-offset-[6px] hover:text-primary"
                    target="_blank"
                    rel="noreferrer"
                >
                    <span className="">mistralai/Mixtral-8x7B-Instruct-v0.1</span>
                </a>{" "}
                model
            </p>
            <div className="text-muted-foreground">
                <p className="mb-2">
                    Add your Free{" "}
                    <a
                        href="https://huggingface.co/settings/tokens"
                        className="underline decoration-dotted underline-offset-[6px] hover:text-primary"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <strong>Huggingface API Key</strong>
                    </a>{" "}
                    in the settings
                </p>
                <p className="mb-4">
                    (You can still continue without adding API key, but responses can be slow or rate limited)
                </p>
            </div>
        </div>
    );
}
