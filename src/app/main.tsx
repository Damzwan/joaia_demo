// @/screens/MainScreen.tsx
import React from "react";
import {View} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

import MapLayer from "@/components/main/map/MapLayer";
import {SheetsProvider} from "@/components/main/sheets/SheetsProvider";

export default function MainScreen() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <BottomSheetModalProvider>
                <SheetsProvider>
                    <View className="flex-1 bg-white">
                        <MapLayer/>
                    </View>
                </SheetsProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}