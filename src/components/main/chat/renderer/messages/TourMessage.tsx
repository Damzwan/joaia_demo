import React from "react";
import {Text} from "react-native";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {useChatStore} from "@/store/useChatStore";
import GuideRow from "@/components/main/chat/renderer/messages/GuideRow";
import TourCard from "@/components/main/chat/renderer/cards/TourCard";
import {Tour} from "@/types/chat/entities.types";
import {useMapStore} from "@/store/useMapStore";

interface TourMessageProps {
    message: {
        text?: string;
        tour: Tour;
    };
    persona?: { name: string; accentColor?: string };
}

export default function TourMessage({message, persona}: TourMessageProps) {
    const sheets = useSheets();
    const chooseTour = useMapStore((s) => s.chooseTour);

    return (
        <GuideRow persona={persona} mine={false}>
            {message.text && (
                <Text className="mb-2 text-[15px] leading-relaxed text-zinc-900">
                    {message.text}
                </Text>
            )}
            <TourCard
                tour={message.tour}
                full
                onChoose={() => chooseTour(message.tour)}
                onViewMap={() => sheets.previewTourOnMap(message.tour, [message.tour])}
                onPreviewStop={(id) => sheets.showOnMap(id)}
            />
        </GuideRow>
    );
}