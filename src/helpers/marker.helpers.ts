import {MarkerVariant} from "@/types/map/marker.types";
import {MAP_COLORS} from "@/constants/map.constants";

export const getVariantColor = (variant: MarkerVariant): string => ({
    route: MAP_COLORS.route,
    preview: MAP_COLORS.preview,
    suggestion: "#6366F1",
    ambient: MAP_COLORS.ambient,
    search: MAP_COLORS.search,
}[variant]);
export const getZIndex = (variant: MarkerVariant, focused: boolean): number => {
    if (focused) return 999;
    const base: Record<MarkerVariant, number> = {
        preview: 11, route: 10, search: 8, suggestion: 4, ambient: 1
    };
    return base[variant] || 0;
};