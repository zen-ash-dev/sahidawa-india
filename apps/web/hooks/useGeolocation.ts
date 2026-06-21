import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}

export function useGeolocation(): GeolocationState & { refresh: () => void } {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        loading: true,
    });

    const query = useCallback(() => {
        if (!navigator.geolocation) {
            setState((prev) => ({
                ...prev,
                error: "Geolocation not supported",
                loading: false,
            }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    loading: false,
                });
            },
            (error) => {
                setState((prev) => ({
                    ...prev,
                    error: error.message,
                    loading: false,
                }));
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        );
    }, []);

    useEffect(() => {
        query();
    }, [query]);

    return { ...state, refresh: query };
}
