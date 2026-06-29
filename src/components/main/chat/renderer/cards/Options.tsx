import React from "react";
import {View, Text, TouchableOpacity} from "react-native";

interface OptionsProps {
    options: string[];
    answerIndex: number;
    selectedIndex?: number;
    onPick: (i: number) => void;
}

export default function Options({options, answerIndex, selectedIndex, onPick}: OptionsProps) {
    const answered = selectedIndex != null;

    return (
        <View className="gap-2">
            {options.map((opt, i) => {
                const tone = !answered
                    ? "border-zinc-200"
                    : i === answerIndex
                        ? "border-teal-600 bg-teal-50"
                        : i === selectedIndex
                            ? "border-rose-400 bg-rose-50"
                            : "border-zinc-200 opacity-50";

                return (
                    <TouchableOpacity
                        key={i}
                        disabled={answered}
                        onPress={() => onPick(i)}
                        className={`rounded-xl border p-3 ${tone}`}
                    >
                        <Text className="text-sm text-zinc-800">{opt}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}