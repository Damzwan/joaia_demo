import React from "react";
import GuideRow from "./GuideRow";
import PlaceAddedCard from "@/components/main/chat/renderer/cards/PlaceAddedCard";
import {Place} from "@/types/map/map.types";

interface PlaceAddedMessageProps {
    message: {
        place: Place;
    };
    persona?: { name: string; accentColor?: string };
}

export default function PlaceAddedMessage({ message, persona }: PlaceAddedMessageProps) {
    return (
        <GuideRow persona={persona} mine={false}>
            <PlaceAddedCard place={message.place} />
        </GuideRow>
    );
}