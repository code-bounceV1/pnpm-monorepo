import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { StatusChangeEventPayload, VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";

interface VideoViewerProps {
    url: string;
    displayName: string;
}

const VideoViewer = ({ url, displayName }: VideoViewerProps) => {
    const [firstFrame, setFirstFrame] = useState(false);
    const [error, setError] = useState(false);

    const player = useVideoPlayer(url);

    // Track errors via status change event
    useEvent(player, "statusChange", (payload) => {
        console.log("payload", payload);
        if (payload?.status === "error") {
            setError(true);
        }
    });

    useEffect(() => {
        player.play();
    }, []);

    const openInBrowser = useCallback(async () => {
        await WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        });
    }, [url]);

    if (error) {
        return (
            <View className="flex-1 bg-black items-center justify-center gap-4 px-8">
                <View className="w-28 h-28 rounded-full bg-[#9B59B6]/10 border border-[#9B59B6]/30 items-center justify-center">
                    <Ionicons name="play-circle-outline" size={52} color="#9B59B6" />
                </View>
                <Text className="text-[#E0E0E0] text-base font-bold text-center">
                    Unable to play video
                </Text>
                <Text className="text-[#888] text-sm text-center" numberOfLines={2}>
                    {displayName}
                </Text>
                <TouchableOpacity
                    className="flex-row items-center bg-[#9B59B6] rounded-full px-8 py-3.5 gap-2 mt-2"
                    onPress={openInBrowser}
                    activeOpacity={0.85}
                >
                    <Ionicons name="open-outline" size={16} color="#fff" />
                    <Text className="text-white font-bold text-sm">Open in Browser</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            {/*
       * Key fix: surfaceType="textureView" on Android renders the video
       * inside the normal view hierarchy (like TextureView in Android),
       * so overlays (loading spinner, error state) draw ON TOP correctly.
       * Default SurfaceView renders below all other views, making overlays
       * invisible and causing the "frozen/paused" appearance.
       */}
            <VideoView

                player={player}
                style={{ flex: 1 }}
                contentFit="contain"
                nativeControls
                allowsPictureInPicture
                surfaceType={Platform.OS === "android" ? "textureView" : "surfaceView"}
                fullscreenOptions={{ enable: true }}
                onFirstFrameRender={() => setFirstFrame(true)}
            />

            {/* Loading spinner — shown until first frame renders */}
            {/* {!firstFrame && (
                <View className="absolute inset-0 items-center justify-center bg-black gap-3">
                    <ActivityIndicator size="large" color="#9B59B6" />
                    <Text className="text-[#aaa] text-sm">Loading video…</Text>
                </View>
            )} */}
        </View>
    );
};

export default VideoViewer;

