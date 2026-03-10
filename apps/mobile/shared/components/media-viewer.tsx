/**
 * MediaViewer — Scalable full‑screen media viewer modal.
 *
 * Supports 10 media kinds, all rendered natively inside the app:
 *   image  → ImageViewer   (expo-image, pinch-to-zoom)
 *   pdf    → PdfViewer     (react-native-pdf, native renderer)
 *   video  → VideoViewer   (expo-video, native controls)
 *   audio  → AudioViewer   (expo-av Audio, custom player UI)
 *   html   → HtmlViewer    (react-native-render-html, fetched inline)
 *   office → OfficeViewer  (WebView + Office Online — doc, docx, ppt, pptx)
 *   csv    → OfficeViewer  (WebView + Google Docs Viewer)
 *   xlsx   → OfficeViewer  (WebView + Google Docs / Office Online)
 *   text   → TextViewer    (fetch + monospace ScrollView)
 *   external → ExternalViewer (expo-web-browser card)
 *
 * Props:
 *   media        — MediaItem object (see type below)
 *   visible      — controls whether the modal is open
 *   onClose      — dismiss callback
 *   downloadable — show share/download button in header (default: false)
 */

import React, { useCallback } from "react";
import {
    Modal,
    Platform,
    Pressable,
    Share,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// Sub-renderers
import ImageViewer from "./image-viewer";
import VideoViewer from "./video-viewer";
import AudioViewer from "./audio-viewer";
import HtmlViewer from "./html-viewer";
import OfficeViewer from "./office-viewer";
import TextViewer from "./text-viewer";
// Utils
import { resolveMediaKind, getMediaUrl, type MediaKind } from "@/shared/utils/media-utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface MediaItem {
    id: string;
    /** File name shown in the header */
    displayName: string;
    /** MIME type e.g. "application/pdf", "image/jpeg", "video/mp4" */
    contentType: string;
    /** Lowercase file extension e.g. "pdf", "jpg", "mp4" */
    docType?: string;
    downloadLink?: string | null;
    downloadUrl?: string | null;
    sourceUrl?: string | null;
    [key: string]: unknown;
}

export interface MediaViewerProps {
    media: MediaItem | null;
    visible: boolean;
    onClose: () => void;
    /** Show share button in the header. Defaults to false. */
    downloadable?: boolean;
}

// ─── Status bar height ─────────────────────────────────────────────────────────

const STATUS_H = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) : 44;

// ─── Icon map for ExternalViewer ───────────────────────────────────────────────

const KIND_ICON: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
    image: { icon: "image-outline", color: "#27AE60" },
    pdf: { icon: "document-text-outline", color: "#E74C3C" },
    video: { icon: "play-circle-outline", color: "#9B59B6" },
    audio: { icon: "musical-note-outline", color: "#10B981" },
    html: { icon: "code-slash-outline", color: "#3498DB" },
    office: { icon: "document-outline", color: "#2B579A" },
    csv: { icon: "grid-outline", color: "#217346" },
    xlsx: { icon: "grid-outline", color: "#217346" },
    text: { icon: "document-text-outline", color: "#888888" },
    external: { icon: "link-outline", color: "#F39C12" },
};

// ─── External / unknown fallback ───────────────────────────────────────────────

const ExternalViewer = ({
    displayName,
    url,
    kind,
}: {
    displayName: string;
    url: string;
    kind: MediaKind;
}) => {
    const [opening, setOpening] = React.useState(false);
    const meta = KIND_ICON[kind] ?? KIND_ICON.external;

    const open = useCallback(async () => {
        setOpening(true);
        try {
            await WebBrowser.openBrowserAsync(url, {
                presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
            });
        } finally {
            setOpening(false);
        }
    }, [url]);

    return (
        <View className="flex-1 items-center justify-center px-6 bg-[#0D0D0D]">
            <View className="w-full max-w-sm bg-[#1A1A1A] rounded-3xl border border-white/5 p-8 items-center gap-4">
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
                <Text className="text-[#E0E0E0] text-base font-bold text-center" numberOfLines={2}>
                    {displayName}
                </Text>
                <Text className="text-[#555] text-sm text-center">
                    This file type cannot be previewed inline
                </Text>
                <TouchableOpacity
                    className="flex-row items-center justify-center w-full rounded-full py-3.5 gap-2 mt-2"
                    style={{ backgroundColor: meta.color }}
                    onPress={open}
                    disabled={opening}
                    activeOpacity={0.85}
                >
                    {opening ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="open-outline" size={16} color="#fff" />
                            <Text className="text-white font-bold text-sm">Open in Browser</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

// ─── Content router ────────────────────────────────────────────────────────────

function renderContent(media: MediaItem, kind: MediaKind, url: string) {
    switch (kind) {
        case "image":
            return <ImageViewer url={url} />;
        case "pdf":
            return <OfficeViewer url={url} kind="pdf" />;
        case "video":
            return <VideoViewer url={url} displayName={media.displayName} />;
        case "audio":
            return <AudioViewer url={url} displayName={media.displayName} />;
        case "html":
            return <HtmlViewer url={url} />;
        case "office":
            return <OfficeViewer url={url} kind="office" />;
        case "csv":
            return <OfficeViewer url={url} kind="csv" />;
        case "xlsx":
            return <OfficeViewer url={url} kind="xlsx" />;
        case "text":
            return <TextViewer url={url} />;
        default:
            return <ExternalViewer displayName={media.displayName} url={url} kind={kind} />;
    }
}

// ─── Main MediaViewer ──────────────────────────────────────────────────────────

const MediaViewer = ({
    media,
    visible,
    onClose,
    downloadable = false,
}: MediaViewerProps) => {
    const kind: MediaKind = media
        ? resolveMediaKind(media.contentType, media.docType)
        : "external";
    const url = media ? getMediaUrl(media) : "";

    const handleShare = useCallback(async () => {
        if (!url) return;
        try {
            await Share.share({
                url,
                title: media?.displayName ?? "File",
                message: Platform.OS === "android" ? url : undefined,
            });
        } catch (err) {
            console.error(err);
        }
    }, [url, media]);



    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <View className="flex-1 bg-[#0D0D0D]">
                {/* Content */}
                {media ? renderContent(media, kind, url) : null}

                {/* Header overlay */}
                {media && (
                    <LinearGradient
                        colors={["rgba(0,0,0,0.85)", "transparent"]}
                        className="absolute top-0 left-0 right-0 z-10 flex-row items-center px-2 pb-6"
                        style={{ paddingTop: STATUS_H + 8 }}
                        pointerEvents="box-none"
                    >
                        {/* Close */}
                        <Pressable
                            onPress={onClose}
                            className="w-11 h-11 rounded-full bg-white/15 items-center justify-center"
                            hitSlop={24}
                        >
                            <Ionicons name="close" size={24} color="#fff" />
                        </Pressable>

                        {/* Title */}
                        <Text
                            className="flex-1 text-white text-sm font-semibold text-center mx-1"
                            numberOfLines={1}
                        >
                            {media.displayName}
                        </Text>

                        {/* Share */}
                        {downloadable ? (
                            <Pressable
                                onPress={handleShare}
                                className="w-11 h-11 rounded-full bg-white/15 items-center justify-center"
                                hitSlop={12}
                            >
                                <Ionicons name="share-outline" size={22} color="#fff" />
                            </Pressable>
                        ) : (
                            <View className="w-11 h-11" />
                        )}
                    </LinearGradient>
                )}
            </View>


        </Modal>
    );
};

export default MediaViewer;
