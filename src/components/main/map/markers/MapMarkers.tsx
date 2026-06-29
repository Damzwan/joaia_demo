import React from "react";
import {useMapStore} from "@/store/useMapStore";
import type {MapMarkerTiers} from "@/hooks/useMapMarkers";
import MapMarker from "@/components/main/map/markers/MapMarker";
import {Place} from "@/types/map/map.types";

interface Props {
    tiers: MapMarkerTiers;
    focusedPlaceId: string | null;
    onPressPlace: (place: Place) => void;
}

export default function MapMarkers({tiers, focusedPlaceId, onPressPlace}: Props) {
    const {ambient, routeStops, searchResults, forcedFocusPlace} = tiers;
    const previewTour = useMapStore((s) => s.previewTour);

    return (
        <>
            {forcedFocusPlace && (
                <MapMarker
                    key={`forced-focus-${forcedFocusPlace.id}`}
                    place={forcedFocusPlace}
                    variant="suggestion"
                    focused={true}
                    onPress={onPressPlace}
                />
            )}

            {ambient.map((p) => (
                <MapMarker
                    key={`amb-${p.id}`}
                    place={p}
                    variant="ambient"
                    focused={p.id === focusedPlaceId}
                    onPress={onPressPlace}
                />
            ))}

            {searchResults.map((p) => (
                <MapMarker
                    key={`search-${p.id}`}
                    place={p}
                    variant="search"
                    focused={p.id === focusedPlaceId}
                    onPress={onPressPlace}
                />
            ))}

            {routeStops.map((s) => (
                <MapMarker
                    key={`route-${s.place.id}-${s.order}`}
                    place={s.place}
                    variant="route"
                    order={s.order}
                    focused={s.place.id === focusedPlaceId}
                    onPress={onPressPlace}
                />
            ))}

            {previewTour?.stops.map((s) => (
                <MapMarker
                    key={`prev-${s.place.id}-${s.order}`}
                    place={s.place}
                    variant="preview"
                    order={s.order}
                    focused={s.place.id === focusedPlaceId}
                    onPress={onPressPlace}
                />
            ))}
        </>
    );
}