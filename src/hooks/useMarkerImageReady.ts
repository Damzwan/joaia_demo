import {useCallback, useEffect, useRef, useState} from "react";

interface UseMarkerTrackingProps {
    variant: string;
    order?: number;
    focused?: boolean;
    hasImage?: boolean;
}


export function useMarkerTracking({variant, order, focused, hasImage}: UseMarkerTrackingProps) {
    const [tracks, setTracks] = useState(true);
    const raf1 = useRef<number | null>(null);
    const raf2 = useRef<number | null>(null);

    const cancel = useCallback(() => {
        if (raf1.current != null) cancelAnimationFrame(raf1.current);
        if (raf2.current != null) cancelAnimationFrame(raf2.current);
        raf1.current = raf2.current = null;
    }, []);

    const settle = useCallback(() => {
        cancel();
        setTracks(true);
        raf1.current = requestAnimationFrame(() => {
            raf2.current = requestAnimationFrame(() => setTracks(false));
        });
    }, [cancel]);

    useEffect(() => {
        settle();
        return cancel;
    }, [variant, order, focused, hasImage, settle, cancel]);

    const onImageLoad = useCallback(() => settle(), [settle]);

    return {tracks, onImageLoad};
}