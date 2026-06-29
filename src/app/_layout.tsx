import React, {useEffect} from "react";
import {Stack} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";

import "../global.css";
import {useAuthStore} from "@/store/useAuthStore";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const {isInitialized, initAuth} = useAuthStore();

    useEffect(() => {
        void initAuth();
    }, []);

    useEffect(() => {

        if (isInitialized) {
            void SplashScreen.hideAsync();
        }
    }, [isInitialized]);


    return (
        <>
            <StatusBar style="dark"/>
            <Stack screenOptions={{headerShown: false}}/>
        </>
    );
}