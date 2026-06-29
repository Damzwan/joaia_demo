// @/components/map/MapSearchBar.tsx
import React, {useEffect, useState} from "react";
import {View, TextInput, TouchableOpacity, ActivityIndicator, Text, Keyboard} from "react-native";
import {Search, X, List, MapPin} from "lucide-react-native";

import {placesApi} from "@/api/places.api";
import {useDebouncedValue} from "@/hooks/useDebouncedValue";
import {useMapStore} from "@/store/useMapStore";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {MAP_COLORS} from "@/constants/map.constants";
import GlassPanel from "@/components/main/map/overlay/GlassPanel";
import {Place} from "@/types/map/map.types";

export default function MapSearchBar() {
    const [loading, setLoading] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);

    const searchQuery = useMapStore((s) => s.searchQuery);
    const currentRegion = useMapStore((s) => s.currentRegion);
    const setSearchQuery = useMapStore((s) => s.setSearchQuery);

    const debounced = useDebouncedValue(searchQuery.trim(), 350);

    const results = useMapStore((s) => s.searchResults) as (Place & { isExactMatch?: boolean })[];
    const setSearchResults = useMapStore((s) => s.setSearchResults);
    const clearSearch = useMapStore((s) => s.clearSearch);
    const setCameraTarget = useMapStore((s) => s.setCameraTarget);
    const setFocusedPlaceId = useMapStore((s) => s.setFocusedPlaceId);
    const sheets = useSheets();

    useEffect(() => {
        let alive = true;
        if (debounced.length < 2) {
            setLoading(false);
            setSearchResults([]);
            setShowSuggestion(false);
            sheets.closeSearchResults();
            return;
        }
        setLoading(true);
        placesApi
            .search({
                text: debounced,
                limit: 8,
                latitude: currentRegion?.latitude,
                longitude: currentRegion?.longitude
            })
            .then((r) => {
                if (!alive) return;
                const valid = r.filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number");
                setSearchResults(valid);
                if (valid.length) {
                    setCameraTarget(centroid(valid));
                    setShowSuggestion(true);
                    sheets.closeSearchResults();
                } else {
                    setShowSuggestion(false);
                    sheets.closeSearchResults();
                }
            })
            .catch(() => alive && setSearchResults([]))
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    const clear = () => {
        clearSearch()
        setShowSuggestion(false);
        sheets.closeSearchResults();
    };

    const handleSeeAll = () => {
        Keyboard.dismiss();
        setShowSuggestion(false);
        sheets.openSearchResults();
    };

    const handleSelectTopMatch = () => {
        Keyboard.dismiss();
        setShowSuggestion(false);
        const top = results[0];
        setCameraTarget({latitude: top.latitude, longitude: top.longitude});
        setFocusedPlaceId(top.id);
        sheets.openPlace(top.id);
    };

    const isTopMatchExact = results[0]?.isExactMatch === true;

    return (
        <View style={{gap: 8}}>
            <GlassPanel radius={16}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 12
                }}>
                    <Search size={18} color={MAP_COLORS.inkMuted}/>
                    <TextInput
                        value={searchQuery} // Bound directly to global store
                        onChangeText={setSearchQuery} // Updates global store reactively
                        onFocus={() => {
                            if (results.length > 0) setShowSuggestion(true);
                        }}
                        placeholder="Search places in Zürich"
                        placeholderTextColor={MAP_COLORS.inkMuted}
                        returnKeyType="search"
                        onSubmitEditing={isTopMatchExact ? handleSelectTopMatch : handleSeeAll}
                        style={{flex: 1, fontSize: 15, color: MAP_COLORS.ink, padding: 0}}
                    />
                    {loading ? (
                        <ActivityIndicator size="small" color={MAP_COLORS.inkMuted}/>
                    ) : searchQuery.length > 0 ? (
                        <TouchableOpacity onPress={clear} hitSlop={10}>
                            <X size={18} color={MAP_COLORS.inkMuted}/>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </GlassPanel>

            {/* Smart Suggestions Dropdown Container */}
            {showSuggestion && results.length > 0 && !loading && (
                <GlassPanel radius={16}>
                    <View style={{paddingVertical: 6}}>
                        <TouchableOpacity
                            onPress={handleSelectTopMatch}
                            activeOpacity={0.7}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 10
                            }}
                        >
                            <View style={{backgroundColor: "#F4F4F5", padding: 8, borderRadius: 10}}>
                                <MapPin size={18} color={MAP_COLORS.ink}/>
                            </View>
                            <View style={{flex: 1}}>
                                <Text numberOfLines={1}
                                      style={{fontSize: 15, fontWeight: "600", color: MAP_COLORS.ink}}>
                                    {results[0].name}
                                </Text>
                                {results[0].address && (
                                    <Text numberOfLines={1}
                                          style={{fontSize: 13, color: MAP_COLORS.inkMuted, marginTop: 2}}>
                                        {results[0].address}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>

                        {results.length > 1 && !isTopMatchExact && (
                            <>
                                <View style={{
                                    height: 1,
                                    backgroundColor: "#E4E4E7",
                                    marginHorizontal: 16,
                                    marginVertical: 4
                                }}/>
                                <TouchableOpacity
                                    onPress={handleSeeAll}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 12,
                                        paddingHorizontal: 16,
                                        paddingVertical: 10
                                    }}
                                >
                                    <View style={{backgroundColor: "#F4F4F5", padding: 8, borderRadius: 10}}>
                                        <List size={18} color={MAP_COLORS.ink}/>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={{fontSize: 15, fontWeight: "600", color: MAP_COLORS.ink}}>
                                            See all {results.length} locations
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </GlassPanel>
            )}
        </View>
    );
}

function centroid(places: { latitude: number; longitude: number }[]) {
    return {
        latitude: places.reduce((s, p) => s + p.latitude, 0) / places.length,
        longitude: places.reduce((s, p) => s + p.longitude, 0) / places.length,
    };
}