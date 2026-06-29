import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {MapPin} from "lucide-react-native";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {MAP_COLORS} from "@/constants/map.constants";
import {useMapStore} from "@/store/useMapStore";


export default function PlanChip() {
    const plan = useMapStore((s) => s.plan);
    const sheets = useSheets();

    if (!plan) return null;

    return (
        <SafeAreaView edges={["bottom"]} pointerEvents="box-none" style={{position: "absolute", left: 16, bottom: 16}}>
            <TouchableOpacity
                onPress={sheets.openPlan}
                activeOpacity={0.9}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    maxWidth: 220,
                    backgroundColor: MAP_COLORS.surface,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: MAP_COLORS.border,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    shadowOffset: {width: 0, height: 3},
                    elevation: 4,
                }}
            >
                <MapPin size={16} color={MAP_COLORS.route}/>
                <View style={{flexShrink: 1}}>
                    <Text numberOfLines={1} style={{fontSize: 14, fontWeight: "600", color: MAP_COLORS.ink}}>
                        {plan.title}
                    </Text>
                    <Text style={{fontSize: 11, color: MAP_COLORS.inkMuted}}>
                        {plan.stops.length} stops · tap to edit
                    </Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}