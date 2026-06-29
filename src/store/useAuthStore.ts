import {create} from "zustand";
import * as SecureStore from "expo-secure-store";
import {userApi} from "@/api/user.api";
import {SECURE_STORE_KEYS} from "@/constants/index.constants";
import {UserPreferences} from "@/types/preferences.types";

interface AuthState {
    isInitialized: boolean;
    isAuthenticated: boolean;
    hasCompletedPreferences: boolean;
    loading: boolean;
    hydrating: boolean;
    error: string | null;
    pace: string[];
    vibe: string[];
    interests: string[];
}

interface AuthActions {
    initAuth: () => Promise<void>;
    togglePreference: (id: string, category: "pace" | "vibe" | "interest") => void;
    registerProfile: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    isInitialized: false,
    isAuthenticated: false,
    hasCompletedPreferences: false,
    loading: false,
    hydrating: false,
    error: null,
    pace: [],
    vibe: [],
    interests: [],

    initAuth: async () => {
        let storedId: string | null = null;
        try {
            storedId = await SecureStore.getItemAsync(SECURE_STORE_KEYS.USER_ID);
        } catch {
            set({isInitialized: true, isAuthenticated: false, hasCompletedPreferences: false});
            return;
        }

        if (!storedId) {
            set({isInitialized: true, isAuthenticated: false, hasCompletedPreferences: false});
            return;
        }

        set({isAuthenticated: true, hasCompletedPreferences: true, isInitialized: true, hydrating: true});

        try {
            const profile = await userApi.getUserProfile(storedId);
            const prefs: UserPreferences = profile.preferences ?? {pace: [], vibe: [], interests: []};
            set({
                pace: prefs.pace ?? [],
                vibe: prefs.vibe ?? [],
                interests: prefs.interests ?? [],
                hydrating: false,
            });
        } catch (error) {
            console.warn("[auth] profile hydrate failed; continuing without preferences", error);
            set({hydrating: false});
        }
    },

    // TODO move to preferences store
    togglePreference: (id, category) => {
        const categoryKey = category === "interest" ? "interests" : category;
        const currentList = get()[categoryKey];
        const updated = currentList.includes(id)
            ? currentList.filter((item) => item !== id)
            : [...currentList, id];
        set({[categoryKey]: updated, error: null});
    },

    clearError: () => set({error: null}),

    registerProfile: async () => {
        const {pace, vibe, interests} = get();
        if (pace.length === 0 && vibe.length === 0 && interests.length === 0) {
            set({error: "Please select at least one preference to curate your guide."});
            return;
        }

        set({loading: true, error: null});
        const preferences: UserPreferences = {pace, vibe, interests};

        try {
            const data = await userApi.createUserProfile(preferences);
            if (data && data.userId) {
                await SecureStore.setItemAsync(SECURE_STORE_KEYS.USER_ID, data.userId);
            }
            set({isAuthenticated: true, hasCompletedPreferences: true});
        } catch (error) {
            console.warn("[auth] profile create failed; entering local demo mode", error);
            set({isAuthenticated: true, hasCompletedPreferences: true});
        } finally {
            set({loading: false});
        }
    },
}));