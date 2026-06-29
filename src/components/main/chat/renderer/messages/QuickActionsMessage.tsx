import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useChatStore } from "@/store/useChatStore";

interface QuickAction {
    id: string;
    label: string;
    prompt: string;
}

interface QuickActionsMessageProps {
    message: {
        actions: QuickAction[];
    };
}

export default function QuickActionsMessage({ message }: QuickActionsMessageProps) {
    const send = useChatStore((s) => s.send);

    return (
        <View className="mb-3 ml-10 flex-row flex-wrap gap-2">
            {message.actions.map((action) => (
                <ActionItem
                    key={action.id}
                    label={action.label}
                    onPress={() => send(action.prompt)}
                />
            ))}
        </View>
    );
}

function ActionItem({ label, onPress }: { label: string; onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="rounded-full border border-zinc-300 bg-white px-4 py-2"
        >
            <Text className="text-sm font-medium text-zinc-700">{label}</Text>
        </TouchableOpacity>
    );
}