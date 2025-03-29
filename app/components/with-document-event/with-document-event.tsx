import {useEffect} from "react";

export function WithDocumentEvent
<K extends keyof DocumentEventMap>
({ children, type }: { type: K, children?: (ev: DocumentEventMap[K]) => void }) {
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal;

        document.addEventListener(type, (event) => {
            children?.(event);
        }, { signal: signal });

        return () => {
            abortController.abort();
        };
    }, []);

    return null;
}