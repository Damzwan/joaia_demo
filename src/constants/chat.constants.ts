import {FIGURES} from "@/constants/figures.constants";
import {Persona, QuickAction} from "@/types/chat/entities.types";
import {ChatMessage} from "@/types/chat/chat.types";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Message-voice personas (small attribution on guide bubbles). */
export const PERSONAS: Record<string, Persona> = {
    host: {id: "host", name: "Mira", role: "Your host", accentColor: "#0F766E"},
    historian: {id: "historian", name: "Huldrych", role: "Historian", accentColor: "#92400E"},
    foodie: {id: "foodie", name: "Lena", role: "Local foodie", accentColor: "#BE123C"},
    guideMaker: {id: "guideMaker", name: "Theo", role: "Tour builder", accentColor: "#1D4ED8"},
};

export const DEFAULT_ACTIONS: QuickAction[] = [
    {id: "a-tour", label: "Plan a tour", prompt: "Build me a tour of Zurich"},
    {id: "a-food", label: "Where to eat", prompt: "Where should I eat?"},
    {id: "a-transit", label: "Getting around", prompt: "How do I get around Zurich?"},
    {id: "a-trivia", label: "Quiz me", prompt: "Give me a trivia question"},
];

export const SEED_PLACES_MESSAGE_ID = "seed-places";

export function initialMessages(fallbackPlaces: any[]): ChatMessage[] {
    const t = Date.now();
    return [
        {
            id: uid(), kind: "cityIntro", role: "guide", personaId: "host", createdAt: t,
            title: "Zürich",
            tagline: "47.37° N · 8.54° E · Switzerland",
            segments: [
                {text: "Switzerland's largest city sits where the river "},
                {text: "Limmat", bold: true},
                {text: " leaves the lake. It's the cradle of the "},
                {text: "Swiss Reformation", bold: true},
                {text: ", a banking powerhouse along "},
                {text: "Bahnhofstrasse", bold: true},
                {text: ", and — unusually — a city where the "},
                {text: "lake water is clean enough to swim in", bold: true},
                {text: " all summer, with the Alps on the horizon."},
            ],
        },
        {
            id: uid(), kind: "team", role: "guide", personaId: "host", createdAt: t,
            text: "People who shaped Zürich — tap anyone to dig in:",
            members: FIGURES,
        },
        {
            // Stable id so hydrateSeedPlaces can find and refresh it post-fetch.
            id: SEED_PLACES_MESSAGE_ID, kind: "places", role: "guide", personaId: "host", createdAt: t,
            text: "And a few places travellers love — tap for details or add to a plan:",
            places: fallbackPlaces.slice(0, 3),
        },
        {
            id: uid(), kind: "quickActions", role: "guide", personaId: "host", createdAt: t,
            actions: [
                {id: "a-tour", label: "Plan a tour", prompt: "Build me a tour of Zurich"},
                {id: "a-food", label: "Where to eat", prompt: "Where should I eat?"},
                {id: "a-transit", label: "Getting around", prompt: "How do I get around Zurich?"},
                {id: "a-trivia", label: "Quiz me", prompt: "Give me a trivia question"},
            ],
        },
    ];
}