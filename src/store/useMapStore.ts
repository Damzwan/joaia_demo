import { create } from "zustand";
import type { LatLng } from "@/api/routes.api";
import { routesApi } from "@/api/routes.api";
import { placesApi } from "@/api/places.api";
import { EXPLORE_POIS } from "@/constants/explore.constants";
import { Place } from "@/types/map/map.types";
import { Tour, TourStop } from "@/types/chat/entities.types";

export type MapMode = "plan" | "explore";
export type PlaceOrigin = "map" | "search" | "plan";

const toLatLng = (p: { latitude: number; longitude: number }): LatLng => ({
    latitude: p.latitude,
    longitude: p.longitude,
});

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const renumber = (stops: TourStop[]): TourStop[] => stops.map((st, i) => ({ ...st, order: i + 1 }));

let planToken = 0;
let previewToken = 0;

async function fetchRoute(stops: TourStop[]): Promise<LatLng[] | null> {
    const pts = stops.map((s) => toLatLng(s.place));
    if (pts.length < 2) return pts.length ? pts : null;
    const path = await routesApi.getRoute(pts);
    return path && path.length > 1 ? path : pts;
}

interface MapState {
    plan: Tour | null;
    focusedPlaceId: string | null;
    selectedPlaceId: string | null;
    selectedFigureId: string | null;
    cameraTarget: LatLng | null;
    fitCoordinates: LatLng[] | null;
    bottomInset: number;
    mapMode: MapMode;
    routePath: LatLng[] | null;
    previewTours: Tour[];
    previewTour: Tour | null;
    previewRoutePath: LatLng[] | null;
    searchResults: Place[];
    searchQuery: string;
    explore: Place[];
    exploreLoading: boolean;
    exploreLoaded: boolean;
    placeOrigin: PlaceOrigin;
    currentRegion: LatLng | null;
}

interface MapActions {
    setSelectedPlaceId: (id: string | null) => void;
    setSelectedFigureId: (id: string | null) => void;
    setFocusedPlaceId: (id: string | null) => void;
    setMapMode: (mode: MapMode) => void;
    setBottomInset: (px: number) => void;
    setPlaceOrigin: (origin: PlaceOrigin) => void;
    setCurrentRegion: (region: LatLng | null) => void;
    setCameraTarget: (coords: LatLng) => void;

    // Plan Management Actions (Moved from Chat Store)
    chooseTour: (tour: Tour) => void;
    addPlaceToTour: (place: Place) => boolean; // Returns true if added successfully
    removeTourStop: (placeId: string) => void;
    reorderPlan: (stops: TourStop[]) => void;
    clearPlan: () => void;

    focusPlace: (place: Place) => void;
    fitPlaces: (places: Place[]) => void;
    clearFocus: () => void;
    syncPlanRoute: (stops: TourStop[]) => Promise<void>;
    clearPlanRoute: () => void;
    showPreview: (tour: Tour, group?: Tour[]) => Promise<void>;
    setActivePreview: (tour: Tour) => Promise<void>;
    clearPreview: () => void;
    setSearchResults: (places: Place[]) => void;
    setSearchQuery: (q: string) => void;
    clearSearch: () => void;
    resetMapState: () => void;
    fetchExplore: (force?: boolean) => Promise<void>;
}

