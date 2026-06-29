import React from "react";
import {Text} from "react-native";
import {useChatStore} from "@/store/useChatStore";
import type {TriviaMessage} from "@/types/chat/chat.types";
import GuideRow from "@/components/main/chat/renderer/messages/GuideRow";
import Bubble from "@/components/main/chat/renderer/messages/Bubble";
import Options from "@/components/main/chat/renderer/cards/Options";

interface TriviaProps {
    message: TriviaMessage;
    persona?: { name: string; accentColor?: string };
}

export default function TriviaMessage({message, persona}: TriviaProps) {
    const answerTrivia = useChatStore((s) => s.answerTrivia);

    return (
        <GuideRow persona={persona} mine={false}>
            <Bubble mine={false} wide>
                <Text className="mb-3 text-[15px] font-semibold leading-relaxed text-zinc-900">
                    {message.question}
                </Text>
                <Options
                    options={message.options}
                    answerIndex={message.answerIndex}
                    selectedIndex={message.selectedIndex}
                    onPick={(i) => answerTrivia(message.id, i)}
                />
            </Bubble>
        </GuideRow>
    );
}