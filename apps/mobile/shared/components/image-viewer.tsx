/**
 * ImageViewer
 * Full-screen pinch-to-zoom image renderer using expo-image (faster, cached).
 */
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Text,
    View,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

interface ImageViewerProps {
    url: string;
}

const ImageViewer = ({ url }: ImageViewerProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    return (
        <View className="flex-1">
            <ScrollView
                centerContent
                maximumZoomScale={5}
                minimumZoomScale={1}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    width: SCREEN_W,
                    minHeight: SCREEN_H,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                bouncesZoom
            >
                {error ? (
                    <View className="items-center justify-center gap-3 p-8">
                        <Ionicons name="image-outline" size={56} color="#555" />
                        <Text className="text-[#666] text-sm">Could not load image</Text>
                    </View>
                ) : (
                    <Image
                        source={{ uri: url }}
                        style={{ width: SCREEN_W, height: SCREEN_H }}
                        contentFit="contain"
                        transition={200}
                        onLoadStart={() => setLoading(true)}
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError(true);
                        }}
                    />
                )}
            </ScrollView>

            {loading && !error && (
                <View className="absolute inset-0 items-center justify-center bg-black/60 gap-3">
                    <ActivityIndicator size="large" color="#fff" />
                    <Text className="text-[#aaa] text-sm">Loading…</Text>
                </View>
            )}

            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.55)"]}
                className="absolute bottom-0 left-0 right-0 h-20 items-center justify-end pb-5"
                pointerEvents="none"
            />

        </View>
    );
};

export default ImageViewer;
