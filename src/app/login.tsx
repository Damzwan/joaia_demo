import React, {useRef, useState, useEffect} from "react";
import {
    Animated,
    Image,
    type ImageSourcePropType,
    Pressable,
    Text,
    useWindowDimensions,
    View,
    FlatList,
} from "react-native";

import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {ImageConstants} from "@/constants/image.constants";
import LOGO from "@/assets/logo.svg";


type Slide = {
    image: ImageSourcePropType;
    title: string;
    subtitle: string;
    coord: string;
};

const SLIDES: Slide[] = [
    {
        image: ImageConstants.login1,
        title: "Discover differently",
        subtitle: "Explore through local eyes, not a list of top tens.",
        coord: "41.90° N · 12.49° E",
    },
    {
        image: ImageConstants.login2,
        title: "Travel deeper",
        subtitle: "Save guides and plan trips together, all in one place.",
        coord: "47.37° N · 8.54° E",
    },
    {
        image: ImageConstants.login3,
        title: "Explore freely",
        subtitle: "Point, ask, and learn about any place instantly.",
        coord: "48.85° N · 2.35° E",
    },
];

export default function LoginScreen() {
    const router = useRouter();
    const {width} = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= SLIDES.length) {
                nextIndex = 0;
            }

            flatListRef.current?.scrollToIndex({
                index: nextIndex,
                animated: true,
            });
            setCurrentIndex(nextIndex);
        }, 4000);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const onViewableItemsChanged = useRef(({viewableItems}: any) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-row items-center justify-center pt-4 pb-2">
                <LOGO width={156} height={96} />
            </View>

            <View className="flex-1 justify-center">
                <Animated.FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.title}
                    decelerationRate="fast"
                    bounces={false}
                    scrollEventThrottle={16}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{itemVisiblePercentThreshold: 50}}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {x: scrollX}}}],
                        {useNativeDriver: false},
                    )}
                    renderItem={({item}) => (
                        <SlideCard item={item} width={width}/>
                    )}
                />
            </View>

            <Pagination count={SLIDES.length} scrollX={scrollX} width={width}/>

            <View className="px-6 pb-4">
                <PrimaryButton
                    label="Continue"
                    onPress={() => router.push("/preferences")}
                />

                <Pressable
                    accessibilityRole="button"
                    hitSlop={12}
                    onPress={() => router.push("/preferences")}
                    className="mt-4 items-center py-1"
                >
                    <Text className="font-sans text-sm text-primary">
                        I already have an account
                    </Text>
                </Pressable>

                <Text className="mt-3 text-center font-body text-xs text-text-soft">
                    By continuing you agree to our Terms & Privacy
                </Text>
            </View>
        </SafeAreaView>
    );
}

/* ------------------------------------------------------------------ */

function SlideCard({item, width}: { item: Slide; width: number }) {
    const [loaded, setLoaded] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;

    const handleLoad = () => {
        setLoaded(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 320,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={{width}} className="items-center px-7">
            {/* Place card */}
            <View
                style={{aspectRatio: 1}}
                className="w-full max-w-[360px] overflow-hidden rounded-[32px] border border-border bg-muted"
            >
                {!loaded && <View className="absolute inset-0 bg-muted"/>}

                <Animated.View style={{opacity}} className="h-full w-full">
                    <Image
                        source={item.image}
                        resizeMode="cover"
                        onLoad={handleLoad}
                        accessibilityIgnoresInvertColors
                        className="h-full w-full"
                    />
                </Animated.View>

                <View className="absolute bottom-3 left-3 rounded-lg border border-border bg-surface/90 px-2.5 py-1.5">
                    <Text className="font-mono text-[11px] text-text">{item.coord}</Text>
                </View>
            </View>

            {/* Copy */}
            <View className="mt-8 w-full max-w-[360px]">
                <Text className="font-display text-3xl leading-tight text-text">
                    {item.title}
                </Text>
                <Text className="mt-2 font-body text-base leading-6 text-text-soft">
                    {item.subtitle}
                </Text>
            </View>
        </View>
    );
}

function Pagination({
                        count,
                        scrollX,
                        width,
                    }: {
    count: number;
    scrollX: Animated.Value;
    width: number;
}) {
    return (
        <View
            className="my-6 flex-row justify-center gap-1.5"
            accessibilityRole="tablist"
        >
            {Array.from({length: count}).map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 26, 8],
                    extrapolate: "clamp",
                });
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.35, 1, 0.35],
                    extrapolate: "clamp",
                });
                return (
                    <Animated.View
                        key={i}
                        style={{width: dotWidth, opacity}}
                        className="h-2 rounded-full bg-primary"
                    />
                );
            })}
        </View>
    );
}

    function PrimaryButton({
                           label,
                           onPress,
                       }: {
    label: string;
    onPress: () => void;
}) {
    const scale = useRef(new Animated.Value(1)).current;

    const press = (toValue: number) =>
        Animated.spring(scale, {
            toValue,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={onPress}
            onPressIn={() => press(0.97)}
            onPressOut={() => press(1)}
        >
            <Animated.View
                style={{transform: [{scale}]}}
                className="h-16 items-center justify-center rounded-full bg-primary"
            >
                <Text className="font-sans text-lg text-primary-foreground">
                    {label}
                </Text>
            </Animated.View>
        </Pressable>
    );
}