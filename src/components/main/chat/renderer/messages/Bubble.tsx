import React from "react";
import {View} from "react-native";

interface BubbleProps {
    mine: boolean;
    wide?: boolean;
    children: React.ReactNode;
}

export default function Bubble({mine, wide, children}: BubbleProps) {
    return (
        <View
            className={`rounded-2xl p-3.5 ${
                wide ? "" : "max-w-[88%]"
            } ${
                mine
                    ? "self-end rounded-br-sm bg-zinc-100"
                    : "self-start rounded-bl-sm border border-zinc-200 bg-white"
            }`}
        >
            {children}
        </View>
    );
}