export const useMapStore = create<MapState & MapActions>((set, get) => ({
    plan: null,
    focusedPlaceId: null,
    selectedPlaceId: null,
    selectedFigureId: null,
    cameraTarget: null,
    fitCoordinates: null,
    bottomInset: 0,
    mapMode: "plan",
    routePath: null,
    previewTours: [],
    previewTour: null,
    previewRoutePath: null,
    searchResults: [],
    searchQuery: "",
    explore: EXPLORE_POIS,
    exploreLoaded: false,
    exploreLoading: false,
    placeOrigin: "map",
    currentRegion: null,

    setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
    setSelectedFigureId: (id) => set({ selectedFigureId: id }),
    setFocusedPlaceId: (id) => set({ focusedPlaceId: id }),
    setMapMode: (mode) => set({ mapMode: mode }),
    setBottomInset: (px) => set({ bottomInset: px }),
    setPlaceOrigin: (origin) => set({ placeOrigin: origin }),
    setCurrentRegion: (region) => set({ currentRegion: region }),
    setCameraTarget: (coords) => set({ cameraTarget: coords, fitCoordinates: null }),

    chooseTour: (tour) => {
        const plan: Tour = {
            id: uid(),
            title: tour.title,
            summary: tour.summary,
            durationMinutes: tour.durationMinutes,
            stops: renumber(tour.stops),
        };

        set({
            plan,
            previewTours: [],
            previewTour: null,
            previewRoutePath: null,
            mapMode: "plan",
            fitCoordinates: plan.stops.map((st) => toLatLng(st.place)),
            cameraTarget: null,
        });

        get().syncPlanRoute(plan.stops);
    },

    addPlaceToTour: (place) => {
        const { plan } = get();
        if (plan?.stops.some((st) => st.place.id === place.id)) return false;

        const newPlan: Tour = plan
            ? { ...plan, stops: [...plan.stops, { order: plan.stops.length + 1, place, note: place.note }] }
            : { id: uid(), title: "My Zürich plan", stops: [{ order: 1, place, note: place.note }] };

        set({
            plan: newPlan,
            focusedPlaceId: place.id,
            selectedPlaceId: place.id,
            selectedFigureId: null,
            cameraTarget: toLatLng(place),
            fitCoordinates: null,
        });

        get().syncPlanRoute(newPlan.stops);
        return true;
    },

    removeTourStop: (placeId) => {
        const { plan } = get();
        if (!plan) return;

        const stops = renumber(plan.stops.filter((st) => st.place.id !== placeId));
        set({ plan: stops.length ? { ...plan, stops } : null });
        get().syncPlanRoute(stops);
    },

    reorderPlan: (stops) => {
        const { plan } = get();
        if (!plan) return;

        const next = renumber(stops);
        set({ plan: { ...plan, stops: next } });
        get().syncPlanRoute(next);
    },

    clearPlan: () => {
        planToken++;
        set({ plan: null, routePath: null, focusedPlaceId: null, selectedPlaceId: null });
    },

    focusPlace: (place) =>
        set({
            focusedPlaceId: place.id,
            selectedPlaceId: place.id,
            selectedFigureId: null,
            cameraTarget: toLatLng(place),
            fitCoordinates: null,
        }),

    fitPlaces: (places) => {
        if (!places.length) return;
        set({ fitCoordinates: places.map(toLatLng), cameraTarget: null });
    },

    clearFocus: () => set({ focusedPlaceId: null, selectedPlaceId: null }),

    syncPlanRoute: async (stops) => {
        const token = ++planToken;
        if (!stops.length) {
            set({ routePath: null });
            return;
        }
        const path = await fetchRoute(stops);
        if (token === planToken) set({ routePath: path });
    },

    clearPlanRoute: () => {
        planToken++;
        set({ routePath: null });
    },

    showPreview: async (tour, group) => {
        const tours = group?.length ? group : [tour];
        set({
            previewTours: tours,
            previewTour: tour,
            previewRoutePath: null,
            fitCoordinates: tour.stops.map((s) => toLatLng(s.place)),
            cameraTarget: null,
        });
        const token = ++previewToken;
        const path = await fetchRoute(tour.stops);
        if (token === previewToken && get().previewTour?.id === tour.id) {
            set({ previewRoutePath: path });
        }
    },

    setActivePreview: async (tour) => {
        set({
            previewTour: tour,
            previewRoutePath: null,
            fitCoordinates: tour.stops.map((s) => toLatLng(s.place)),
            cameraTarget: null,
        });
        const token = ++previewToken;
        const path = await fetchRoute(tour.stops);
        if (token === previewToken && get().previewTour?.id === tour.id) {
            set({ previewRoutePath: path });
        }
    },

    clearPreview: () => {
        previewToken++;
        set({ previewTours: [], previewTour: null, previewRoutePath: null });
    },

    setSearchResults: (places) => set({ searchResults: places }),
    setSearchQuery: (q) => set({ searchQuery: q }),
    clearSearch: () => set({ searchResults: [], searchQuery: "" }),

    resetMapState: () => {
        planToken++;
        previewToken++;
        set({
            plan: null,
            focusedPlaceId: null,
            selectedPlaceId: null,
            selectedFigureId: null,
            cameraTarget: null,
            fitCoordinates: null,
            mapMode: "plan",
            routePath: null,
            previewTours: [],
            previewTour: null,
            previewRoutePath: null,
            searchResults: [],
            searchQuery: "",
            placeOrigin: "map",
            currentRegion: null,
        });
    },

    fetchExplore: async (force = false) => {
        const state = get();
        if (state.exploreLoading) return;
        if (state.exploreLoaded && !force) return;
        set({ exploreLoading: true });
        try {
            const places = await placesApi.getExplore();
            set({ explore: places?.length ? places : EXPLORE_POIS, exploreLoaded: true, exploreLoading: false });
        } catch (err) {
            console.warn("[map] explore preload failed", err);
            set({ explore: EXPLORE_POIS, exploreLoaded: true, exploreLoading: false });
        }
    },
}));