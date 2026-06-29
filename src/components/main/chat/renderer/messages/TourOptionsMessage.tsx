import React from "react";
import {Text} from "react-native";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {useChatStore} from "@/store/useChatStore";
import GuideRow from "@/components/main/chat/renderer/messages/GuideRow";
import TourCard from "@/components/main/chat/renderer/cards/TourCard";
import {ScrollView} from "react-native-gesture-handler";
import {Tour} from "@/types/chat/entities.types";
import {useMapStore} from "@/store/useMapStore";


interface TourOptionsMessageProps {
    message: {
        text?: string;
        tours: Tour[];
    };
    persona?: { name: string; accentColor?: string };
}

export default function TourOptionsMessage({message, persona}: TourOptionsMessageProps) {
    const sheets = useSheets();
    const chooseTour = useMapStore((s) => s.chooseTour);

    return (
        <GuideRow persona={persona} mine={false}>
            {message.text && (
                <Text className="mb-2 text-[15px] leading-relaxed text-zinc-900">{message.text}</Text>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{gap: 12, paddingRight: 12}}
            >
                {message.tours.map((tour) => (
                    <TourCard
                        key={tour.id}
                        tour={tour}
                        onChoose={() => chooseTour(tour)}
                        onViewMap={() => sheets.previewTourOnMap(tour, message.tours)}
                        onPreviewStop={(id) => sheets.showOnMap(id)}
                    />
                ))}
            </ScrollView>
        </GuideRow>
    );
}