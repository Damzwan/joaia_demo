import React, {useEffect, useRef} from "react";
import {View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import MapView, {PROVIDER_DEFAULT} from "react-native-maps";

import {useMapStore} from "@/store/useMapStore";
import {useChatStore} from "@/store/useChatStore";
import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {useMapMarkers} from "@/hooks/useMapMarkers";
import RouteLine from "@/components/main/map/RouteLine";
import MapMarkers from "@/components/main/map/markers/MapMarkers";
import MapSearchBar from "@/components/main/map/overlay/MapSearchBar";
import QuickActionsBar from "@/components/main/map/overlay/controls/QuickActionsBar";
import {MAP_COLORS} from "@/constants/map.constants";
import {useMapController} from "@/hooks/useMapController";
import {ZURICH} from "@/constants/explore.constants";

export default function MapLayer() {
    const cameraTarget = useMapStore((s) => s.cameraTarget);
    const fitCoordinates = useMapStore((s) => s.fitCoordinates);
    const bottomInset = useMapStore((s) => s.bottomInset);
    const routePath = useMapStore((s) => s.routePath);
    const previewRoutePath = useMapStore((s) => s.previewRoutePath);
    const focusedPlaceId = useMapStore((s) => s.focusedPlaceId);
    const previewActive = useMapStore((s) => s.previewTours.length > 0);
    const fetchExplore = useMapStore((s) => s.fetchExplore);
    const setCurrentRegion = useMapStore((s) => s.setCurrentRegion);

    const sheets = useSheets();
    const tiers = useMapMarkers();
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        fetchExplore().then(() => {
            useChatStore
                .getState()
                .hydrateSeedPlaces(useMapStore.getState().explore);
        });
    }, [fetchExplore]);

    useMapController(mapRef, cameraTarget, fitCoordinates);

    return (
        <View className="flex-1">
            <MapView
                ref={mapRef}
                style={{flex: 1}}
                initialRegion={ZURICH}
                provider={PROVIDER_DEFAULT}
                mapPadding={{top: 0, right: 0, bottom: bottomInset, left: 0}}
                showsUserLocation
                showsMyLocationButton={false}
                onPress={() => sheets.closeChat()}
                onRegionChangeComplete={(region) => {
                    setCurrentRegion({
                        latitude: region.latitude,
                        longitude: region.longitude
                    });
                }}
            >
                <RouteLine path={routePath}/>
                <RouteLine
                    path={previewRoutePath}
                    color={MAP_COLORS.preview}
                    casing={MAP_COLORS.previewCasing}
                    dashed
                />

                <MapMarkers
                    tiers={tiers}
                    focusedPlaceId={focusedPlaceId}
                    onPressPlace={(place) =>
                        sheets.openPlace(place.id, place)
                    }
                />
            </MapView>

            <SafeAreaView
                edges={["top"]}
                pointerEvents="box-none"
                className="absolute top-0 left-0 right-0"
            >
                <View className="px-4 pt-2">
                    <MapSearchBar/>
                </View>
            </SafeAreaView>

            {!previewActive && (
                <SafeAreaView
                    edges={["bottom"]}
                    pointerEvents="box-none"
                    className="absolute bottom-3 left-0 right-0 items-center"
                >
                    <QuickActionsBar/>
                </SafeAreaView>
            )}
        </View>
    );
}