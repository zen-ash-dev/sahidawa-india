import { useState, useCallback } from "react";

interface CopyToClipboardState {
    value: string;
    success: boolean | null;
}

export function useCopyToClipboard(): [
    CopyToClipboardState,
    (text: string) => Promise<void>
] {
    const [state, setState] = useState<CopyToClipboardState>({
        value: "",
        success: null,
    });

    const copy = useCallback(async (text: string) => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }
            setState({ value: text, success: true });
        } catch {
            setState({ value: text, success: false });
        }
    }, []);

    return [state, copy];
}
