import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, interpolate, Extrapolate } from 'react-native-reanimated';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CONFIG, COLORS } from '../constants/Config';

interface BirdProps {
    birdY: Animated.SharedValue<number>;
    birdRotation: Animated.SharedValue<number>;
    birdVelocity: Animated.SharedValue<number>;
}

export const Bird: React.FC<BirdProps> = ({ birdY, birdRotation, birdVelocity }) => {
    const wingRotation = useSharedValue(0);

    useEffect(() => {
        wingRotation.value = withRepeat(
            withTiming(45, { duration: 120, easing: Easing.inOut(Easing.quad) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        // Squezze and stretch for "Real Motion"
        const scaleY = interpolate(birdVelocity.value, [-15, 0, 15], [1.25, 1, 0.8], Extrapolate.CLAMP);
        const scaleX = interpolate(birdVelocity.value, [-15, 0, 15], [0.8, 1, 1.25], Extrapolate.CLAMP);

        return {
            transform: [
                { translateY: birdY.value },
                { rotate: `${birdRotation.value}deg` },
                { scaleX },
                { scaleY },
            ],
        };
    });

    const wingStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${wingRotation.value}deg` },
            ],
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.glow} />

            {/* Main Bird SVG */}
            <Svg width={CONFIG.BIRD_SIZE} height={CONFIG.BIRD_SIZE} viewBox="0 0 100 100">
                <Defs>
                    <LinearGradient id="birdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={COLORS.BIRD} />
                        <Stop offset="100%" stopColor="#ffcc00" />
                    </LinearGradient>
                </Defs>

                {/* Body - Ellipse for a more realistic shape than a circle */}
                <Ellipse cx="45" cy="50" rx="35" ry="30" fill="url(#birdGrad)" stroke="#333" strokeWidth="2" />

                {/* Tail */}
                <Path d="M 10 50 L -5 35 L -5 65 Z" fill={COLORS.BIRD} stroke="#333" strokeWidth="2" />

                {/* Eye - More detailed */}
                <Circle cx="65" cy="40" r="12" fill="white" stroke="#333" strokeWidth="1.5" />
                <Circle cx="72" cy="40" r="5" fill="black" />
                <Circle cx="74" cy="38" r="2" fill="white" />

                {/* Red Cheek (Premium touch) */}
                <Circle cx="60" cy="55" r="7" fill="#ff4444" opacity="0.4" />

                {/* Beak - Rounded at the base */}
                <Path d="M 78 50 L 98 55 L 78 60 Q 82 55 78 50" fill="#FF8C00" stroke="#333" strokeWidth="1.5" />
            </Svg>

            {/* Wing - Separated into its own Absolute Animated View for Web Compatibility */}
            <Animated.View style={[styles.wingContainer, wingStyle]}>
                <Svg width={30} height={30} viewBox="0 0 40 40">
                    <Path d="M 0 20 Q 20 0 40 20 Q 20 40 0 20" fill="white" stroke="#333" strokeWidth="1.5" />
                </Svg>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: CONFIG.BIRD_X,
        width: CONFIG.BIRD_SIZE,
        height: CONFIG.BIRD_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.BIRD,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 10,
    },
    glow: {
        position: 'absolute',
        width: CONFIG.BIRD_SIZE * 1.2,
        height: CONFIG.BIRD_SIZE * 1.2,
        backgroundColor: COLORS.BIRD,
        borderRadius: 50,
        opacity: 0.1,
    },
    wingContainer: {
        position: 'absolute',
        left: 20,
        top: 35,
        width: 30,
        height: 30,
        zIndex: 10,
    }
});
