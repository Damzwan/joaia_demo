import React from "react";
import {StyleSheet, View, type ViewStyle} from "react-native";

interface Props {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    radius?: number;
}

export default function GlassPanel({children, style, radius = 22}: Props) {
    return (
        <View
            style={[
                {
                    borderRadius: radius,
                    overflow: "hidden",
                    backgroundColor: "rgba(255,255,255,0.88)",
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: "rgba(255,255,255,0.7)",
                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 14,
                    shadowOffset: {width: 0, height: 6},
                    elevation: 8,
                },
                style as ViewStyle,
            ]}
        >
            {children}
        </View>
    );
}