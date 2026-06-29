import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { useSheets } from "@/components/main/sheets/SheetsProvider";
import {Place} from "@/types/map/map.types";

export default function PlaceAddedCard({ place }: { place: Place }) {
    const sheets = useSheets();

    return (
        <View className="rounded-2xl border border-teal-200 bg-white p-3 shadow-sm flex-row items-center gap-3">
            <View className="h-10 w-10 rounded-xl bg-teal-50 items-center justify-center">
                <MapPin size={20} color="#0F766E" />
            </View>

            <View className="flex-1">
                <Text className="text-[14px] font-semibold text-zinc-900">{place.name}</Text>
                <Text className="text-[12px] text-zinc-500">Added to your tour</Text>
            </View>

            <TouchableOpacity
                onPress={sheets.openPlan}
                className="bg-zinc-900 px-3 py-1.5 rounded-full"
            >
                <Text className="text-[11px] font-medium text-white">View Plan</Text>
            </TouchableOpacity>
        </View>
    );
}