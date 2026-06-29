import React from "react";
import GuideRow from "./GuideRow";
import ConfirmedTourCard from "@/components/main/chat/renderer/cards/ConfirmedTourCard";
import {Tour} from "@/types/chat/entities.types";

interface TourConfirmedMessageProps {
    message: {
        tour: Tour;
    };
    persona?: { name: string; accentColor?: string };
}

export default function TourConfirmedMessage({message, persona}: TourConfirmedMessageProps) {
    return (
        <GuideRow persona={persona} mine={false}>
            <ConfirmedTourCard tour={message.tour}/>
        </GuideRow>
    );
}