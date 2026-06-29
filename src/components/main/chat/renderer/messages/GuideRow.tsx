import React from "react";
import {Image, Text, View} from "react-native";
import {TINT} from "@/constants/theme.constants";


export default function GuideRow({persona, mine, children}: {
    persona?: { name: string; accentColor?: string };
    mine: boolean;
    children: React.ReactNode
}) {
    if (mine) return <View className="mb-3 items-end">{children}</View>;
    return (
        <View className="mb-3 flex-row gap-2">
            {persona ? <Avatar name={persona.name} color={persona.accentColor} size={30}/> :
                <View style={{width: 30}}/>}
            <View className="flex-1">
                {persona ?
                    <Text className="mb-0.5 ml-1 text-[11px] font-medium text-zinc-400">{persona.name}</Text> : null}
                {children}
            </View>
        </View>
    );
}

function Avatar({name, color, uri, size = 32}: { name: string; color?: string; uri?: any; size?: number }) {
    if (uri) {
        const dynamicSource = typeof uri === "number" ? uri : {uri};
        return <Image source={dynamicSource} style={{width: size, height: size, borderRadius: size / 2}}/>;
    }
    return (
        <View style={{width: size, height: size, borderRadius: size / 2, backgroundColor: color ?? TINT}}
              className="items-center justify-center">
            <Text style={{fontSize: size * 0.42}}
                  className="font-semibold text-white">{name.charAt(0).toUpperCase()}</Text>
        </View>
    );
}