import {Place} from "@/types/map/map.types";

export type MarkerVariant = "route" | "suggestion" | "ambient" | "search" | "preview";


export interface MarkerProps {
    place: Place;
    variant: MarkerVariant;
    order?: number;
    focused?: boolean;
    onPress: (place: Place) => void;
}

export interface PhotoMarkerProps extends MarkerProps {
    color: string;
    photoSize: number;
    onReady: () => void;
}

export interface PinMarkerProps {
    variant: MarkerVariant;
    focused: boolean;
    color: string;
    photoSize: number;
}
