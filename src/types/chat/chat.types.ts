import {Place} from "@/types/map/map.types";
import {Figure, QuickAction, QuizQuestion, TextSegment, Tour} from "@/types/chat/entities.types";

export type ChatRole = "user" | "guide";

export interface BaseMessage {
    id: string;
    role: ChatRole;
    createdAt: number;
    personaId?: string;
    pending?: boolean;
}

type WithBase<T> = T & BaseMessage;

export type TextMessage = WithBase<{ kind: "text"; text: string }>;
export type PlacesMessage = WithBase<{ kind: "places"; text?: string; places: Place[] }>;
export type TourMessage = WithBase<{ kind: "tour"; text?: string; tour: Tour }>;
export type TourOptionsMessage = WithBase<{ kind: "tourOptions"; text?: string; tours: Tour[] }>;
export type TriviaMessage = WithBase<{
    kind: "trivia";
    question: string;
    options: string[];
    answerIndex: number;
    selectedIndex?: number
}>;
export type QuizMessage = WithBase<{ kind: "quiz"; text?: string; questions: QuizQuestion[] }>;
export type QuickActionsMessage = WithBase<{ kind: "quickActions"; actions: QuickAction[] }>;
export type CityIntroMessage = WithBase<{
    kind: "cityIntro";
    title: string;
    tagline: string;
    segments: TextSegment[];
    image?: string
}>;
export type TeamMessage = WithBase<{ kind: "team"; text?: string; members: Figure[] }>;

export type TourConfirmedMessage = WithBase<{ kind: "tourConfirmed"; tour: Tour }>;
export type PlaceAddedMessage = WithBase<{ kind: "placeAdded"; place: Place }>;

export type ChatMessage =
    | TextMessage
    | PlacesMessage
    | TourMessage
    | TourOptionsMessage
    | TriviaMessage
    | QuizMessage
    | QuickActionsMessage
    | CityIntroMessage
    | TeamMessage
    | TourConfirmedMessage
    | PlaceAddedMessage;