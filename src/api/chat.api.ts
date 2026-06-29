import {BACKEND_URL} from "@/constants/index.constants";
import {Place} from "@/types/map/map.types";
import {ChatMessage} from "@/types/chat/chat.types";


export interface PlaceReview {
    author?: string;
    rating?: number;
    text?: string;
    when?: string;
}

export interface PlaceDetails extends Place {
    description?: string;
    reviews?: PlaceReview[];
    photos?: string[];
    website?: string;
    phone?: string;
    openNow?: boolean;
    hours?: string[];
    priceLevel?: number;
    userRatingCount?: number;
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function normalize(messages: Partial<ChatMessage>[]): ChatMessage[] {
    return messages.map((m) => ({id: m.id ?? uid(), createdAt: m.createdAt ?? Date.now(), ...m})) as ChatMessage[];
}

export const chatApi = {
    async sendMessage(history: ChatMessage[]): Promise<ChatMessage[]> {
        const context = history.slice(-12);
        const res = await fetch(`${BACKEND_URL}/chat`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({messages: context}),
        });
        if (!res.ok) throw new Error(`Chat API error: ${res.status}`);
        const data = (await res.json()) as { messages: Partial<ChatMessage>[] };
        return normalize(data.messages ?? []);
    },
};