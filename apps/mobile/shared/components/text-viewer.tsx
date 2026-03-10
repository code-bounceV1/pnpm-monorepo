/**
 * TextViewer
 * Fetches plain text from a remote URL and displays it in a monospace ScrollView.
 * Suitable for txt, md, log, json, xml files.
 */
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";

interface TextViewerProps {
    url: string;
}

const TextViewer = ({ url }: TextViewerProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(false);
        setContent(null);

        fetch(url)
            .then((r) => r.text())
            .then((text) => {
                if (mounted) { setContent(text); setLoading(false); }
            })
            .catch(() => {
                if (mounted) { setError(true); setLoading(false); }
            });

        return () => { mounted = false; };
    }, [url]);

    if (loading) {
        return (
            <View className="flex-1 bg-[#0D0D0D] items-center justify-center gap-3">
                <ActivityIndicator size="large" color="#aaa" />
                <Text className="text-[#aaa] text-sm">Loading file…</Text>
            </View>
        );
    }

    if (error || content === null) {
        return (
            <View className="flex-1 bg-[#0D0D0D] items-center justify-center gap-4 px-8">
                <View className="w-28 h-28 rounded-full bg-white/5 border border-white/10 items-center justify-center">
                    <Ionicons name="document-outline" size={52} color="#888" />
                </View>
                <Text className="text-[#E0E0E0] text-base font-bold text-center">
                    Unable to load file
                </Text>
                <TouchableOpacity
                    className="flex-row items-center bg-[#444] rounded-full px-6 py-3 gap-2 mt-2"
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
            className="flex-1 bg-[#0D0D0D]"
            contentContainerStyle={{ padding: 16 }}
        >
            {/* Character count pill */}
            <View className="flex-row justify-end mb-3">
                <View className="bg-white/5 rounded-full px-3 py-1">
                    <Text className="text-[#555] text-xs">
                        {content.length.toLocaleString()} chars
                    </Text>
                </View>
            </View>

            <Text
                selectable
                style={{
                    fontFamily: "monospace",
                    fontSize: 13,
                    lineHeight: 20,
                    color: "#C9D1D9",
                    letterSpacing: 0.2,
                }}
            >
                {content}
            </Text>
        </ScrollView>
    );
};

export default TextViewer;
