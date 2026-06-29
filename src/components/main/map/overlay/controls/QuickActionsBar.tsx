import React from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import {Compass, LocateFixed, Map as MapIcon, MessageCircle} from "lucide-react-native";

import {useSheets} from "@/components/main/sheets/SheetsProvider";
import {useMapStore} from "@/store/useMapStore";
import {useUserLocation} from "@/hooks/useUserLocation";
import {MAP_COLORS} from "@/constants/map.constants";
import GlassPanel from "@/components/main/map/overlay/GlassPanel";

export default function QuickActionsBar() {
    const sheets = useSheets();
    const plan = useMapStore((s) => s.plan);
    const mapMode = useMapStore((s) => s.mapMode);
    const setMapMode = useMapStore((s) => s.setMapMode);
    const setCameraTarget = useMapStore((s) => s.setCameraTarget);
    const {locate, status} = useUserLocation();

    const around = mapMode === "explore";

    const toggleAround = () => {
        setMapMode(around ? "plan" : "explore");
    };

    const onLocate = async () => {
        const coords = await locate();
        if (coords) setCameraTarget(coords);
    };

    return (
        <GlassPanel radius={26}>
            <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingVertical: 6}}>
                <Action icon={<MessageCircle size={20} color="#fff"/>} label="Chat" primary onPress={sheets.openChat}/>
                <Action icon={<MapIcon size={20} color={MAP_COLORS.route}/>} label="Plan" badge={plan?.stops.length}
                        onPress={sheets.openPlan}/>
                <Action icon={<Compass size={20} color={around ? "#fff" : MAP_COLORS.route}/>} label="Explore"
                        active={around} onPress={toggleAround}/>
                <Action
                    icon={status === "locating" ? <ActivityIndicator size="small" color={MAP_COLORS.route}/> :
                        <LocateFixed size={20} color={MAP_COLORS.route}/>}
                    label="Locate"
                    onPress={onLocate}
                />
            </View>
        </GlassPanel>
    );
}

function Action({
                    icon,
                    label,
                    onPress,
                    primary,
                    active,
                    badge,
                }: {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    primary?: boolean;
    active?: boolean;
    badge?: number;
}) {
    const filled = primary || active;
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}
                          style={{width: 66, alignItems: "center", paddingVertical: 4}}>
            <View
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: filled ? MAP_COLORS.route : "rgba(15,118,110,0.10)",
                }}
            >
                {icon}
                {badge ? (
                    <View
                        style={{
                            position: "absolute",
                            top: -2,
                            right: -2,
                            minWidth: 18,
                            height: 18,
                            paddingHorizontal: 4,
                            borderRadius: 9,
                            backgroundColor: "#EF4444",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 2,
                            borderColor: "#fff",
                        }}
                    >
                        <Text style={{color: "#fff", fontSize: 10, fontWeight: "700"}}>{badge}</Text>
                    </View>
                ) : null}
            </View>
            <Text style={{fontSize: 11, fontWeight: "600", color: MAP_COLORS.ink, marginTop: 4}}>{label}</Text>
        </TouchableOpacity>
    );
}