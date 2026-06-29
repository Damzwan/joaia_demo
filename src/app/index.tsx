import {Redirect} from "expo-router";
import {useAuthStore} from "@/store/useAuthStore";

export default function Index() {
    const {isAuthenticated, hasCompletedPreferences} = useAuthStore();

    if (!isAuthenticated) return <Redirect href="/login"/>;
    if (!hasCompletedPreferences) return <Redirect href="/preferences"/>;

    return <Redirect href="/main"/>;
}