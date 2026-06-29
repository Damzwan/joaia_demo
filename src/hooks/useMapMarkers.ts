import {useMemo} from "react";
import {useChatStore, selectMarkers} from "@/store/useChatStore";
import {useMapStore} from "@/store/useMapStore";
import {Tour} from "@/types/chat/entities.types";
import {Place} from "@/types/map/map.types";

export interface MapMarkerTiers {
    routeTour: Tour | null;
    routeStops: { order: number; place: Place }[];
    ambient: Place[];
    searchResults: Place[];
    forcedFocusPlace: Place | null; // ADDED: Fallback standalone container
}

export function useMapMarkers(): MapMarkerTiers {
    const messages = useChatStore((s) => s.messages);
    const plan = useMapStore((s) => s.plan);

    const explore = useMapStore((s) => s.explore);
    const mapMode = useMapStore((s) => s.mapMode);
    const searchResults = useMapStore((s) => s.searchResults);
    const previewTour = useMapStore((s) => s.previewTour);
    const focusedPlaceId = useMapStore((s) => s.focusedPlaceId);

    const convMarkers = useMemo(
        () => selectMarkers(useChatStore.getState()),
        [messages, plan]
    );

    const routeTour = plan;

    const routeStops = useMemo(
        () => plan?.stops.map((s) => ({order: s.order, place: s.place})) ?? [],
        [plan]
    );

    const occupiedIds = useMemo(() => {
        const ids = new Set<string>();
        plan?.stops.forEach((s) => ids.add(s.place.id));
        previewTour?.stops.forEach((s) => ids.add(s.place.id));
        return ids;
    }, [plan, previewTour]);

    const convIds = useMemo(
        () => new Set(convMarkers.map((m) => m.id)),
        [convMarkers]
    );

    const searchPins = useMemo(() => {
        return searchResults.filter((p) => !occupiedIds.has(p.id));
    }, [searchResults, occupiedIds]);

    const ambient = useMemo(() => {
        if (mapMode !== "explore") return [];
        return explore.filter((p) => !convIds.has(p.id) && !occupiedIds.has(p.id));
    }, [mapMode, explore, convIds, occupiedIds]);

    const forcedFocusPlace = useMemo(() => {
        if (!focusedPlaceId) return null;

        const allVisible = [
            ...routeStops.map(s => s.place),
            ...(previewTour?.stops.map(s => s.place) ?? []),
            ...searchPins,
            ...ambient
        ];

        if (allVisible.some(p => p.id === focusedPlaceId)) return null;

        // Trace original entity from historical chat data pools
        return convMarkers.find(p => p.id === focusedPlaceId) ?? null;
    }, [focusedPlaceId, routeStops, previewTour, searchPins, ambient, convMarkers]);

    return {
        routeTour,
        routeStops,
        ambient,
        searchResults: searchPins,
        forcedFocusPlace
    };
}