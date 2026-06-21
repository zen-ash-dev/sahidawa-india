import { useEffect, useRef } from "react";

export function useDocumentTitle(title: string, retainOnUnmount = false) {
    const previousTitle = useRef(document.title);

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(() => {
        return () => {
            if (!retainOnUnmount) {
                document.title = previousTitle.current;
            }
        };
    }, [retainOnUnmount]);
}
