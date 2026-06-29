import React from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    type NativeSyntheticEvent,
    type NativeScrollEvent,
} from "react-native";
import {X, Check, Clock, MapPin} from "lucide-react-native";

import {useMapStore} from "@/store/useMapStore";
import {useChatStore} from "@/store/useChatStore";

const {width} = Dimensions.get("window");

const CARD_W = width - 56;
const GAP = 12;

export default function PreviewTourBar() {
    const previewTours = useMapStore((s) => s.previewTours);
    const previewTour = useMapStore((s) => s.previewTour);

    const setActivePreview = useMapStore((s) => s.setActivePreview);
    const clearPreview = useMapStore((s) => s.clearPreview);

    const chooseTour = useMapStore((s) => s.chooseTour);

    if (!previewTours.length) return null;

    const onMomentumEnd = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const idx = Math.round(
            e.nativeEvent.contentOffset.x / (CARD_W + GAP)
        );

        const tour = previewTours[idx];

        if (tour && tour.id !== previewTour?.id) {
            setActivePreview(tour);
        }
    };

    return (
        <View
            className="absolute left-0 right-0 bottom-7"
            pointerEvents="box-none"
        >
            {/* Top pill */}
            <View
                className="self-center mb-3 flex-row items-center rounded-full bg-surface border border-border px-4 py-2"
            >
                <Text className="font-sans text-sm font-semibold text-text mr-3">
                    {previewTours.length === 1
                        ? "Previewing route"
                        : `Comparing ${previewTours.length} routes`}
                </Text>

                <TouchableOpacity
                    onPress={clearPreview}
                    hitSlop={10}
                    className="h-7 w-7 rounded-full bg-background items-center justify-center"
                >
                    <X size={15} color="rgb(115 115 115)"/>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                snapToInterval={CARD_W + GAP}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 28,
                    gap: GAP,
                }}
                onMomentumScrollEnd={onMomentumEnd}
            >
                {previewTours.map((tour, i) => {
                    const active =
                        tour.id === previewTour?.id;

                    const hero =
                        tour.stops.find(
                            (s) => s.place.thumbnail
                        )?.place.thumbnail;

                    return (
                        <View
                            key={tour.id}
                            className={`overflow-hidden rounded-[28px] bg-surface shadow-lg ${
                                active
                                    ? "border-2 border-primary"
                                    : "border border-border"
                            }`}
                            style={{
                                width: CARD_W,
                                elevation: 8,
                            }}
                        >
                            {/* Hero */}
                            <View className="relative h-[104px] bg-background">
                                {hero ? (
                                    <Image
                                        source={{
                                            uri: hero,
                                        }}
                                        resizeMode="cover"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                ) : (
                                    <View className="flex-1 items-center justify-center">
                                        <MapPin
                                            size={28}
                                            color="rgb(99 102 241)"
                                        />
                                    </View>
                                )}

                                {/* Option chip */}
                                <View
                                    className="absolute left-3 top-3 rounded-full bg-surface/90 border border-border px-3 py-1">
                                    <Text className="font-sans text-[11px] font-bold text-text">
                                        Option {i + 1} of{" "}
                                        {previewTours.length}
                                    </Text>
                                </View>
                            </View>

                            {/* Content */}
                            <View className="p-4">
                                <Text
                                    numberOfLines={1}
                                    className="font-display text-lg text-text"
                                >
                                    {tour.title}
                                </Text>

                                <View className="mt-1 flex-row items-center gap-1.5">
                                    <Clock
                                        size={13}
                                        color="rgb(115 115 115)"
                                    />

                                    <Text className="font-sans text-xs font-medium text-text-soft">
                                        {tour.stops.length} stops
                                        {tour.durationMinutes
                                            ? ` · ~${Math.round(
                                                tour.durationMinutes /
                                                60
                                            )}h`
                                            : ""}
                                    </Text>
                                </View>

                                {tour.summary ? (
                                    <Text
                                        numberOfLines={2}
                                        className="mt-3 font-body text-sm leading-5 text-text-soft"
                                    >
                                        {tour.summary}
                                    </Text>
                                ) : null}

                                <View className="mt-5 flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={clearPreview}
                                        style={{flex: 1}}
                                        className="items-center justify-center rounded-2xl border border-border bg-background py-3"
                                    >
                                        <Text className="font-sans font-semibold text-text-soft">
                                            Discard
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => chooseTour(tour)}
                                        style={{flex: 1}}
                                        className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-3"
                                    >
                                        <Check
                                            size={16}
                                            color="#FFFFFF"
                                        />

                                        <Text className="font-sans font-semibold text-primary-foreground">
                                            Use this plan
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}