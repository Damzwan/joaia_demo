import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { TINT } from "@/constants/theme.constants";

interface MemberCardProps {
    member: {
        name: string;
        field: string;
        blurb: string;
        imageUrl?: string | number;
        avatar?: string | number;
        accentColor?: string;
    };
    onPress: () => void;
}

export default function MemberCard({ member, onPress }: MemberCardProps) {
    const rawImg = member.imageUrl || member.avatar;
    const imageSource = rawImg ? (typeof rawImg === "number" ? rawImg : { uri: rawImg }) : null;

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={{ width: 245 }}
            className="flex-row items-center gap-3.5 rounded-2xl border border-zinc-200 bg-white p-3.5 shadow-sm"
        >
            {imageSource ? (
                <Image
                    source={imageSource}
                    style={{ width: 56, height: 56, borderRadius: 12 }}
                    className="bg-zinc-50"
                    resizeMode="cover"
                />
            ) : (
                <View
                    style={{ backgroundColor: member.accentColor ?? TINT, width: 56, height: 56, borderRadius: 12 }}
                    className="items-center justify-center"
                >
                    <Text className="text-lg font-bold text-white">
                        {member.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
            )}

            <View className="flex-1 justify-center">
                <Text className="text-[14px] font-bold text-zinc-900" numberOfLines={1}>
                    {member.name}
                </Text>
                <Text className="text-[11px] font-medium text-zinc-400 mt-0.5" numberOfLines={1}>
                    {member.field}
                </Text>
                <Text className="mt-1 text-xs leading-normal text-zinc-600 font-normal" numberOfLines={2}>
                    {member.blurb}
                </Text>
            </View>
        </TouchableOpacity>
    );
}