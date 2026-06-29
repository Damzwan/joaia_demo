import React from "react";
import {Polyline} from "react-native-maps";
import type {LatLng} from "@/api/routes.api";
import {MAP_COLORS} from "@/constants/map.constants";

export default function RouteLine({
                                      path,
                                      color = MAP_COLORS.route,
                                      casing = MAP_COLORS.routeCasing,
                                      dashed = false,
                                  }: {
    path: LatLng[] | null;
    color?: string;
    casing?: string;
    dashed?: boolean;
}) {
    if (!path || path.length < 2) return null;
    return (
        <>
            <Polyline coordinates={path} strokeColor={casing} strokeWidth={10} lineCap="round" lineJoin="round"/>
            <Polyline
                coordinates={path}
                strokeColor={color}
                strokeWidth={4}
                lineCap="round"
                lineJoin="round"
                lineDashPattern={dashed ? [2, 10] : undefined}
            />
        </>
    );
}