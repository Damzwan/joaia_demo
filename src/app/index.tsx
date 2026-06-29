import {Redirect} from "expo-router";
import {View, ActivityIndicator} from "react-native";
import {useAuthStore} from "@/store/useAuthStore";

export default function Index() {
    const {isInitialized, isAuthenticated, hasCompletedPreferences} = useAuthStore();

    if (!isInitialized) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff"}}>
                <ActivityIndicator size="large" color="#0F766E"/>
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/login"/>;
    }

    if (!hasCompletedPreferences) {
        return <Redirect href="/preferences"/>;
    }

    return <Redirect href="/main"/>;
}