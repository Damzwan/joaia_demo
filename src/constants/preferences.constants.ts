import {PreferenceOption} from "@/types/preferences.types";

export const PREFERENCE_OPTIONS: PreferenceOption[] = [
    {id: 'slow', label: 'Slow & Chill', emoji: '🧘', category: 'pace'},
    {id: 'packed', label: 'Packed Itinerary', emoji: '🏃‍♂️', category: 'pace'},
    {id: 'spontaneous', label: 'Spontaneous', emoji: '🎲', category: 'pace'},

    {id: 'cultural', label: 'Cultural & Historic', emoji: '🏛️', category: 'vibe'},
    {id: 'nature', label: 'Nature & Wildlife', emoji: '🌲', category: 'vibe'},
    {id: 'culinary', label: 'Foodie Havens', emoji: '🍝', category: 'vibe'},
    {id: 'adventure', label: 'Action & Adventure', emoji: '🧗‍♀️', category: 'vibe'},

    {id: 'hidden', label: 'Hidden Gems', emoji: '💎', category: 'interest'},
    {id: 'local', label: 'Local Hangouts', emoji: '☕', category: 'interest'},
    {id: 'photo', label: 'Photogenic Spots', emoji: '📸', category: 'interest'},
    {id: 'shopping', label: 'Markets & Shops', emoji: '🛍️', category: 'interest'},
];