import {create} from "zustand";
import {chatApi} from "@/api/chat.api";
import {initialMessages, SEED_PLACES_MESSAGE_ID} from "@/constants/chat.constants";
import {EXPLORE_POIS} from "@/constants/explore.constants";
import {useMapStore} from "@/store/useMapStore";
import {Tour} from "@/types/chat/entities.types";
import {ChatMessage} from "@/types/chat/chat.types";
import {Place} from "@/types/map/map.types";

type Status = "idle" | "thinking" | "error";

interface ChatState {
    messages: ChatMessage[];
    draft: string;
    status: Status;
    error: string | null;
}

interface ChatActions {
    setDraft: (text: string) => void;
    send: (override?: string) => Promise<void>;
    retryLast: () => Promise<void>;
    answerTrivia: (messageId: string, optionIndex: number) => void;
    confirmTourInChat: (tour: Tour) => void;
    confirmPlaceAddedInChat: (place: Place) => void;
    focusPlace: (placeId: string) => void;
    hydrateSeedPlaces: (places: Place[]) => void;
    reset: () => void;
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
    messages: initialMessages(EXPLORE_POIS),
    draft: "",
    status: "idle",
    error: null,

    setDraft: (text) => set({draft: text}),

    send: async (override) => {
        const text = (override ?? get().draft).trim();
        if (!text || get().status === "thinking") return;

        const userMsg: ChatMessage = {id: uid(), kind: "text", role: "user", createdAt: Date.now(), text};
        const pendingId = uid();

        set((s) => ({
            messages: [
                ...s.messages,
                userMsg,
                {id: pendingId, kind: "text", role: "guide", createdAt: Date.now(), text: "", pending: true},
            ],
            draft: override ? s.draft : "",
            status: "thinking",
            error: null,
        }));

        try {
            const history = get().messages.filter((m) => m.id !== pendingId);
            const replies = await chatApi.sendMessage(history);
            set((s) => ({messages: [...s.messages.filter((m) => m.id !== pendingId), ...replies], status: "idle"}));

            const fresh = collectPlaces(replies);
            const map = useMapStore.getState();
            if (fresh.length === 1) map.focusPlace(fresh[0]);
            else if (fresh.length) map.fitPlaces(fresh);
        } catch (err) {
            set((s) => ({
                messages: s.messages.filter((m) => m.id !== pendingId),
                status: "error",
                error: err instanceof Error ? err.message : "Couldn't reach the guide.",
            }));
        }
    },

    retryLast: async () => {
        const lastUser = [...get().messages].reverse().find((m) => m.role === "user" && m.kind === "text");
        if (lastUser?.kind === "text") await get().send(lastUser.text);
    },

    answerTrivia: (messageId, optionIndex) =>
        set((s) => ({
            messages: s.messages.map((m) =>
                m.id === messageId && m.kind === "trivia" ? {...m, selectedIndex: optionIndex} : m
            ),
        })),

    confirmTourInChat: (tour) => {
        set((s) => ({
            messages: [
                ...s.messages,
                {id: uid(), kind: "tourConfirmed", role: "guide", personaId: "guideMaker", createdAt: Date.now(), tour},
            ],
        }));
    },

    confirmPlaceAddedInChat: (place) => {
        set((s) => ({
            messages: [
                ...s.messages,
                {id: uid(), kind: "placeAdded", role: "guide", personaId: "guideMaker", createdAt: Date.now(), place},
            ],
        }));
    },

    focusPlace: (placeId) => {
        const map = useMapStore.getState();
        const place =
            selectMarkers(get()).find((p) => p.id === placeId) ??
            map.searchResults.find((p) => p.id === placeId) ??
            map.explore.find((p) => p.id === placeId);
        if (place) map.focusPlace(place);
        else map.setFocusedPlaceId(placeId);
    },

    hydrateSeedPlaces: (places) => {
        if (!places.length) return;
        const next = places.slice(0, 3);
        set((s) => ({
            messages: s.messages.map((m) =>
                m.id === SEED_PLACES_MESSAGE_ID && m.kind === "places" ? {...m, places: next} : m
            ),
        }));
    },

    reset: () => {
        useMapStore.getState().resetMapState();
        set({
            messages: initialMessages(useMapStore.getState().explore),
            draft: "",
            status: "idle",
            error: null,
        });
    },
}));

function collectPlaces(messages: ChatMessage[]): Place[] {
    const out: Place[] = [];
    for (const m of messages) {
        if (m.kind === "places") out.push(...m.places);
        if (m.kind === "tour") out.push(...m.tour.stops.map((s) => s.place));
        if (m.kind === "tourOptions") out.push(...m.tours.flatMap((t) => t.stops.map((s) => s.place)));
    }
    return out;
}

export function selectMarkers(state: ChatState): Place[] {
    const plan = useMapStore.getState().plan;
    const all = [...collectPlaces(state.messages), ...(plan?.stops.map((s) => s.place) ?? [])];
    const seen = new Set<string>();
    return all.filter((p) => !seen.has(p.id) && seen.add(p.id));
}