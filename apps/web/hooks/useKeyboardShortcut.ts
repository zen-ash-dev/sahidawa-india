import { useEffect, useCallback, useRef } from "react";

type ShortcutKey = string;
type ShortcutHandler = (event: KeyboardEvent) => void;

interface UseKeyboardShortcutOptions {
    enabled?: boolean;
    preventDefault?: boolean;
}

export function useKeyboardShortcut(
    keys: ShortcutKey | ShortcutKey[],
    handler: ShortcutHandler,
    options: UseKeyboardShortcutOptions = {}
) {
    const { enabled = true, preventDefault = false } = options;
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled) return;

            const target = event.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            const key = event.key.toLowerCase();
            const keyCombination = [
                event.ctrlKey ? "ctrl" : "",
                event.metaKey ? "meta" : "",
                event.shiftKey ? "shift" : "",
                event.altKey ? "alt" : "",
                key,
            ]
                .filter(Boolean)
                .join("+");

            const targetKeys = Array.isArray(keys) ? keys : [keys];
            const matches = targetKeys.some(
                (k) => k.toLowerCase() === keyCombination || k.toLowerCase() === key
            );

            if (matches) {
                if (preventDefault) {
                    event.preventDefault();
                }
                handlerRef.current(event);
            }
        },
        [keys, enabled, preventDefault]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
}
