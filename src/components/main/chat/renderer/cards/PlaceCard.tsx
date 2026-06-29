import React from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {MapPin, Star, Plus} from "lucide-react-native";
import {TINT} from "@/constants/theme.constants";
import {Place} from "@/types/map/map.types";

export default function PlaceCard({place, full, onOpen, onAdd}: {
    place: Place;
    full?: boolean;
    onOpen: () => void;
    onAdd: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onOpen}
            style={full ? undefined : {width: 232}}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
        >
            {place.thumbnail ? (
                <Image source={{uri: place.thumbnail}} style={{width: "100%", height: 132}} resizeMode="cover"/>
            ) : (
                <View style={{height: 132}} className="items-center justify-center bg-teal-50">
                    <MapPin size={26} color={TINT}/>
                </View>
            )}
            <View className="p-3">
                <Text className="text-[16px] font-semibold text-zinc-900">{place.name}</Text>
                {place.note && (
                    <Text className="mt-0.5 text-[13px] leading-snug text-zinc-600" numberOfLines={2}>
                        {place.note}
                    </Text>
                )}
                <View className="mt-2.5 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                        {place.rating && (
                            <View className="flex-row items-center gap-1">
                                <Star size={12} color="#ca8a04" fill="#ca8a04"/>
                                <Text className="text-xs text-zinc-600">{place.rating}</Text>
                            </View>
                        )}
                        <Text className="text-xs font-medium text-teal-700">Details</Text>
                    </View>
                    <TouchableOpacity
                        onPress={onAdd}
                        hitSlop={8}
                        className="flex-row items-center gap-1 rounded-full bg-zinc-900 px-3 py-1.5"
                    >
                        <Plus size={13} color="#fff"/>
                        <Text className="text-xs font-medium text-white">Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}