import { useState, useEffect } from "react";

interface NetworkStatus {
    isOnline: boolean;
    effectiveType: string | null;
    downlink: number | null;
}

export function useNetworkStatus(): NetworkStatus {
    const [status, setStatus] = useState<NetworkStatus>(() => ({
        isOnline: navigator.onLine,
        effectiveType: null,
        downlink: null,
    }));

    useEffect(() => {
        const updateStatus = () => {
            const connection = (navigator as any).connection;
            setStatus({
                isOnline: navigator.onLine,
                effectiveType: connection?.effectiveType ?? null,
                downlink: connection?.downlink ?? null,
            });
        };

        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);

        const connection = (navigator as any).connection;
        if (connection) {
            connection.addEventListener("change", updateStatus);
        }

        updateStatus();

        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
            if (connection) {
                connection.removeEventListener("change", updateStatus);
            }
        };
    }, []);

    return status;
}
