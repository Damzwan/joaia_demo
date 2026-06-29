import {useState, useEffect} from "react";

export function useMarkerTracking(variant: string, order?: number, focused?: boolean, hasImage?: boolean) {
    const [imageReady, setImageReady] = useState(!hasImage);
    const [tracks, setTracks] = useState(true);

    useEffect(() => {
        setTracks(true);
        if (hasImage) setImageReady(false);
    }, [variant, order, focused, hasImage]);

    useEffect(() => {
        if (!tracks || !imageReady) return;
        const id = setTimeout(() => setTracks(false), 500);
        return () => clearTimeout(id);
    }, [tracks, imageReady]);

    // Safety timeout to forcefully shut down tracking loops even if image loads hang
    useEffect(() => {
        if (!tracks) return;
        const id = setTimeout(() => setTracks(false), 1500);
        return () => clearTimeout(id);
    }, [tracks]);

    return {
        tracks,
        imageReady,
        onImageLoad: () => {
            requestAnimationFrame(() => {
                setTimeout(() => setImageReady(true), 200);
            });
        }
    };
}