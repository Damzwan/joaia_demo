import React from "react";
import { View } from "react-native";
import { MARKER_SIZE } from "@/constants/map.constants";
import { MarkerVariant } from "@/types/map/marker.types";

interface StaticMarkerProps {
    variant: MarkerVariant;
    focused: boolean;
    color: string;
    photoSize: number;
}

export function StaticMarkerBody({ variant, focused, color, photoSize }: StaticMarkerProps) {
    const isPhotoKind = variant === "route" || variant === "preview";

    if (isPhotoKind) {
        return (
            <View style={{
                width: photoSize,
                height: photoSize,
                borderRadius: photoSize / 2,
                borderWidth: focused ? 4 : 2,
                borderColor: focused ? "#fff" : color,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F0FDFA"
            }}>
                <View style={{
                    width: photoSize * 0.35,
                    height: photoSize * 0.35,
                    borderRadius: (photoSize * 0.35) / 2,
                    backgroundColor: color
                }}/>
            </View>
        );
    }

    if (focused) {
        const head = 40;
        return (
            <View collapsable={false} style={{ width: head + 20, height: head + 26, alignItems: "center", justifyContent: "flex-start" }}>
                <View
                    style={{
                        position: "absolute",
                        top: 6,
                        width: head + 14,
                        height: head + 14,
                        borderRadius: (head + 14) / 2,
                        backgroundColor: color,
                        opacity: 0.2,
                    }}
                />
                <View
                    style={{
                        width: head,
                        height: head,
                        backgroundColor: color,
                        borderTopLeftRadius: head / 2,
                        borderTopRightRadius: head / 2,
                        borderBottomLeftRadius: head / 2,
                        borderBottomRightRadius: 2,
                        transform: [{ rotate: "45deg" }],
                        borderWidth: 3,
                        borderColor: "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                        elevation: 4,
                    }}
                >
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "#fff",
                            transform: [{ rotate: "-45deg" }]
                        }}
                    />
                </View>
            </View>
        );
    }

    const base = MARKER_SIZE[variant];
    const hollow = variant === "suggestion";
    return (
        <View collapsable={false} style={{ width: base + 8, height: base + 8, alignItems: "center", justifyContent: "center" }}>
            <View
                style={{
                    width: base,
                    height: base,
                    borderRadius: base / 2,
                    backgroundColor: hollow ? "#fff" : color,
                    borderWidth: hollow ? 3 : 2,
                    borderColor: hollow ? color : "#fff",
                    elevation: 2,
                }}
            />
        </View>
    );
}