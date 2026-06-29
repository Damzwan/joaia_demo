import React from "react";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {ChevronRight, MapPin} from "lucide-react-native";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {useMapStore} from "@/store/useMapStore";


export default function PlanPreview() {
    const plan = useMapStore((s) => s.plan);
    const sheets = useSheets();
    if (!plan || plan.stops.length === 0) return null;

    return (
        <View className="mx-4 mb-2 rounded-2xl border border-teal-200 bg-teal-50/60 p-3">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                    <MapPin size={15} color="#0F766E"/>
                    <Text className="text-[13px] font-semibold text-zinc-900">{plan.title}</Text>
                    <Text className="text-[11px] text-zinc-500">· {plan.stops.length} stops</Text>
                </View>
                <TouchableOpacity onPress={sheets.openPlan} hitSlop={8} className="flex-row items-center gap-0.5">
                    <Text className="text-xs font-medium text-teal-700">Open</Text>
                    <ChevronRight size={13} color="#0F766E"/>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{gap: 6, paddingTop: 8}}>
                {plan.stops.map((s) => (
                    <TouchableOpacity
                        key={s.place.id}
                        onPress={() => sheets.showOnMap(s.place.id)}
                        className="flex-row items-center gap-1.5 rounded-full border border-teal-300 bg-white px-2.5 py-1"
                    >
                        <Text className="text-[11px] font-semibold text-teal-700">{s.order}</Text>
                        <Text className="text-[12px] text-zinc-700">{s.place.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}