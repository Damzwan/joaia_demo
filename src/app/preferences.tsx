import React, {useRef} from "react";
import {
    ScrollView,
    Text,
    Pressable,
    View,
    ActivityIndicator,
    Animated,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {PREFERENCE_OPTIONS} from "@/constants/preferences.constants";
import {useUserPreferences} from "@/hooks/useUserPreferences";
import LOGO from "@/assets/logo.svg";
import {PreferenceOption} from "@/types/preferences.types";

export default function PreferencesScreen() {
    const {selectedIds, togglePreference, submitPreferences, isLoading, error} = useUserPreferences();

    const renderCategorySection = (title: string, category: 'pace' | 'vibe' | 'interest') => {
        const filtered = PREFERENCE_OPTIONS.filter(item => item.category === category);
        return (
            <View className="mb-10">
                <Text className="font-sans font-bold uppercase tracking-wider text-text-soft mb-4 px-1">
                    {title}
                </Text>
                {/* Increased both horizontal and vertical gap distributions to 3 (12px) */}
                <View className="flex-row flex-wrap gap-x-3 gap-y-3 mt-2">
                    {filtered.map((item) => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                            <PreferenceChip
                                key={item.id}
                                item={item}
                                isSelected={isSelected}
                                onPress={() => togglePreference(item.id)}
                            />
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background px-6">
            {/* Header - Aligned to exact login sizing configuration */}
            <View className="items-center pt-4 pb-2">
                <LOGO width={156} height={96}/>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 40}}
            >
                <View className="mt-2 mb-8">
                    <Text className="font-display text-3xl leading-tight text-text">
                        Tailor your guide
                    </Text>
                    <Text className="mt-1.5 font-body text-base text-text-soft">
                        Select what maps out your perfect journey.
                    </Text>
                </View>

                {/* Error Banner Injection Block */}
                {error && (
                    <View className="mt-6 p-3.5 rounded-2xl bg-red-50 border border-red-200">
                        <Text className="font-sans text-xs text-red-600 font-medium">{error}</Text>
                    </View>
                )}

                {/* Structured Chip Grids */}
                {renderCategorySection("Travel Pace", "pace")}
                {renderCategorySection("Overall Vibe", "vibe")}
                {renderCategorySection("Core Interests", "interest")}
            </ScrollView>

            {/* Bottom Floating Action Frame */}
            <View className="pt-2 pb-4">
                <PrimarySubmitButton
                    label="Start exploring"
                    onPress={submitPreferences}
                    loading={isLoading}
                />
            </View>
        </SafeAreaView>
    );
}

/* ------------------------------------------------------------------ */

function PreferenceChip({
                            item,
                            isSelected,
                            onPress,
                        }: {
    item: PreferenceOption;
    isSelected: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
            className={`flex-row items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all ${
                isSelected
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
            }`}
        >
            <Text className="text-base">{item.emoji}</Text>
            <Text
                className={`font-sans text-sm font-medium ${
                    isSelected ? "text-primary-foreground" : "text-text"
                }`}
            >
                {item.label}
            </Text>
        </Pressable>
    );
}

function PrimarySubmitButton({
                                 label,
                                 onPress,
                                 loading,
                             }: {
    label: string;
    onPress: () => void;
    loading: boolean;
}) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (!loading) {
            Animated.spring(scale, {toValue: 0.98, useNativeDriver: true}).start();
        }
    };

    const handlePressOut = () => {
        Animated.spring(scale, {toValue: 1, useNativeDriver: true}).start();
    };

    return (
        <Pressable
            disabled={loading}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View
                style={{transform: [{scale}]}}
                className="h-16 items-center justify-center rounded-full bg-primary flex-row gap-2"
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small"/>
                ) : (
                    <Text className="font-sans text-lg font-medium text-primary-foreground">
                        {label}
                    </Text>
                )}
            </Animated.View>
        </Pressable>
    );
}