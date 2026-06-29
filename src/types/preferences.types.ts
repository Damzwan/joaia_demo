export interface PreferenceOption {
    id: string;
    label: string;
    emoji: string;
    category: 'pace' | 'vibe' | 'interest';
}

export interface UserPreferences {
    pace: string[];
    vibe: string[];
    interests: string[];
}