import React, {forwardRef, useImperativeHandle, useMemo, useRef} from "react";
import {View, Text, TouchableOpacity, Image} from "react-native";
import {BottomSheetModal, BottomSheetScrollView, useBottomSheetModal} from "@gorhom/bottom-sheet";
import {X, Compass, MessageCircle} from "lucide-react-native";

import {useMapStore} from "@/store/useMapStore";
import {FIGURES} from "@/constants/figures.constants";
import {useSheets} from "@/components/main/sheets/SheetsProvider";

export interface SheetProps {
    onChange?: (index: number) => void;
}

const FigureSheet = forwardRef<BottomSheetModal, SheetProps>(({onChange}, ref) => {
    const innerRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => innerRef.current as BottomSheetModal, []);

    const {dismiss} = useBottomSheetModal();
    const sheets = useSheets();

    const selectedFigureId = useMapStore((s) => s.selectedFigureId);

    const figure = useMemo(() =>
            FIGURES.find((f) => f.id === selectedFigureId),
        [selectedFigureId]
    );

    const imageSource = useMemo(() => {
        if (!figure?.imageUrl) return null;
        return typeof figure.imageUrl === "number" ? figure.imageUrl : {uri: figure.imageUrl};
    }, [figure?.imageUrl]);

    return (
        <BottomSheetModal
            ref={innerRef}
            snapPoints={["75%"]}
            enableDynamicSizing={false}
            backgroundStyle={{backgroundColor: "#ffffff"}}
            onChange={onChange}
        >
            <BottomSheetScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 32,
                    paddingBottom: 24, // Trimmed down the unnecessary whitespace
                    alignItems: "center"
                }}
            >
                {figure && (
                    <>
                        {imageSource ? (
                            <Image
                                source={imageSource}
                                className="w-32 h-32 rounded-full bg-zinc-100 mb-4"
                                resizeMode="cover"
                                style={{width: 128, height: 128, borderRadius: 64}}
                            />
                        ) : (
                            <View
                                style={{
                                    backgroundColor: figure.accentColor ?? "#0F766E",
                                    width: 128,
                                    height: 128,
                                    borderRadius: 64
                                }}
                                className="items-center justify-center mb-4"
                            >
                                <Text className="text-4xl font-bold text-white">
                                    {figure.name.charAt(0)}
                                </Text>
                            </View>
                        )}

                        <Text className="text-2xl font-bold text-zinc-900 text-center mb-1">
                            {figure.name}
                        </Text>

                        <Text
                            className="text-[13px] font-bold uppercase tracking-widest text-zinc-400 text-center mb-3">
                            {figure.field}{figure.years ? ` • ${figure.years}` : ""}
                        </Text>

                        {figure.blurb ? (
                            <View className="bg-teal-50 px-4 py-1.5 rounded-full mb-6">
                                <Text className="text-[13px] font-semibold text-teal-700">
                                    {figure.blurb}
                                </Text>
                            </View>
                        ) : (
                            <View className="h-4"/>
                        )}

                        <View className="w-full bg-zinc-50 rounded-3xl p-6 border border-zinc-100 mb-8">
                            <Text className="text-[16px] leading-relaxed text-zinc-600 text-center">
                                {figure.bio}
                            </Text>
                        </View>

                        {/* Grouped the buttons in a unified container with consistent gap spacing */}
                        <View className="w-full gap-3">
                            {figure.relatedPlace && (
                                <TouchableOpacity
                                    onPress={() => {
                                        dismiss();
                                        sheets.ask(`Build a historical tour tracing the footsteps of ${figure.name}`);
                                    }}
                                    className="w-full flex-row items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 shadow-sm active:opacity-90"
                                >
                                    <Compass size={18} color="#fff"/>
                                    <Text className="text-[15px] font-semibold text-white">
                                        Generate Footsteps Tour
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                onPress={() => {
                                    dismiss();
                                    sheets.ask(`Tell me more about ${figure.name} and their significance.`);
                                }}
                                className="w-full flex-row items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white py-4 active:bg-zinc-50"
                            >
                                <MessageCircle size={18} color="#3f3f46"/>
                                <Text className="text-[15px] font-semibold text-zinc-700">Ask the Guide</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </BottomSheetScrollView>

            <TouchableOpacity
                onPress={() => dismiss()}
                hitSlop={10}
                style={{position: "absolute", top: 14, right: 14, zIndex: 10}}
                className="h-9 w-9 items-center justify-center rounded-full bg-zinc-100 active:bg-zinc-200"
            >
                <X size={20} color="#3f3f46"/>
            </TouchableOpacity>
        </BottomSheetModal>
    );
});

FigureSheet.displayName = "FigureSheet";
export default FigureSheet;