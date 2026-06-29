import {useRouter} from "expo-router";
import {PREFERENCE_OPTIONS} from "@/constants/preferences.constants";
import {useAuthStore} from "@/store/useAuthStore";

export function useUserPreferences() {
    const router = useRouter();

    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const pace = useAuthStore((state) => state.pace);
    const vibe = useAuthStore((state) => state.vibe);
    const interests = useAuthStore((state) => state.interests);

    const storeToggle = useAuthStore((state) => state.togglePreference);
    const registerProfile = useAuthStore((state) => state.registerProfile);

    const selectedIds = new Set([...pace, ...vibe, ...interests]);


    const togglePreference = (id: string) => {
        const option = PREFERENCE_OPTIONS.find((o) => o.id === id);
        if (option) {
            storeToggle(id, option.category as 'pace' | 'vibe' | 'interest');
        }
    };


    const submitPreferences = async () => {
        await registerProfile();

        const updatedError = useAuthStore.getState().error;
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (!updatedError && isAuthenticated) {
            router.replace("/main");
        }
    };

    return {
        selectedIds,
        togglePreference,
        submitPreferences,
        isLoading: loading,
        error,
    };
}