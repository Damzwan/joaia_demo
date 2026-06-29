import React, {forwardRef} from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {BottomSheetModal, BottomSheetFlatList} from "@gorhom/bottom-sheet";
import {MapPin, Plus, Star, X} from "lucide-react-native";

import {useMapStore} from "@/store/useMapStore";
import {useChatStore} from "@/store/useChatStore";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {MAP_COLORS} from "@/constants/map.constants";
import {Place} from "@/types/map/map.types";

export interface SheetProps {
    onChange?: (index: number) => void;
}

const SearchResultsSheet = forwardRef<BottomSheetModal, SheetProps>(({onChange}, ref) => {
    const results = useMapStore((s) => s.searchResults);
    const query = useMapStore((s) => s.searchQuery);
    const clearSearch = useMapStore((s) => s.clearSearch);
    const setCameraTarget = useMapStore((s) => s.setCameraTarget);
    const setFocusedPlaceId = useMapStore((s) => s.setFocusedPlaceId);
    const addPlaceToTour = useMapStore((s) => s.addPlaceToTour);
    const sheets = useSheets();

    const focus = (place: Place) => {
        setCameraTarget({latitude: place.latitude, longitude: place.longitude});
        setFocusedPlaceId(place.id);
        sheets.openPlace(place.id);
    };

    const close = () => {
        clearSearch();
        sheets.closeSearchResults();
    };

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={["15%", "55%"]}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            backgroundStyle={{backgroundColor: "#ffffff"}}
            onChange={onChange}
        >
            <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12}}>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 17, fontWeight: "700", color: MAP_COLORS.ink}}>
                        {results.length} result{results.length === 1 ? "" : "s"}
                    </Text>
                    {query ? <Text style={{fontSize: 13, color: MAP_COLORS.inkMuted, marginTop: 1}}>for
                        “{query}”</Text> : null}
                </View>
                <TouchableOpacity onPress={close} hitSlop={10} style={{
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

            <BottomSheetFlatList
                data={results}
                keyExtractor={(p) => p.id}
                contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 40}}
                ItemSeparatorComponent={() => <View style={{height: 10}}/>}
                renderItem={({item}) => <ResultRow place={item} onPress={() => focus(item)}
                                                   onAdd={() => addPlaceToTour(item)}/>}
            />
        </BottomSheetModal>
    );
});

function ResultRow({place, onPress, onAdd}: { place: Place; onPress: () => void; onAdd: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                padding: 14,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: MAP_COLORS.border,
                backgroundColor: "#fff"
            }}
        >
            {place.thumbnail ? (
                <Image source={{uri: place.thumbnail}} style={{width: 56, height: 56, borderRadius: 14}}
                       resizeMode="cover"/>
            ) : (
                <View style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    backgroundColor: "#ECFDF5",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <MapPin size={22} color={MAP_COLORS.route}/>
                </View>
            )}

            <View style={{flex: 1}}>
                <Text numberOfLines={1} style={{fontSize: 15, fontWeight: "600", color: MAP_COLORS.ink}}>
                    {place.name}
                </Text>
                {place.address ? (
                    <Text numberOfLines={1} style={{fontSize: 12.5, color: MAP_COLORS.inkMuted, marginTop: 2}}>
                        {place.address}
                    </Text>
                ) : null}
                {typeof place.rating === "number" ? (
                    <View style={{flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5}}>
                        <Star size={12} color="#ca8a04" fill="#ca8a04"/>
                        <Text style={{fontSize: 12, color: MAP_COLORS.inkMuted}}>{place.rating.toFixed(1)}</Text>
                    </View>
                ) : null}
            </View>

            <TouchableOpacity onPress={onAdd} hitSlop={8} style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: MAP_COLORS.ink,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999
            }}>
                <Plus size={13} color="#fff"/>
                <Text style={{fontSize: 12, fontWeight: "600", color: "#fff"}}>Add</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

SearchResultsSheet.displayName = "SearchResultsSheet";
export default SearchResultsSheet;