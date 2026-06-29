import React, {forwardRef, useCallback, useEffect, useRef} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import BottomSheet, {
    BottomSheetFlatList,
    type BottomSheetFlatListMethods,
    BottomSheetFooter,
    type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import {ChevronDown, RefreshCw} from "lucide-react-native";

import {useChatStore} from "@/store/useChatStore";
import MessageRenderer from "@/components/main/chat/renderer/MessageRenderer";
import ChatInput from "@/components/main/chat/ChatInput";

const SNAP_POINTS = ["55%", "92%"];
const INPUT_SPACER = 84;

const ChatSheet = forwardRef<BottomSheet, { onChange?: (index: number) => void }>(
    ({onChange}, ref) => {
        const messages = useChatStore((s) => s.messages);
        const status = useChatStore((s) => s.status);
        const error = useChatStore((s) => s.error);
        const send = useChatStore((s) => s.send);
        const retryLast = useChatStore((s) => s.retryLast);

        const flatListRef = useRef<BottomSheetFlatListMethods>(null);
        const localRef = useRef<BottomSheet>(null);

        const setRefs = useCallback(
            (node: BottomSheet | null) => {
                localRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) (ref as React.MutableRefObject<BottomSheet | null>).current = node;
            },
            [ref]
        );

        const pinToBottom = useCallback(() => {
            requestAnimationFrame(() => {
                flatListRef.current?.scrollToEnd({animated: true});
            });
        }, []);

        const handleSend = useCallback(
            (...args: Parameters<typeof send>) => {
                send(...args);
            },
            [send, pinToBottom]
        );


        useEffect(() => {
            pinToBottom();
        }, [messages.length, status, pinToBottom]);

        const renderFooter = useCallback(
            (props: BottomSheetFooterProps) => (
                <BottomSheetFooter {...props} bottomInset={0}>
                    <ChatInput onSend={handleSend} thinking={status === "thinking"}/>
                </BottomSheetFooter>
            ),
            [handleSend, status]
        );

        const renderTypingAndSpacer = useCallback(
            () => (
                <View>
                    {status === "thinking" && (
                        <View className="mb-1 mt-2">
                            <Text className="text-sm text-zinc-400">The guide is typing…</Text>
                        </View>
                    )}

                    {status === "error" && (
                        <View className="mb-1 mt-2 items-start">
                            <Text className="mb-2 text-sm text-rose-600">
                                {error ?? "Couldn't reach the guide."}
                            </Text>
                            <TouchableOpacity
                                onPress={retryLast}
                                className="flex-row items-center gap-2 rounded-full bg-zinc-900 px-4 py-2"
                            >
                                <RefreshCw size={14} color="#fff"/>
                                <Text className="text-sm text-white">Retry</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={{height: INPUT_SPACER}}/>
                </View>
            ),
            [status, error, retryLast]
        );

        return (
            <BottomSheet
                ref={setRefs}
                index={0}
                snapPoints={SNAP_POINTS}
                enableDynamicSizing={false}
                enablePanDownToClose
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                footerComponent={renderFooter}
                onChange={onChange}
            >
                <View className="flex-row items-center justify-between px-4 pb-2">
                    <Text className="text-sm font-semibold text-zinc-900">Your guide</Text>

                    <TouchableOpacity
                        hitSlop={10}
                        onPress={() => localRef.current?.close()}
                        className="flex-row items-center gap-1 rounded-full bg-zinc-100 px-3 py-1.5"
                    >
                        <ChevronDown size={16} color="#3f3f46"/>
                        <Text className="text-xs font-medium text-zinc-700">Hide</Text>
                    </TouchableOpacity>
                </View>

                <BottomSheetFlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <MessageRenderer message={item}/>}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingHorizontal: 16}}
                    ListHeaderComponent={<View style={{height: 16}}/>}
                    ListFooterComponent={renderTypingAndSpacer}
                />
            </BottomSheet>
        );
    }
);

ChatSheet.displayName = "ChatSheet";

export default ChatSheet;