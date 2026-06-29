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
    forcedFocusPlace: Place | null;
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
        [messages]
    );

    const routeStops = useMemo(
        () => plan?.stops.map((s) => ({order: s.order, place: s.place})) ?? [],
        [plan]
    );

    // Route + preview stops are "owned": they win over search/ambient tiers.
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

    const searchPins = useMemo(
        () => searchResults.filter((p) => !occupiedIds.has(p.id)),
        [searchResults, occupiedIds]
    );

    const ambient = useMemo(() => {
        if (mapMode !== "explore") return [];
        return explore.filter((p) => !convIds.has(p.id) && !occupiedIds.has(p.id));
    }, [mapMode, explore, convIds, occupiedIds]);


    const forcedFocusPlace = useMemo(() => {
        if (!focusedPlaceId) return null;
        if (occupiedIds.has(focusedPlaceId)) return null;
        if (searchPins.some((p) => p.id === focusedPlaceId)) return null;
        if (ambient.some((p) => p.id === focusedPlaceId)) return null;
        return convMarkers.find((p) => p.id === focusedPlaceId) ?? null;
    }, [focusedPlaceId, occupiedIds, searchPins, ambient, convMarkers]);

    return {
        routeTour: plan,
        routeStops,
        ambient,
        searchResults: searchPins,
        forcedFocusPlace,
    };
}