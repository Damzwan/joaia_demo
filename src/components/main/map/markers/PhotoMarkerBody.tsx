import React from "react";
import {View, Text, Image} from "react-native";
import {Marker} from "react-native-maps";
import {Place} from "@/types/map/map.types";

interface PhotoMarkerProps {
    coordinate: { latitude: number; longitude: number };
    place: Place;
    color: string;
    photoSize: number;
    baseZ: number;
    tracks: boolean;
    order?: number;
    focused: boolean;
    handlePress: (e: any) => void;
    onImageLoad: () => void;
}

export function PhotoMarkerBody({
                                    coordinate,
                                    place,
                                    color,
                                    photoSize,
                                    baseZ,
                                    tracks,
                                    order,
                                    focused,
                                    handlePress,
                                    onImageLoad
                                }: PhotoMarkerProps) {
    const padding = 32;
    const wrapperSize = photoSize + padding;

    return (
        <>
            <Marker
                coordinate={coordinate}
                anchor={{x: 0.5, y: 0.5}}
                zIndex={baseZ + 1}
                tracksViewChanges={tracks}
                onPress={handlePress}
            >
                <View
                    collapsable={false}
                    style={{
                        width: wrapperSize,
                        height: wrapperSize,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "transparent"
                    }}
                >
                    {focused && (
                        <View
                            style={{
                                position: "absolute",
                                width: photoSize + 20,
                                height: photoSize + 20,
                                borderRadius: (photoSize + 20) / 2,
                                backgroundColor: color,
                                opacity: 0.22,
                            }}
                        />
                    )}

                    <View
                        style={{
                            width: photoSize,
                            height: photoSize,
                            borderRadius: photoSize / 2,
                            borderWidth: focused ? 4 : 2,
                            borderColor: focused ? "#fff" : color,
                            backgroundColor: "transparent"
                        }}
                    />

                    {focused && (
                        <View
                            pointerEvents="none"
                            style={{
                                position: "absolute",
                                width: photoSize,
                                height: photoSize,
                                borderRadius: photoSize / 2,
                                borderWidth: 3,
                                borderColor: color,
                            }}
                        />
                    )}

                    {typeof order === "number" && (
                        <View
                            style={{
                                position: "absolute",
                                top: focused ? 10 : 8,
                                right: focused ? 10 : 8,
                                minWidth: 22,
                                height: 22,
                                paddingHorizontal: 4,
                                borderRadius: 11,
                                backgroundColor: color,
                                borderWidth: 2,
                                borderColor: "#fff",
                                alignItems: "center",
                                justifyContent: "center",
                                elevation: 5,
                            }}
                        >
                            <Text style={{color: "#fff", fontSize: 10, fontWeight: "800"}}>{order}</Text>
                        </View>
                    )}
                </View>
            </Marker>

            <Marker
                coordinate={coordinate}
                anchor={{x: 0.5, y: 0.5}}
                zIndex={baseZ}
                tracksViewChanges={tracks}
                onPress={handlePress}
            >
                <Image
                    source={{uri: place.thumbnail}}
                    style={{
                        width: photoSize,
                        height: photoSize,
                        borderRadius: photoSize / 2,
                    }}
                    resizeMode="cover"
                    fadeDuration={0}
                    onLoad={onImageLoad}
                />
            </Marker>
        </>
    );
}