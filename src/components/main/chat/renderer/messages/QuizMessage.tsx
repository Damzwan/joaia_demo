import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import GuideRow from "./GuideRow";
import Bubble from "@/components/main/chat/renderer/messages/Bubble";
import Options from "@/components/main/chat/renderer/cards/Options";
import {QuizQuestion} from "@/types/chat/entities.types";

interface QuizMessageProps {
    message: {
        text?: string;
        questions: QuizQuestion[];
    };
    persona?: { name: string; accentColor?: string };
}

export default function QuizMessage({ message, persona }: QuizMessageProps) {
    const [step, setStep] = useState(0);
    const [picks, setPicks] = useState<(number | null)[]>(() => message.questions.map(() => null));

    const q = message.questions[step];
    const picked = picks[step];
    const done = step === message.questions.length - 1 && picked != null;
    const score = picks.filter((p, i) => p === message.questions[i].answerIndex).length;

    const pick = (i: number) => setPicks((prev) => prev.map((v, idx) => (idx === step ? i : v)));

    return (
        <GuideRow persona={persona} mine={false}>
            <Bubble mine={false} wide>
                {message.text && (
                    <Text className="mb-2 text-[15px] leading-relaxed text-zinc-900">{message.text}</Text>
                )}

                <Text className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                    Question {step + 1} of {message.questions.length}
                </Text>
                <Text className="mb-3 text-[15px] font-semibold leading-relaxed text-zinc-900">
                    {q.question}
                </Text>

                <Options
                    options={q.options}
                    answerIndex={q.answerIndex}
                    selectedIndex={picked ?? undefined}
                    onPick={pick}
                />

                {picked != null && !done && (
                    <TouchableOpacity
                        onPress={() => setStep((s) => s + 1)}
                        className="mt-3 flex-row items-center justify-center gap-1 rounded-full bg-zinc-900 py-2.5"
                    >
                        <Text className="text-sm font-medium text-white">Next question</Text>
                        <ChevronRight size={15} color="#fff" />
                    </TouchableOpacity>
                )}

                {done && (
                    <View className="mt-3 items-center rounded-xl bg-teal-50 p-3">
                        <Text className="text-[15px] font-semibold text-teal-800">
                            You scored {score} / {message.questions.length}
                        </Text>
                    </View>
                )}
            </Bubble>
        </GuideRow>
    );
}