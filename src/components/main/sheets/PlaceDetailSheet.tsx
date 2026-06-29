import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {View, Text, ActivityIndicator, Image, Linking, TouchableOpacity} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {BottomSheetModal, BottomSheetScrollView, useBottomSheetModal} from "@gorhom/bottom-sheet";
import {
    X,
    ArrowLeft,
    Plus,
    Navigation,
    Globe,
    Star,
    UtensilsCrossed,
    Sparkles,
    Check,
    Trash2
} from "lucide-react-native";

import {type PlaceDetails} from "@/api/chat.api";
import {placesApi} from "@/api/places.api";
import {useChatStore, selectMarkers} from "@/store/useChatStore";
import {useMapStore} from "@/store/useMapStore";
import {useSheets} from "@/components/main/sheets/SheetsProvider";

export interface SheetProps {
    onChange?: (index: number) => void;
}

type LoadState =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "ready"; data: PlaceDetails };

const FOOD_CATEGORIES = new Set(["restaurant", "cafe", "food", "bakery", "bar"]);

const PlaceDetailSheet = forwardRef<BottomSheetModal, SheetProps>(({onChange}, ref) => {
    const innerRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
        present: () => innerRef.current?.present(),
        dismiss: () => innerRef.current?.dismiss(),
        snapToIndex: (index: number) => innerRef.current?.snapToIndex(index),
    } as unknown as BottomSheetModal));

    const {dismiss} = useBottomSheetModal();
    const sheets = useSheets();

    const selectedPlaceId = useMapStore((s) => s.selectedPlaceId);
    const clearSearch = useMapStore((s) => s.clearSearch);
    const placeOrigin = useMapStore((s) => s.placeOrigin);
    const setSelectedPlaceId = useMapStore((s) => s.setSelectedPlaceId);
    const clearFocus = useMapStore((s) => s.clearFocus);

    const plan = useMapStore((s) => s.plan);
    const addPlaceToTour = useMapStore((s) => s.addPlaceToTour);
    const removeTourStop = useMapStore((s) => s.removeTourStop);

    const isPlaceInPlan = !!plan?.stops.some((st) => st.place.id === selectedPlaceId);
    const canGoBack = placeOrigin === "search" || placeOrigin === "plan";

    const knownPlace = useChatStore((s) => selectMarkers(s).find((p) => p.id === selectedPlaceId));

    const [state, setState] = useState<LoadState>({status: "loading"});

    useEffect(() => {
        if (!selectedPlaceId) return;
        let isCancelled = false;
        setState({status: "loading"});
        placesApi
            .getDetails(selectedPlaceId)
            .then((data) => {
                if (!isCancelled) setState({status: "ready", data});
            })
            .catch((err) => {
                if (!isCancelled) setState({
                    status: "error",
                    message: err instanceof Error ? err.message : "Failed to load details"
                });
            });
        return () => {
            isCancelled = true;
        };
    }, [selectedPlaceId]);

    const detail = state.status === "ready" ? state.data : undefined;
    const name = detail?.name ?? knownPlace?.name ?? "Place";
    const isFood = FOOD_CATEGORIES.has((detail?.category ?? knownPlace?.category ?? "").toLowerCase());

    // Clean up all reference selections when closed completely
    const handleCloseCleanup = () => {
        setSelectedPlaceId(null);
        clearFocus();
    };

    const handleShowOnMap = () => {
        const place = detail ?? knownPlace;
        if (place) useMapStore.getState().focusPlace(place);
        sheets.closeChat?.();
        innerRef.current?.snapToIndex(0);
    };

    const handleAskGuide = () => {
        dismiss();
        sheets.ask(`Tell me more about ${name}`);
    };

    const handleAdd = () => {
        if (detail) addPlaceToTour(detail);
        clearSearch();
        dismiss();
    };

    const handleRemove = () => {
        if (selectedPlaceId) removeTourStop(selectedPlaceId);
    };

    const handleViewPlan = () => {
        dismiss();
        sheets.openPlan();
    };

    const handleBack = () => {
        dismiss();
        if (placeOrigin === "search") sheets.openSearchResults();
        else if (placeOrigin === "plan") sheets.openPlan();
    };

    return (
        <BottomSheetModal
            ref={innerRef}
            snapPoints={["45%", "85%"]}
            index={0}
            enableDynamicSizing={false}
            onChange={onChange}
            // ✅ FIX: Triggers selection cleanup whenever closed or swiped down
            onDismiss={handleCloseCleanup}
            backgroundStyle={{backgroundColor: "#ffffff"}}
        >
            <View className="px-4 pb-3 pt-1 border-b border-zinc-100">
                <View className="flex-row items-center justify-between mb-2">
                    {canGoBack && (
                        <TouchableOpacity onPress={handleBack} hitSlop={12}
                                          className="h-8 w-8 items-center justify-center rounded-full bg-zinc-100 mr-2 active:bg-zinc-200">
                            <ArrowLeft size={18} color="#3f3f46"/>
                        </TouchableOpacity>
                    )}
                    <Text className="flex-1 pr-4 text-xl font-bold text-zinc-900" numberOfLines={1}>{name}</Text>
                    <TouchableOpacity onPress={() => dismiss()} hitSlop={12}
                                      className="h-8 w-8 items-center justify-center rounded-full bg-zinc-100 active:bg-zinc-200">
                        <X size={18} color="#3f3f46"/>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={handleAskGuide} activeOpacity={0.85}
                                  className="flex-row items-center justify-between rounded-xl bg-teal-50 border border-teal-100 px-4 py-3">
                    <View className="flex-row items-center gap-2.5 flex-1">
                        <View className="h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
                            <Sparkles size={14} color="#ffffff"/>
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-teal-800 uppercase tracking-wider">AI
                                Assistant</Text>
                            <Text className="text-[14px] font-semibold text-teal-950" numberOfLines={1}>Ask your guide
                                about {name}…</Text>
                        </View>
                    </View>
                    <Text className="text-teal-600 font-bold ml-2">→</Text>
                </TouchableOpacity>
            </View>

            <BottomSheetScrollView contentContainerStyle={{paddingBottom: 40, paddingTop: 12}}>
                {state.status === "loading" && (
                    <View className="items-center py-16">
                        <ActivityIndicator color="#0F766E"/>
                        <Text className="mt-3 text-sm text-zinc-500">Loading details…</Text>
                    </View>
                )}

                {state.status === "error" &&
                    <Text className="px-4 py-10 text-center text-sm text-rose-600">{state.message}</Text>}

                {detail && (
                    <>
                        {detail.photos?.length ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{paddingHorizontal: 16, gap: 10}} className="mb-4">
                                {detail.photos.map((uri, i) => (
                                    <Image key={i} source={{uri}} style={{
                                        width: 280,
                                        height: 160,
                                        borderRadius: 16,
                                        backgroundColor: "#f4f4f5"
                                    }} resizeMode="cover"/>
                                ))}
                            </ScrollView>
                        ) : null}

                        <View className="px-4">
                            <View
                                className="flex-row flex-wrap items-center gap-x-3 gap-y-1.5 bg-zinc-50 border border-zinc-100 p-3 rounded-2xl">
                                {detail.category && <Text
                                    className="text-sm font-medium capitalize text-zinc-600">{detail.category.replace(/_/g, " ")}</Text>}
                                {detail.rating && (
                                    <View className="flex-row items-center gap-1 border-l border-zinc-200 pl-3">
                                        <Star size={13} color="#ca8a04" fill="#ca8a04"/>
                                        <Text className="text-sm font-semibold text-zinc-800">
                                            {detail.rating}
                                            {detail.userRatingCount ? <Text
                                                className="text-zinc-400 font-normal"> ({detail.userRatingCount})</Text> : ""}
                                        </Text>
                                    </View>
                                )}
                                {detail.openNow !== null && (
                                    <View className="flex-row items-center border-l border-zinc-200 pl-3">
                                        <Text
                                            className={`text-sm font-semibold ${detail.openNow ? "text-emerald-700" : "text-rose-600"}`}>{detail.openNow ? "● Open now" : "● Closed"}</Text>
                                    </View>
                                )}
                                {detail.priceLevel && <Text
                                    className="text-sm text-zinc-400 border-l border-zinc-200 pl-3 font-medium">{"$".repeat(detail.priceLevel)}</Text>}
                            </View>

                            <View className="mt-4 flex-row gap-2">
                                <TouchableOpacity onPress={handleShowOnMap}
                                                  className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3.5 active:bg-zinc-50">
                                    <Navigation size={16} color="#18181b"/>
                                    <Text className="text-sm font-semibold text-zinc-900">Show on map</Text>
                                </TouchableOpacity>

                                {isPlaceInPlan ? (
                                    <TouchableOpacity onPress={handleViewPlan}
                                                      className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 active:opacity-90">
                                        <Check size={16} color="#fff"/>
                                        <Text className="text-sm font-semibold text-white">In your plan</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={handleAdd}
                                                      className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3.5 active:opacity-90">
                                        <Plus size={16} color="#fff"/>
                                        <Text className="text-sm font-semibold text-white">Add to plan</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {isPlaceInPlan && (
                                <TouchableOpacity onPress={handleRemove}
                                                  className="mt-2 flex-row items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white py-3 active:bg-rose-50">
                                    <Trash2 size={15} color="#e11d48"/>
                                    <Text className="text-sm font-semibold text-rose-600">Remove from plan</Text>
                                </TouchableOpacity>
                            )}

                            {detail.website && (
                                <TouchableOpacity onPress={() => Linking.openURL(detail.website!)}
                                                  className="mt-2 flex-row items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 active:bg-zinc-50">
                                    {isFood ? <UtensilsCrossed size={16} color="#18181b"/> :
                                        <Globe size={16} color="#18181b"/>}
                                    <Text
                                        className="text-sm font-semibold text-zinc-900">{isFood ? "Menu & Website" : "Visit Website"}</Text>
                                </TouchableOpacity>
                            )}

                            {(detail.description || knownPlace?.note) && (
                                <View className="mt-5">
                                    <Text
                                        className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">About</Text>
                                    <Text
                                        className="text-[15px] leading-relaxed text-zinc-800">{detail.description ?? knownPlace?.note}</Text>
                                </View>
                            )}

                            {detail.address && (
                                <View className="mt-4 pt-4 border-t border-zinc-100">
                                    <Text
                                        className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Address</Text>
                                    <Text className="text-sm text-zinc-600 leading-normal">{detail.address}</Text>
                                </View>
                            )}

                            {detail.reviews?.length ? (
                                <View className="mt-6">
                                    <Text className="mb-3 text-[15px] font-bold text-zinc-900">What people say</Text>
                                    {detail.reviews.slice(0, 3).map((r, i) => (
                                        <View key={i}
                                              className="mb-2.5 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                                            <View className="mb-2 flex-row items-center justify-between">
                                                <Text className="text-[13px] font-bold text-zinc-800"
                                                      numberOfLines={1}>{r.author ?? "Visitor"}</Text>
                                                {r.rating && (
                                                    <View
                                                        className="flex-row items-center gap-0.5 rounded-full bg-white border border-zinc-100 px-2 py-0.5">
                                                        <Star size={10} color="#ca8a04" fill="#ca8a04"/>
                                                        <Text
                                                            className="text-[11px] font-bold text-zinc-700">{r.rating}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            {r.text && <Text className="text-[13px] leading-relaxed text-zinc-600"
                                                             numberOfLines={4}>"{r.text}"</Text>}
                                            {r.when && <Text
                                                className="mt-2 text-[11px] font-medium text-zinc-400">{r.when}</Text>}
                                        </View>
                                    ))}
                                </View>
                            ) : null}
                        </View>
                    </>
                )}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

PlaceDetailSheet.displayName = "PlaceDetailSheet";
export default PlaceDetailSheet;