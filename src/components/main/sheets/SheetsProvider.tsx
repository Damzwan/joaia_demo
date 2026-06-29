import React, {createContext, useContext, useRef, useState, useMemo, useCallback} from "react";
import {Dimensions} from "react-native";
import BottomSheet, {BottomSheetModal} from "@gorhom/bottom-sheet";
import {useChatStore} from "@/store/useChatStore";
import {PlaceOrigin, useMapStore} from "@/store/useMapStore";
import {useHardwareBackHandler} from "@/hooks/useHardwareBackHandler";

import PlanSheet from "@/components/main/sheets/PlanSheet";
import PlaceDetailSheet from "@/components/main/sheets/PlaceDetailSheet";
import SearchResultsSheet from "@/components/main/sheets/SearchResultsSheet";
import ChatSheet from "@/components/main/chat/ChatSheet";
import PreviewTourBar from "@/components/main/map/overlay/PreviewTourBar";
import {Place} from "@/types/map/map.types";
import {Tour} from "@/types/chat/entities.types";
import FigureSheet from "@/components/main/sheets/FigureSheet";

export interface SheetsApi {
    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    openPlan: () => void;
    openPlace: (placeId: string, place?: Place, origin?: PlaceOrigin) => void;
    openFigure: (figureId: string) => void;
    openSearchResults: () => void;
    closeSearchResults: () => void;
    ask: (prompt: string) => void;
    showOnMap: (placeId: string) => void;
    previewTourOnMap: (tour: Tour, group?: Tour[]) => void;
}

const SheetsContext = createContext<SheetsApi | null>(null);

export function useSheets() {
    const context = useContext(SheetsContext);
    if (!context) throw new Error("useSheets must be used within a <SheetsProvider />");
    return context;
}

const SHEET_COVERAGE = {plan: 0.55, place: 0.45, figure: 0.45, search: 0.45} as const;
const SCREEN_H = Dimensions.get("window").height;

export function SheetsProvider({children}: { children: React.ReactNode }) {
    const chatSheetRef = useRef<BottomSheet>(null);
    const planModalRef = useRef<BottomSheetModal>(null);
    const placeModalRef = useRef<BottomSheetModal>(null);
    const figureModalRef = useRef<BottomSheetModal>(null);
    const searchResultsModalRef = useRef<BottomSheetModal>(null);

    const [isChatOpen, setIsChatOpen] = useState(true);
    const sheetStates = useRef({plan: false, place: false, figure: false, search: false, chat: true});

    useHardwareBackHandler({
        chatSheetRef,
        planModalRef,
        placeModalRef,
        figureModalRef,
        searchResultsModalRef,
        sheetStates
    });


    const api = useMemo<SheetsApi>(
        () => ({
            isChatOpen,
            openChat: () => chatSheetRef.current?.snapToIndex(0),
            closeChat: () => chatSheetRef.current?.close(),
            openPlan: () => planModalRef.current?.present(),
            openPlace: (placeId, place, origin) => {
                const map = useMapStore.getState();
                const resolved: PlaceOrigin = origin ?? (map.searchResults.length > 0 ? "search" : "map");
                map.setPlaceOrigin(resolved);
                map.setSelectedPlaceId(placeId);
                if (place) map.focusPlace(place);
                else map.setFocusedPlaceId(placeId);
                placeModalRef.current?.present();
            },
            openFigure: (figureId) => {
                useMapStore.getState().setSelectedFigureId(figureId);
                figureModalRef.current?.present();
            },
            openSearchResults: () => searchResultsModalRef.current?.present(),
            closeSearchResults: () => searchResultsModalRef.current?.dismiss(),
            ask: (prompt) => {
                chatSheetRef.current?.snapToIndex(0);
                useChatStore.getState().send(prompt);
            },
            showOnMap: (placeId) => {
                useChatStore.getState().focusPlace(placeId);
                chatSheetRef.current?.close();
            },
            previewTourOnMap: (tour, group) => {
                useMapStore.getState().showPreview(tour, group);
                chatSheetRef.current?.close();
            },
        }),
        [isChatOpen]
    );

    return (
        <SheetsContext.Provider value={api}>
            {children}
            <PreviewTourBar/>
            <ChatSheet
                ref={chatSheetRef}
                onChange={(idx: number) => {
                    setIsChatOpen(idx >= 0);
                    sheetStates.current.chat = idx >= 0;
                }}
            />
            <PlanSheet ref={planModalRef}/>
            <PlaceDetailSheet ref={placeModalRef}/>
            <FigureSheet ref={figureModalRef}/>
            <SearchResultsSheet ref={searchResultsModalRef}/>
        </SheetsContext.Provider>
    );
}