import React from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {Clock, ChevronRight, Map as MapIcon} from "lucide-react-native";
import {Tour} from "@/types/chat/entities.types";

export default function TourCard({
                                     tour,
                                     full,
                                     onChoose,
                                     onViewMap,
                                     onPreviewStop
                                 }: {
    tour: Tour;
    full?: boolean;
    onChoose: () => void;
    onViewMap: () => void;
    onPreviewStop: (id: string) => void;
}) {
    const hero = tour.stops.find((s) => s.place.thumbnail)?.place.thumbnail;

    return (
        <View
            style={full ? undefined : {width: 280}}
            className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"
        >
            {hero ? (
                <View>
                    <Image source={{uri: hero}} style={{width: "100%", height: 130}} resizeMode="cover"/>
                    <View className="absolute left-0 right-0 bottom-0 px-3 pt-5 pb-2 bg-black/60">
                        <Text className="text-[17px] font-bold text-white">{tour.title}</Text>
                    </View>
                </View>
            ) : (
                <View className="px-4 py-4 bg-primary">
                    <Text className="text-[17px] font-bold text-white">{tour.title}</Text>
                </View>
            )}

            <View className="p-4">
                <View className="mb-2 flex-row items-center gap-1.5">
                    <Clock size={13} color="#71717a"/>
                    <Text className="text-[12px] font-medium text-zinc-500 uppercase tracking-wide">
                        {tour.stops.length} stops{tour.durationMinutes ? ` · ~${Math.round(tour.durationMinutes / 60)}h` : ""}
                    </Text>
                </View>

                {tour.summary && (
                    <Text className="mb-3 text-[14px] leading-relaxed text-zinc-600">{tour.summary}</Text>
                )}

                <View className="mb-2 rounded-xl bg-indigo-50/50 p-2 border border-indigo-100/50">
                    {tour.stops.map((s) => (
                        <TouchableOpacity key={s.place.id} onPress={() => onPreviewStop(s.place.id)}
                                          className="flex-row items-center gap-2.5 py-1.5 px-1">
                            <View className="h-5 w-5 items-center justify-center rounded-full bg-indigo-100">
                                <Text className="text-[10px] font-bold text-indigo-700">{s.order}</Text>
                            </View>
                            <Text className="flex-1 text-[13.5px] font-medium text-zinc-700"
                                  numberOfLines={1}>{s.place.name}</Text>
                            <ChevronRight size={14} color="#94a3b8"/>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="mt-3 flex-row gap-2">
                    <TouchableOpacity onPress={onViewMap}
                                      className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border-2 border-zinc-200 py-3">
                        <MapIcon size={14} color="#18181b"/>
                        <Text className="text-[13px] font-bold text-zinc-900">Preview</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onChoose}
                                      className="flex-1 flex-row items-center justify-center gap-1 rounded-xl py-3 bg-primary">
                        <Text className="text-[13px] font-bold text-white">Accept Plan</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}