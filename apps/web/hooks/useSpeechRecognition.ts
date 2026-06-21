import { useState, useRef, useCallback, useEffect } from "react";

interface SpeechRecognitionResult {
    transcript: string;
    isListening: boolean;
    isSupported: boolean;
    error: string | null;
}

export function useSpeechRecognition(): SpeechRecognitionResult & {
    start: () => void;
    stop: () => void;
} {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);

    const SpeechRecognitionAPI =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

    const isSupported = !!SpeechRecognitionAPI;

    const start = useCallback(() => {
        if (!SpeechRecognitionAPI) {
            setError("Speech recognition not supported");
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "hi-IN";

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const result = event.results[current];
            setTranscript(result[0].transcript);
        };

        recognition.onerror = (event: any) => {
            setError(event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
        setError(null);
    }, [SpeechRecognitionAPI]);

    const stop = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    return { transcript, isListening, isSupported, error, start, stop };
}
