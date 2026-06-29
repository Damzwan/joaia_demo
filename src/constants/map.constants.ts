import {MarkerVariant} from "@/types/map/marker.types";

export const MAP_COLORS = {
    route: "#0F766E",
    routeCasing: "rgba(15,118,110,0.22)",
    suggestion: "#F97316",
    ambient: "#94A3B8",
    search: "#7C3AED",
    focusRing: "rgba(15,118,110,0.20)",

    surface: "rgba(255,255,255,0.96)",
    border: "#E4E4E7",
    ink: "#18181B",
    inkMuted: "#71717A",
    onColor: "#FFFFFF",
    preview: "#2B50E0",
    previewCasing: "#2B50E0",
} as const;


export const MARKER_SIZE: Record<MarkerVariant, number> = {
    ambient: 12,
    suggestion: 16,
    search: 18,
    route: 46,
    preview: 40,
};
