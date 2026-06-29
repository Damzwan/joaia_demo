import {UserPreferences} from "@/types/preferences.types";
import {BACKEND_URL} from "@/constants/index.constants";

export interface NetworkUserResponse {
    success: boolean;
    userId: string;
}

export interface UserProfile {
    _id: string;
    preferences: UserPreferences;
    createdAt?: string;
}

export const userApi = {
    async createUserProfile(preferences: UserPreferences): Promise<NetworkUserResponse> {
        const response = await fetch(`${BACKEND_URL}/users`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({preferences}),
        });
        if (!response.ok) throw new Error(`API Error: Status ${response.status}`);
        return response.json();
    },

    async getUserProfile(id: string): Promise<UserProfile> {
        const response = await fetch(`${BACKEND_URL}/users/${id}`);
        if (!response.ok) throw new Error(`API Error: Status ${response.status}`);
        return response.json();
    },
};