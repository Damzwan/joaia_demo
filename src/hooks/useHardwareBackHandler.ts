import {useEffect, RefObject} from "react";
import {BackHandler} from "react-native";
import BottomSheet, {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useMapStore} from "@/store/useMapStore";
import {useChatStore} from "@/store/useChatStore";

interface BackHandlerRefs {
    chatSheetRef: RefObject<BottomSheet | null>;
    planModalRef: RefObject<BottomSheetModal | null>;
    placeModalRef: RefObject<BottomSheetModal | null>;
    figureModalRef: RefObject<BottomSheetModal | null>;
    searchResultsModalRef: RefObject<BottomSheetModal | null>;
    sheetStates: RefObject<{ plan: boolean; place: boolean; figure: boolean; chat: boolean; search: boolean }>;
}

export function useHardwareBackHandler({
                                           chatSheetRef,
                                           planModalRef,
                                           placeModalRef,
                                           figureModalRef,
                                           searchResultsModalRef,
                                           sheetStates,
                                       }: BackHandlerRefs) {
    const clearSearch = useMapStore((s) => s.clearSearch);

    useEffect(() => {
        const handleHardwareBack = () => {
            const map = useMapStore.getState();

            // Previewing proposals → discard first.
            if (map.previewTour) {
                map.clearPreview();
                return true;
            }

            const currentResults = map.searchResults;

            if (sheetStates.current.place) {
                placeModalRef.current?.dismiss();
                const origin = map.placeOrigin;
                if (origin === "search" && currentResults.length > 0) searchResultsModalRef.current?.present();
                else if (origin === "plan" && useMapStore.getState().plan) planModalRef.current?.present();
                return true;
            }
            if (sheetStates.current.figure) {
                figureModalRef.current?.dismiss();
                return true;
            }
            if (sheetStates.current.search) {
                searchResultsModalRef.current?.dismiss();
                clearSearch();
                return true;
            }
            if (sheetStates.current.plan) {
                planModalRef.current?.dismiss();
                return true;
            }
            if (sheetStates.current.chat) {
                chatSheetRef.current?.close();
                return true;
            }

            if (currentResults.length > 0) {
                clearSearch();
                return true;
            }
            return false;
        };

        const subscription = BackHandler.addEventListener("hardwareBackPress", handleHardwareBack);
        return () => subscription.remove();
    }, [chatSheetRef, planModalRef, placeModalRef, figureModalRef, searchResultsModalRef, sheetStates, clearSearch]);
}