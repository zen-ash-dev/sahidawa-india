import { useState, useEffect, useRef } from "react";

interface UseIdleTimerOptions {
    timeout?: number;
    events?: string[];
    initialState?: boolean;
}

export function useIdleTimer({
    timeout = 300000,
    events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"],
    initialState = false,
}: UseIdleTimerOptions = {}): boolean {
    const [isIdle, setIsIdle] = useState(initialState);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        const resetTimer = () => {
            setIsIdle(false);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setIsIdle(true), timeout);
        };

        resetTimer();

        events.forEach((event) => window.addEventListener(event, resetTimer));

        return () => {
            clearTimeout(timerRef.current);
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            );
        };
    }, [timeout, events]);

    return isIdle;
}
