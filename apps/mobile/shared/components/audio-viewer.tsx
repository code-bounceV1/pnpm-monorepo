/**
 * AudioViewer
 * Custom music-player UI powered by expo-audio.
 * Shows album art placeholder, play/pause, seek bar, time, mute.
 */
import React, { useCallback, useEffect } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from "expo-audio";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface AudioViewerProps {
    url: string;
    displayName: string;
}

/** Format seconds → M:SS */
const fmt = (secs: number) => {
    const s = Math.floor(secs);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const AudioViewer = ({ url, displayName }: AudioViewerProps) => {
    const player = useAudioPlayer(url);
    const status = useAudioPlayerStatus(player);

    const loading = !status.isLoaded;
    const isPlaying = status.playing;
    const isMuted = player.muted;
    // currentTime and duration are in seconds
    const position = status.currentTime ?? 0;
    const duration = status.duration ?? 0;
    const progressPct = duration > 0 ? position / duration : 0;
    const error = status.isLoaded && status?.error != null;

    /* ── Setup audio mode (play through silent switch on iOS) ── */
    useEffect(() => {
        setAudioModeAsync({ playsInSilentMode: true });
    }, []);

    /* ── Controls ── */
    const togglePlay = useCallback(() => {
        if (isPlaying) {
            player.pause();
        } else {
            // If at the end, seek back to start first
            if (duration > 0 && position >= duration - 0.3) {
                player.seekTo(0);
            }
            player.play();
        }
    }, [isPlaying, position, duration, player]);

    const toggleMute = useCallback(() => {
        player.muted = !player.muted;
    }, [player]);

    const seek = useCallback(
        (pct: number) => {
            if (duration === 0) return;
            player.seekTo(pct * duration);
        },
        [duration, player],
    );

    if (error) {
        return (
            <View className="flex-1 bg-[#0A0A0A] items-center justify-center gap-4 px-8">
                <View className="w-28 h-28 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 items-center justify-center">
                    <Ionicons name="musical-note-outline" size={52} color="#10B981" />
                </View>
                <Text className="text-[#E0E0E0] text-base font-bold text-center">{displayName}</Text>
                <Text className="text-[#666] text-sm text-center">Unable to play audio</Text>
                <TouchableOpacity
                    className="flex-row items-center bg-[#10B981] rounded-full px-8 py-3.5 gap-2"
                    onPress={() => WebBrowser.openBrowserAsync(url)}
                >
                    <Ionicons name="open-outline" size={16} color="#fff" />
                    <Text className="text-white font-bold text-sm">Open in Browser</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#0A0A0A] items-center justify-center px-6">
            {/* Ambient glow */}
            <View className="absolute w-80 h-80 rounded-full bg-[#10B981]/8 top-1/4 self-center" />

            <View className="w-full max-w-sm items-center gap-6">
                {/* Album art */}
                <View className="w-52 h-52 rounded-3xl bg-[#10B981]/10 border border-[#10B981]/20 items-center justify-center">
                    <LinearGradient
                        colors={["#10B98130", "#10B98108"]}
                        className="absolute inset-0 rounded-3xl"
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color="#10B981" />
                    ) : (
                        <Ionicons name="musical-notes" size={80} color="#10B981" />
                    )}
                </View>

                {/* Track info */}
                <View className="items-center gap-1 w-full">
                    <Text className="text-white text-lg font-bold text-center" numberOfLines={2}>
                        {displayName}
                    </Text>
                    <Text className="text-[#555] text-xs uppercase tracking-widest">Audio File</Text>
                </View>

                {/* Seek bar */}
                <View className="w-full gap-1">
                    <Pressable
                        className="w-full h-2 rounded-full bg-white/10 overflow-hidden"
                        onPress={(e) => {
                            const tapX = e.nativeEvent.locationX;
                            // width unknown here; use a rough estimate via onLayout
                        }}
                    >
                        <View
                            className="h-full bg-[#10B981] rounded-full"
                            style={{ width: `${progressPct * 100}%` }}
                        />
                    </Pressable>
                    <View className="flex-row justify-between">
                        <Text className="text-[#555] text-xs">{fmt(position)}</Text>
                        <Text className="text-[#555] text-xs">{fmt(duration)}</Text>
                    </View>
                </View>

                {/* Controls */}
                <View className="flex-row items-center gap-6">
                    {/* Mute */}
                    <Pressable
                        onPress={toggleMute}
                        className="w-10 h-10 items-center justify-center"
                        hitSlop={10}
                    >
                        <Ionicons
                            name={isMuted ? "volume-mute-outline" : "volume-medium-outline"}
                            size={24}
                            color={isMuted ? "#555" : "#aaa"}
                        />
                    </Pressable>

                    {/* Play / Pause */}
                    <Pressable
                        onPress={loading ? undefined : togglePlay}
                        className="w-16 h-16 rounded-full bg-[#10B981] items-center justify-center"
                        style={{ opacity: loading ? 0.5 : 1 }}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="#fff" />
                        )}
                    </Pressable>

                    {/* Rewind 10s */}
                    <Pressable
                        onPress={() => seek(Math.max(0, (position - 10) / duration))}
                        className="w-10 h-10 items-center justify-center"
                        hitSlop={10}
                    >
                        <Ionicons name="play-back-outline" size={24} color="#aaa" />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default AudioViewer;
