import {BACKEND_URL} from "@/constants/index.constants";

export interface LatLng {
    latitude: number;
    longitude: number;
}

export type TravelMode = "WALK" | "DRIVE" | "TRANSIT" | "BICYCLE";

export const routesApi = {
    async getRoute(stops: LatLng[], mode: TravelMode = "WALK"): Promise<LatLng[] | null> {
        if (stops.length < 2) return null;
        try {
            const res = await fetch(`${BACKEND_URL}/routes`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({stops, mode}),
            });
            if (!res.ok) throw new Error(`Routes HTTP ${res.status}`);
            const data = (await res.json()) as { path?: LatLng[] };
            return data.path && data.path.length > 1 ? data.path : null;
        } catch (err) {
            console.warn("[routesApi] route fetch failed, caller falls back to a straight line:", err);
            return null;
        }
    },
};