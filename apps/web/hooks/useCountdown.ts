import { useState, useEffect, useCallback } from "react";

interface CountdownResult {
    seconds: number;
    isRunning: boolean;
    isExpired: boolean;
    start: () => void;
    pause: () => void;
    reset: () => void;
}

export function useCountdown(
    totalSeconds: number,
    autoStart = false
): CountdownResult {
    const [remaining, setRemaining] = useState(totalSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);

    useEffect(() => {
        if (!isRunning || remaining <= 0) return;

        const id = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [isRunning, remaining]);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    const reset = useCallback(() => {
        setIsRunning(false);
        setRemaining(totalSeconds);
    }, [totalSeconds]);

    return {
        seconds: remaining,
        isRunning,
        isExpired: remaining <= 0,
        start,
        pause,
        reset,
    };
}
