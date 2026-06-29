import React, {memo} from "react";
import {Marker} from "react-native-maps";
import {MAP_COLORS} from "@/constants/map.constants";
import {Place} from "@/types/map/map.types";
import {MarkerVariant} from "@/types/map/marker.types";
import {PhotoMarkerBody} from "./PhotoMarkerBody";
import {StaticMarkerBody} from "./StaticMarkerBody";
import {useMarkerTracking} from "@/hooks/useMarkerImageReady";

interface Props {
    place: Place;
    variant: MarkerVariant;
    order?: number;
    focused?: boolean;
    onPress: (place: Place) => void;
}

const VARIANT_COLOR: Record<MarkerVariant, string> = {
    route: MAP_COLORS.route,
    preview: MAP_COLORS.preview,
    suggestion: "#6366F1",
    ambient: MAP_COLORS.ambient,
    search: MAP_COLORS.search,
};

const Z_INDEX_MAP: Record<MarkerVariant, number> = {
    preview: 11,
    route: 10,
    search: 8,
    suggestion: 4,
    ambient: 1
};

function MapMarker({place, variant, order, focused = false, onPress}: Props) {
    const hasPhoto = (variant === "route" || variant === "preview") && !!place.thumbnail;

    const {tracks, onImageLoad} = useMarkerTracking(variant, order, focused, hasPhoto);

    const color = VARIANT_COLOR[variant];
    const photoSize = focused ? 54 : variant === "preview" ? 40 : 44;
    const baseZ = focused ? 990 : Z_INDEX_MAP[variant];
    const coordinate = {latitude: place.latitude, longitude: place.longitude};

    const handlePress = (e: any) => {
        e.stopPropagation?.();
        onPress(place);
    };

    if (hasPhoto && place.thumbnail) {
        return (
            <PhotoMarkerBody
                coordinate={coordinate}
                place={place}
                color={color}
                photoSize={photoSize}
                baseZ={baseZ}
                tracks={tracks}
                order={order}
                focused={focused}
                handlePress={handlePress}
                onImageLoad={onImageLoad}
            />
        );
    }

    const isPinStyle = focused && !(variant === "route" || variant === "preview");

    return (
        <Marker
            coordinate={coordinate}
            anchor={isPinStyle ? {x: 0.5, y: 0.92} : {x: 0.5, y: 0.5}}
            zIndex={focused ? 999 : Z_INDEX_MAP[variant]}
            tracksViewChanges={tracks}
            onPress={handlePress}
        >
            <StaticMarkerBody
                variant={variant}
                focused={focused}
                color={color}
                photoSize={photoSize}
            />
        </Marker>
    );
}

export default memo(MapMarker);