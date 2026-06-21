import { useEffect, useRef } from "react";

export function useLockedBody(locked: boolean) {
    const originalOverflow = useRef<string>("");

    useEffect(() => {
        if (locked) {
            originalOverflow.current = document.body.style.overflow;
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = originalOverflow.current;
        }

        return () => {
            document.body.style.overflow = originalOverflow.current;
        };
    }, [locked]);
}
