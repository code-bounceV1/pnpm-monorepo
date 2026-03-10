/**
 * OfficeViewer
 * WebView-based viewer for PDFs, Office docs (doc, docx, ppt, pptx) and
 * spreadsheets (csv, xlsx, xls) using external online renderers:
 *   • PDF                 → Google Docs embedded viewer  (gview?embedded=true)
 *   • Office docs/sheets  → Microsoft Office Online viewer
 *   • CSV                 → Google Docs embedded viewer
 *   • Fallback            → Google Docs viewer (works for most formats)
 *
 * Why gview for PDF? Passing a raw .pdf URL to WebView triggers a download
 * on Android/iOS instead of rendering the file inline. Proxying through
 * Google's gview endpoint forces inline rendering inside the WebView.
 */
import React, { useState } from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { KIND_META, OfficeKind } from "@/shared/constants/constants";


interface OfficeViewerProps {
    url: string;
    kind: OfficeKind;
}

/** Build the proxied viewer URL for a given kind + raw file URL. */
function getViewerUrl(kind: OfficeKind, rawUrl: string): string {
    const encoded = encodeURIComponent(rawUrl);
    switch (kind) {
        case "pdf":
            // Google Docs gview renders PDFs inline — no download triggered.
            return `https://docs.google.com/gview?embedded=true&url=${encoded}`;
        case "csv":
            return `https://docs.google.com/viewer?embedded=true&url=${encoded}`;
        case "xlsx":
        case "office":
        case "docx":
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encoded}`;
        default:
            return `https://docs.google.com/viewer?embedded=true&url=${encoded}`;
    }
}

const OfficeViewer = ({ url, kind }: OfficeViewerProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const meta = KIND_META[kind];
    const viewerUrl = getViewerUrl(kind, url);
    return (
        <View className="flex-1 bg-[#0D0D0D]">
            {loading && !error && (
                <View className="absolute inset-0 z-10 items-center justify-center bg-[#0D0D0D] gap-3">
                    <ActivityIndicator size="large" color={meta.color} />
                    <Text className="text-[#aaa] text-sm">Loading {meta.label}…</Text>
                </View>
            )}

            {error ? (
                <View className="flex-1 items-center justify-center gap-4 px-8">
                    <View
                        className="w-28 h-28 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: meta.color + "18",
                            borderWidth: 1,
                            borderColor: meta.color + "40",
                        }}
                    >
                        <Ionicons name={meta.icon} size={52} color={meta.color} />
                    </View>
                    <Text className="text-[#E0E0E0] text-base font-bold text-center">
                        Unable to preview {meta.label}
                    </Text>
                    <Text className="text-[#555] text-sm text-center">
                        Tap below to open in your browser
                    </Text>
                    <TouchableOpacity
                        className="flex-row items-center rounded-full px-6 py-3 gap-2 mt-2"
                        style={{ backgroundColor: meta.color }}
                        onPress={() => WebBrowser.openBrowserAsync(url)}
                    >
                        <Ionicons name="open-outline" size={16} color="#fff" />
                        <Text className="text-white font-bold text-sm">Open in Browser</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <WebView
                    source={{ uri: viewerUrl }}
                    style={{ flex: 1 }}
                    onLoadStart={() => setLoading(true)}
                    onLoad={() => setLoading(false)}
                    onError={() => { setLoading(false); setError(true); }}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState={false}
                    // Prevent the WebView from launching external download intents
                    onShouldStartLoadWithRequest={(req) => {
                        // Allow the viewer origin; block direct file downloads
                        return (
                            req.url.startsWith("https://docs.google.com") ||
                            req.url.startsWith("https://view.officeapps.live.com") ||
                            req.url.startsWith("https://ssl.gstatic.com") ||
                            req.url.startsWith("https://lh3.googleusercontent.com") ||
                            req.url.startsWith("data:") ||
                            req.url.startsWith("blob:")
                        );
                    }}
                />
            )}
        </View>
    );
};

export default OfficeViewer;
