import React, { memo, useCallback, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ArrowUp } from "lucide-react-native";

interface ChatInputProps {
    onSend: (text: string) => void;
    thinking?: boolean;
}

function ChatInput({ onSend, thinking = false }: ChatInputProps) {
    const insets = useSafeAreaInsets();
    const [text, setText] = useState("");

    const canSend = text.trim().length > 0 && !thinking;

    const handleSend = useCallback(() => {
        const value = text.trim();
        if (!value || thinking) return;
        onSend(value);
        setText("");
    }, [text, thinking, onSend]);

    return (
        <View
            className="flex-row items-end gap-2 border-t border-zinc-100 bg-white px-4 pt-3"
            style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
            <BottomSheetTextInput
                value={text}
                onChangeText={setText}
                placeholder="Ask the guide…"
                placeholderTextColor="#a1a1aa"
                multiline
                style={styles.input}
            />

            <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSend}
                disabled={!canSend}
                className={`h-11 w-11 items-center justify-center rounded-full ${
                    canSend ? "bg-zinc-900" : "bg-zinc-200"
                }`}
            >
                {thinking ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                    <ArrowUp size={20} color="#ffffff" />
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        minHeight: 44,
        maxHeight: 112,
        borderRadius: 16,
        backgroundColor: "#f4f4f5",
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        color: "#18181b",
    },
});

export default memo(ChatInput);