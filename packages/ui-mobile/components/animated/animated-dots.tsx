import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';

interface AnimatedDotsProps {
    dotClassName?: string;
    containerClassName?: string;
    size?: number;
    color?: string;
    /** Duration (ms) for one full pulse cycle. Default 1200 */
    duration?: number;
}

function SingleDot({
    delay,
    size = 10,
    color = '#6C63FF',
    duration = 1200,
}: {
    delay: number;
    size?: number;
    color?: string;
    duration?: number;
}) {
    const opacity = useSharedValue(0.2);
    const scale = useSharedValue(0.7);

    useEffect(() => {
        const half = duration / 2;
        opacity.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration: half, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.2, { duration: half, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            )
        );
        scale.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1.2, { duration: half, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.7, { duration: half, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    marginHorizontal: size * 0.4,
                },
            ]}
        />
    );
}

export function AnimatedDots({
    size = 10,
    color = '#6C63FF',
    duration = 1200,
    containerClassName,
}: AnimatedDotsProps) {
    const stagger = duration / 3;
    return (
        <View
            className={containerClassName}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
        >
            <SingleDot delay={0} size={size} color={color} duration={duration} />
            <SingleDot delay={stagger} size={size} color={color} duration={duration} />
            <SingleDot delay={stagger * 2} size={size} color={color} duration={duration} />
        </View>
    );
}
