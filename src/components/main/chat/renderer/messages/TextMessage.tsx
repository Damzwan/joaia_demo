import React from "react";
import {Text, View} from "react-native";
import GuideRow from "./GuideRow";
import Bubble from "@/components/main/chat/renderer/messages/Bubble";

interface TextMessageProps {
    message: {
        text?: string;
        pending?: boolean;
    };
    mine: boolean;
    persona?: { name: string; accentColor?: string };
}

export default function TextMessage({message, mine, persona}: TextMessageProps) {
    return (
        <GuideRow persona={persona} mine={mine}>
            <Bubble mine={mine}>
                {message.pending ? (
                    <TypingDots/>
                ) : (
                    <Text className="text-[15px] leading-relaxed text-zinc-900">{message.text}</Text>
                )}
            </Bubble>
        </GuideRow>
    );
}


function TypingDots() {
    return (
        <View className="flex-row gap-1 py-1">
            {[0, 1, 2].map((i) => (
                <View key={i} className="h-2 w-2 rounded-full bg-zinc-300"/>
            ))}
        </View>
    );
}