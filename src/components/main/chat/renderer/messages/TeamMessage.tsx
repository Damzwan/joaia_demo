import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSheets } from "@/components/main/sheets/SheetsProvider";
import MemberCard from "@/components/main/chat/renderer/cards/MemberCard";


interface TeamMember {
    id: string;
    name: string;
    field: string;
    blurb: string;
    imageUrl?: string | number;
    avatar?: string | number;
    accentColor?: string;
}

export default function TeamMessage({ message }: { message: { text?: string; members: TeamMember[] } }) {
    const sheets = useSheets();

    return (
        <View className="mb-8 w-full">
            {message.text && (
                <Text className="mb-2.5 ml-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {message.text}
                </Text>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 2, paddingRight: 16, gap: 12 }}
                style={{ flexGrow: 0 }}
            >
                {message.members.map((member) => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        onPress={() => sheets.openFigure(member.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}