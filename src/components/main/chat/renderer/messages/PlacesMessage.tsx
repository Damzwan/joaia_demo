import React from "react";
import {Text} from "react-native";
import {useChatStore} from "@/store/useChatStore";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import GuideRow from "@/components/main/chat/renderer/messages/GuideRow";
import PlaceCard from "@/components/main/chat/renderer/cards/PlaceCard";
import {ScrollView} from "react-native-gesture-handler";
import {Place} from "@/types/map/map.types";
import {useMapStore} from "@/store/useMapStore";


interface PlacesMessageProps {
    message: {
        text?: string;
        places: Place[];
    };
    persona?: { name: string; accentColor?: string };
}

export default function PlacesMessage({message, persona}: PlacesMessageProps) {
    const sheets = useSheets();
    const addPlaceToTour = useMapStore((s) => s.addPlaceToTour);

    return (
        <GuideRow persona={persona} mine={false}>
            {message.text && (
                <Text className="mb-2 text-[15px] leading-relaxed text-zinc-900">{message.text}</Text>
            )}

            {message.places.length > 1 ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{gap: 12, paddingRight: 12}}
                >
                    {message.places.map((p) => (
                        <PlaceCard
                            key={p.id}
                            place={p}
                            onOpen={() => sheets.openPlace(p.id)}
                            onAdd={() => addPlaceToTour(p)}
                        />
                    ))}
                </ScrollView>
            ) : (
                message.places.map((p) => (
                    <PlaceCard
                        key={p.id}
                        place={p}
                        full
                        onOpen={() => sheets.openPlace(p.id)}
                        onAdd={() => addPlaceToTour(p)}
                    />
                ))
            )}
        </GuideRow>
    );
}