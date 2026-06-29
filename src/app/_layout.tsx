import React, {useEffect} from "react";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";

import {
    useFonts,
    BricolageGrotesque_700Bold,
} from "@expo-google-fonts/bricolage-grotesque";

import "../global.css";
import {useAuthStore} from "@/store/useAuthStore";
import {
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold
} from "@expo-google-fonts/plus-jakarta-sans";
import {SpaceMono_400Regular} from "@expo-google-fonts/space-mono";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        BricolageGrotesque_700Bold,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
        SpaceMono_400Regular,
    });
    const {isInitialized, initAuth} = useAuthStore();

    useEffect(() => {
        void initAuth();
    }, []);

    useEffect(() => {
        if (fontsLoaded || fontError) {
            void SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded || !isInitialized) return null;

    return (
        <>
            <StatusBar style="dark"/>
            <Stack screenOptions={{headerShown: false}}/>
        </>
    );
}