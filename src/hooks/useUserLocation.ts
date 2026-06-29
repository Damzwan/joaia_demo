import {useCallback, useState} from "react";
import * as Location from "expo-location";

export interface Coords {
    latitude: number;
    longitude: number;
}

export type LocateStatus = "idle" | "locating" | "denied" | "error";

export function useUserLocation() {
    const [coords, setCoords] = useState<Coords | null>(null);
    const [status, setStatus] = useState<LocateStatus>("idle");

    const locate = useCallback(async (): Promise<Coords | null> => {
        try {
            setStatus("locating");

            const {status: perm} = await Location.requestForegroundPermissionsAsync();
            if (perm !== "granted") {
                setStatus("denied");
                return null;
            }

            const lastKnown = await Location.getLastKnownPositionAsync({});
            if (lastKnown) {
                const fallbackCoords = {
                    latitude: lastKnown.coords.latitude,
                    longitude: lastKnown.coords.longitude
                };
                setCoords(fallbackCoords);
            }

            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const next = {latitude: pos.coords.latitude, longitude: pos.coords.longitude};
            setCoords(next);
            setStatus("idle");
            return next;
        } catch (err) {
            console.warn("[useUserLocation] failed:", err);

            if (coords) {
                setStatus("idle");
                return coords;
            }

            setStatus("error");
            return null;
        }
    }, [coords]);

    return {coords, status, locate};
}