import {BACKEND_URL} from "@/constants/index.constants";
import {Place} from "@/types/map/map.types";

export interface PlaceQuery {
    text: string;
    limit?: number;
    latitude?: number;
    longitude?: number;
}

export const placesApi = {
    async getExplore(): Promise<Place[]> {
        try {
            const res = await fetch(`${BACKEND_URL}/places/explore`);
            if (!res.ok) throw new Error(`Explore HTTP ${res.status}`);
            return (await res.json()) as Place[];
        } catch (err) {
            console.warn("[placesApi] getExplore failed, fallback empty", err);
            return [];
        }
    },

    async getDetails(id: string): Promise<any> {
        try {
            const res = await fetch(`${BACKEND_URL}/places/${id}`);
            if (!res.ok) throw new Error(`Details HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            console.error(`[placesApi] getDetails failed for id: ${id}`, err);
            throw err;
        }
    },

    async search(q: PlaceQuery): Promise<Place[]> {
        try {
            const queryParams: Record<string, string> = {
                q: q.text,
                limit: String(q.limit ?? 6)
            };

            if (q.latitude != null && q.longitude != null) {
                queryParams.lat = String(q.latitude);
                queryParams.lng = String(q.longitude);
            }

            const params = new URLSearchParams(queryParams);
            const res = await fetch(`${BACKEND_URL}/places/search?${params.toString()}`);
            if (!res.ok) throw new Error(`Search HTTP ${res.status}`);
            return (await res.json()) as Place[];
        } catch (err) {
            console.warn("[placesApi] search failed, returning empty", err);
            return [];
        }
    },
};