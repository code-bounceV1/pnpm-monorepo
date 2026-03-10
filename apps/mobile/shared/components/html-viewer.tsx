/**
 * HtmlViewer
 * Fetches HTML from a remote URL and renders it natively using react-native-render-html.
 * Avoids WebView for simple HTML content; falls back gracefully on error.
 */
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";

interface HtmlViewerProps {
    url: string;
}

const HtmlViewer = ({ url }: HtmlViewerProps) => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(false);
        setHtml(null);

        fetch(url)
            .then((r) => r.text())
            .then((text) => {
                if (mounted) { setHtml(text); setLoading(false); }
            })
            .catch(() => {
                if (mounted) { setError(true); setLoading(false); }
            });

        return () => { mounted = false; };
    }, [url]);

    if (loading) {
        return (
            <View className="flex-1 bg-[#0D0D0D] items-center justify-center gap-3">
                <ActivityIndicator size="large" color="#3498DB" />
                <Text className="text-[#aaa] text-sm">Loading HTML…</Text>
            </View>
        );
    }

    if (error || !html) {
        return (
            <View className="flex-1 bg-[#0D0D0D] items-center justify-center gap-4 px-8">
                <View className="w-28 h-28 rounded-full bg-[#3498DB]/10 border border-[#3498DB]/30 items-center justify-center">
                    <Ionicons name="code-slash-outline" size={52} color="#3498DB" />
                </View>
                <Text className="text-[#E0E0E0] text-base font-bold text-center">
                    Unable to render HTML
                </Text>
                <TouchableOpacity
                    className="flex-row items-center bg-[#3498DB] rounded-full px-6 py-3 gap-2 mt-2"
                    onPress={() => WebBrowser.openBrowserAsync(url)}
                >
                    <Ionicons name="open-outline" size={16} color="#fff" />
                    <Text className="text-white font-bold text-sm">Open in Browser</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ padding: 16 }}
        >
            <RenderHtml
                contentWidth={width - 32}
                source={{ html }}
                tagsStyles={{
                    body: { color: "#1A1A1A", fontSize: 15, lineHeight: 22 },
                    a: { color: "#3498DB" },
                    h1: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
                    h2: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
                    p: { marginBottom: 8 },
                    code: { fontFamily: "monospace", backgroundColor: "#F3F4F6", padding: 2 },
                }}
            />
        </ScrollView>
    );
};

export default HtmlViewer;
