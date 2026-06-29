import { Place } from "@/types/map/map.types";

export interface Persona {
    id: string;
    name: string;
    role: string;
    avatar?: number | string;
    accentColor?: string;
    blurb?: string;
}

export interface Figure {
    id: string;
    name: string;
    years?: string;
    field: string;
    blurb: string;
    bio: string;
    accentColor?: string;
    avatar?: string;
    relatedPlace?: string;
    imageUrl?: string;
}

export interface TourStop {
    order: number;
    place: Place;
    note?: string;
}

export interface Tour {
    id: string;
    title: string;
    stops: TourStop[];
    durationMinutes?: number;
    summary?: string;
}

export interface QuickAction {
    id: string;
    label: string;
    prompt: string;
    icon?: string;
}

export interface TextSegment {
    text: string;
    bold?: boolean;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answerIndex: number;
}