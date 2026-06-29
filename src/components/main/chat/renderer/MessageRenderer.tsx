import React from "react";
import {PERSONAS} from "@/constants/chat.constants";

import TextMessage from "./messages/TextMessage";
import CityIntroMessage from "./messages/CityIntroMessage";
import TeamMessage from "./messages/TeamMessage";
import PlacesMessage from "./messages/PlacesMessage";
import TourOptionsMessage from "./messages/TourOptionsMessage";
import TourMessage from "./messages/TourMessage";
import TriviaMessage from "./messages/TriviaMessage";
import QuizMessage from "./messages/QuizMessage";
import QuickActionsMessage from "./messages/QuickActionsMessage";
import TourConfirmedMessage from "./messages/TourConfirmedMessage";
import PlaceAddedMessage from "./messages/PlaceAddedMessage";
import {ChatMessage} from "@/types/chat/chat.types";

function assertNever(x: never): never {
    throw new Error(`Unhandled message kind: ${JSON.stringify(x)}`);
}

export default function MessageRenderer({message}: { message: ChatMessage }) {
    const persona = message.personaId ? PERSONAS[message.personaId] : undefined;
    const mine = message.role === "user";

    switch (message.kind) {
        case "text":
            return <TextMessage message={message} mine={mine} persona={persona}/>;

        case "cityIntro":
            return <CityIntroMessage message={message}/>;

        case "team":
            return <TeamMessage message={message}/>;

        case "places":
            return <PlacesMessage message={message} persona={persona}/>;

        case "tourOptions":
            return <TourOptionsMessage message={message} persona={persona}/>;

        case "tour":
            return <TourMessage message={message} persona={persona}/>;

        case "trivia":
            return <TriviaMessage message={message} persona={persona}/>;

        case "quiz":
            return <QuizMessage message={message} persona={persona}/>;

        case "quickActions":
            return <QuickActionsMessage message={message}/>;

        case "tourConfirmed":
            return <TourConfirmedMessage message={message} persona={persona}/>;

        case "placeAdded":
            return <PlaceAddedMessage message={message} persona={persona}/>;

        default:
            return assertNever(message);
    }
}