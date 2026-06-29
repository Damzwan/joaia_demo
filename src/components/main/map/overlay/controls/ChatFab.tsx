import React from "react";
import {Text, TouchableOpacity} from "react-native";
import {MessageCircle} from "lucide-react-native";

import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {MAP_COLORS} from "@/constants/map.constants";

export default function ChatFab() {
    const sheets = useSheets();

    return (
        <TouchableOpacity
            onPress={sheets.openChat}
            activeOpacity={0.9}
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: MAP_COLORS.route,
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderRadius: 999,
                shadowColor: MAP_COLORS.route,
                shadowOpacity: 0.45,
                shadowRadius: 16,
                shadowOffset: {width: 0, height: 6},
                elevation: 10,
            }}
        >
            <MessageCircle size={22} color={MAP_COLORS.onColor}/>
            <Text style={{color: MAP_COLORS.onColor, fontSize: 16, fontWeight: "700"}}>Ask the guide</Text>
        </TouchableOpacity>
    );
}