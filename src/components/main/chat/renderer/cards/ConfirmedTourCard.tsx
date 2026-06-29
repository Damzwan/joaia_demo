import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { useSheets } from "@/components/main/sheets/SheetsProvider";
import {Tour} from "@/types/chat/entities.types";

export default function ConfirmedTourCard({ tour }: { tour: Tour }) {
    const sheets = useSheets();

    return (
        <View className="rounded-2xl border-2 border-teal-600 bg-teal-50 p-4">
            <View className="flex-row items-center gap-2 mb-2">
                <View className="rounded-full bg-teal-600 p-1.5">
                    <MapPin size={16} color="#fff" />
                </View>
                <Text className="text-[16px] font-bold text-teal-900">Plan Pinned</Text>
            </View>

            <Text className="text-[15px] font-semibold text-zinc-900 mb-1">{tour.title}</Text>
            <Text className="text-[13px] text-teal-800 font-medium mb-3">
                {tour.stops.length} stops · Ready in your map view
            </Text>

            <TouchableOpacity
                onPress={() => {
                    sheets.closeChat()
                    sheets.openPlan()
                }}
                className="bg-teal-600 rounded-xl py-2.5 items-center"
            >
                <Text className="text-sm font-semibold text-white">View My Plan</Text>
            </TouchableOpacity>
        </View>
    );
}