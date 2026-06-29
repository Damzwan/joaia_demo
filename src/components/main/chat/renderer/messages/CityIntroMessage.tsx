import React from "react";
import {View, Text, Image} from "react-native";
import {TINT} from "@/constants/theme.constants";

interface CityIntroMessageProps {
    message: {
        image?: string;
        title: string;
        tagline: string;
        segments: { text: string; bold?: boolean }[];
    };
}

export default function CityIntroMessage({message}: CityIntroMessageProps) {
    return (
        <View className="mb-4 overflow-hidden rounded-3xl border border-zinc-200">
            {/* Header / Hero Section */}
            <View style={{height: 96, backgroundColor: TINT}} className="justify-end px-4 pb-3">
                {message.image && (
                    <Image
                        source={{uri: message.image}}
                        style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                        resizeMode="cover"
                    />
                )}
                <Text className="font-display text-3xl text-white">{message.title}</Text>
                <Text className="font-mono text-[11px] text-teal-100">{message.tagline}</Text>
            </View>

            {/* Content Section */}
            <View className="bg-white p-4">
                <Text className="text-[15px] leading-relaxed text-zinc-700">
                    {message.segments.map((s, i) => (
                        <Text
                            key={i}
                            className={s.bold ? "font-semibold text-zinc-900" : undefined}
                        >
                            {s.text}
                        </Text>
                    ))}
                </Text>
            </View>
        </View>
    );
}