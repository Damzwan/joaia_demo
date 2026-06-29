import {useEffect, RefObject} from 'react';
import MapView from 'react-native-maps';
import {LatLng} from "@/api/routes.api";

const EDGE = {top: 140, right: 60, bottom: 80, left: 60};
const ANIMATION_DURATION = 450;
const REGION_DELTA = {latitudeDelta: 0.02, longitudeDelta: 0.02};
const FIT_COORDINATES_DELAY = 160

export const useMapController = (
    mapRef: RefObject<MapView | null>,
    cameraTarget: LatLng | null,
    fitCoordinates: LatLng[] | null
) => {

    useEffect(() => {
        if (cameraTarget) {
            mapRef?.current?.animateToRegion(
                {...cameraTarget, ...REGION_DELTA},
                ANIMATION_DURATION,
            );
        }
    }, [cameraTarget, mapRef]);

    useEffect(() => {
        if (!fitCoordinates?.length) return;

        const id = setTimeout(() => {
            if (fitCoordinates.length === 1) {
                mapRef?.current?.animateToRegion(
                    {...fitCoordinates[0], ...REGION_DELTA},
                );
            } else {
                mapRef?.current?.fitToCoordinates(fitCoordinates, {
                    edgePadding: EDGE,
                    animated: true
                });
            }
        }, FIT_COORDINATES_DELAY);

        return () => clearTimeout(id);
    }, [fitCoordinates]);
};