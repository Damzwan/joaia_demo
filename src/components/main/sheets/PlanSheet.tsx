import React, {forwardRef, useCallback, useImperativeHandle, useRef} from "react";
import {Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import {
    BottomSheetFlatList,
    BottomSheetFooter,
    type BottomSheetFooterProps,
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal
} from "@gorhom/bottom-sheet";
import DraggableFlatList, {type RenderItemParams, ScaleDecorator} from "react-native-draggable-flatlist";
import {Compass, GripVertical, Map as MapIcon, MapPin, Sparkles, Trash2, X} from "lucide-react-native";
import {useMapStore} from "@/store/useMapStore";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {MAP_COLORS} from "@/constants/map.constants";
import {TourStop} from "@/types/chat/entities.types";
import {Place} from "@/types/map/map.types";

export interface SheetProps {
    onChange?: (index: number) => void;
}

const PlanSheet = forwardRef<BottomSheetModal, SheetProps>(({onChange}, ref) => {
    const innerRef = useRef<BottomSheetModal>(null);
    useImperativeHandle(ref, () => innerRef.current as BottomSheetModal, []);
    const {dismiss} = useBottomSheetModal();
    const sheets = useSheets();

    const plan = useMapStore((s) => s.plan);
    const reorderPlan = useMapStore((s) => s.reorderPlan);
    const removeTourStop = useMapStore((s) => s.removeTourStop);
    const clearPlan = useMapStore((s) => s.clearPlan);
    const setMapMode = useMapStore((s) => s.setMapMode);

    const hasStops = !!plan && plan.stops.length > 0;

    const showOnMap = () => {
        dismiss();
        setTimeout(() => {
            setMapMode("plan");
            if (plan && plan.stops.length > 0) {
                const places = plan.stops.map(s => s.place);
                useMapStore.getState().fitPlaces(places);
            }
        }, 300);
    };

    const openStop = (place: Place) => {
        dismiss();
        setTimeout(() => {
            sheets.openPlace(place.id, place, "plan");
        }, 300);
    };

    const askAbout = (name: string) => {
        dismiss();
        sheets.ask(`Tell me a cool fact or what I should do at ${name}`);
    };

    const askToPlan = () => {
        dismiss();
        sheets.ask("Plan me a relaxed half-day in Zürich");
    };

    const renderItem = ({item, drag, isActive, getIndex}: RenderItemParams<TourStop>) => {
        const order = (getIndex() ?? 0) + 1;
        return (
            <ScaleDecorator>
                <Pressable
                    onPress={() => openStop(item.place)}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                        marginBottom: 12,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: isActive ? MAP_COLORS.route : MAP_COLORS.border,
                        backgroundColor: isActive ? "#F0FDFA" : "#fff",
                    }}
                >
                    <TouchableOpacity
                        onLongPress={drag}
                        delayLongPress={150} // Raised threshold to distinguish native scroll panning vs explicit list dragging
                        hitSlop={12}
                        style={{paddingVertical: 8, paddingHorizontal: 2}}
                    >
                        <GripVertical size={20} color="#A1A1AA"/>
                    </TouchableOpacity>

                    {item.place.thumbnail ? (
                        <Image source={{uri: item.place.thumbnail}}
                               style={{width: 60, height: 60, borderRadius: 16, backgroundColor: "#f4f4f5"}}
                               resizeMode="cover"/>
                    ) : (
                        <View style={{
                            width: 60,
                            height: 60,
                            borderRadius: 16,
                            backgroundColor: "#F0FDFA",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <MapPin size={22} color={MAP_COLORS.route}/>
                        </View>
                    )}

                    <View style={{flex: 1, justifyContent: "center"}}>
                        <View style={{flexDirection: "row", alignItems: "center", gap: 6}}>
                            <View style={{
                                backgroundColor: MAP_COLORS.route,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                borderRadius: 6
                            }}>
                                <Text style={{color: "#fff", fontSize: 10, fontWeight: "800"}}>{order}</Text>
                            </View>
                            <Text numberOfLines={2}
                                  style={{flex: 1, fontSize: 15.5, fontWeight: "700", color: MAP_COLORS.ink}}>
                                {item.place.name}
                            </Text>
                        </View>

                        {item.note && (
                            <Text numberOfLines={3}
                                  style={{fontSize: 13, color: MAP_COLORS.inkMuted, marginTop: 4, lineHeight: 18}}>
                                {item.note}
                            </Text>
                        )}

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 8
                        }}>
                            <TouchableOpacity onPress={() => askAbout(item.place.name)} hitSlop={8}
                                              style={{flexDirection: "row", alignItems: "center", gap: 4}}>
                                <Sparkles size={12} color={MAP_COLORS.route}/>
                                <Text style={{fontSize: 12, fontWeight: "600", color: MAP_COLORS.route}}>Ask
                                    Guide</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => removeTourStop(item.place.id)} hitSlop={12}>
                                <Trash2 size={16} color="#EF4444"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Pressable>
            </ScaleDecorator>
        );
    };

    const renderFooter = useCallback(
        (props: BottomSheetFooterProps) => {
            if (!hasStops) return null;
            return (
                <BottomSheetFooter {...props} bottomInset={0}>
                    <View style={{
                        flexDirection: "row",
                        gap: 12,
                        paddingHorizontal: 20,
                        paddingTop: 8,
                        paddingBottom: 20,
                        backgroundColor: "#fff"
                    }}>
                        <TouchableOpacity onPress={clearPlan} style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 16,
                            borderWidth: 2,
                            borderColor: "#F4F4F5"
                        }}>
                            <Text style={{fontSize: 15, fontWeight: "700", color: "#EF4444"}}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showOnMap} style={{
                            flex: 2,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            paddingVertical: 16,
                            borderRadius: 16,
                            backgroundColor: MAP_COLORS.route
                        }}>
                            <MapIcon size={18} color="#fff"/>
                            <Text style={{fontSize: 15, fontWeight: "700", color: "#fff"}}>Show on map</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetFooter>
            );
        },
        [hasStops, clearPlan]
    );

    return (
        <BottomSheetModal
            ref={innerRef}
            snapPoints={["60%", "92%"]}
            index={0}
            enableDynamicSizing={false}
            enableContentPanningGesture={false}
            backgroundStyle={{backgroundColor: "#ffffff"}}
            onChange={onChange}
            footerComponent={renderFooter}
        >
            {/* Header section remains stationary */}
            <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12}}>
                <View style={{flex: 1}}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: "800",
                        color: MAP_COLORS.ink
                    }}>{plan?.title ?? "Your plan"}</Text>
                    {hasStops && (
                        <Text style={{fontSize: 13, color: MAP_COLORS.inkMuted, marginTop: 2}}>
                            {plan!.stops.length} stop{plan!.stops.length === 1 ? "" : "s"} · drag to reorder
                        </Text>
                    )}
                </View>
                <TouchableOpacity onPress={() => dismiss()} hitSlop={10} style={{
                    height: 32,
                    width: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    backgroundColor: "#F4F4F5"
                }}>
                    <X size={18} color="#3f3f46"/>
                </TouchableOpacity>
            </View>

            {/* FIX: Contained completely inside BottomSheetView to properly handle centering layouts inside flexible modals */}
            {!hasStops ? (
                <BottomSheetView style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 32,
                    paddingBottom: 80
                }}>
                    <View style={{
                        height: 96,
                        width: 96,
                        borderRadius: 28,
                        backgroundColor: "#F0FDFA",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20
                    }}>
                        <Compass size={44} color={MAP_COLORS.route}/>
                    </View>
                    <Text style={{fontSize: 19, fontWeight: "800", color: MAP_COLORS.ink, marginBottom: 8}}>Build your
                        day</Text>
                    <Text style={{
                        fontSize: 14.5,
                        color: MAP_COLORS.inkMuted,
                        textAlign: "center",
                        lineHeight: 21,
                        maxWidth: 280
                    }}>
                        Ask the guide for a tour, or add places from search and recommendations. They’ll line up here,
                        ready to reorder.
                    </Text>
                    <TouchableOpacity onPress={askToPlan} style={{
                        marginTop: 24,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingHorizontal: 22,
                        paddingVertical: 14,
                        borderRadius: 16,
                        backgroundColor: MAP_COLORS.route
                    }}>
                        <Sparkles size={16} color="#fff"/>
                        <Text style={{fontSize: 15, fontWeight: "700", color: "#fff"}}>Ask the guide to plan</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            ) : (
                <DraggableFlatList
                    data={plan!.stops}
                    keyExtractor={(s) => s.place.id}
                    onDragEnd={({data}) => reorderPlan(data)}
                    renderItem={renderItem}
                    containerStyle={{flex: 1}}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 6,
                        paddingBottom: 110,
                    }}
                    activationDistance={15}
                    autoscrollThreshold={80}
                    renderScrollComponent={(props) => (
                        <BottomSheetFlatList {...(props as any)} />
                    )}
                />
            )}
        </BottomSheetModal>
    );
});

PlanSheet.displayName = "PlanSheet";
export default PlanSheet;