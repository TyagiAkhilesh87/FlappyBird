import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, interpolate, Extrapolate, SharedValue } from 'react-native-reanimated';
import Svg, { Path, Circle, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { CONFIG, COLORS } from '../constants/Config';

interface BirdProps {
    birdY: SharedValue<number>;
    birdRotation: SharedValue<number>;
    birdVelocity: SharedValue<number>;
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
        // High-end "Real Motion" physics
        // Squash and stretch based on vertical velocity
        // When going up (velocity < 0), we stretch vertically
        // When falling (velocity > 0), we squash slightly upon terminal velocity or transition
        const scaleY = interpolate(birdVelocity.value, [-15, 0, 15], [1.3, 1, 0.85], Extrapolate.CLAMP);
        const scaleX = interpolate(birdVelocity.value, [-15, 0, 15], [0.8, 1, 1.15], Extrapolate.CLAMP);

        // Dynamic tilt - more responsive than just linear
        const rotation = interpolate(birdVelocity.value, [-10, 15], [-25, 90], Extrapolate.CLAMP);

        return {
            transform: [
                { translateY: birdY.value },
                { rotate: `${rotation}deg` },
                { scaleX },
                { scaleY },
            ] as any,
        };
    });

    const wingStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${wingRotation.value}deg` },
                { translateX: -5 }
            ] as const,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <View style={styles.glow} />

            {/* Premium 9-Figure Bird SVG */}
            <Svg width={CONFIG.BIRD_SIZE * 1.5} height={CONFIG.BIRD_SIZE * 1.5} viewBox="0 0 100 100">
                <Defs>
                    {/* Multi-layered gradients for depth */}
                    <LinearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#FFEB3B" />
                        <Stop offset="100%" stopColor="#FBC02D" />
                    </LinearGradient>
                    <LinearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                        <Stop offset="100%" stopColor="#FFF9C4" stopOpacity="0.5" />
                    </LinearGradient>
                    <LinearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#FF9800" />
                        <Stop offset="100%" stopColor="#E65100" />
                    </LinearGradient>
                </Defs>

                {/* Main Body with Shadow Layer */}
                <G>
                    {/* Subtle outer stroke for definition */}
                    <Ellipse cx="45" cy="50" rx="36" ry="31" fill="#333" opacity="0.1" />

                    {/* Primary Body */}
                    <Ellipse cx="45" cy="50" rx="35" ry="30" fill="url(#bodyGrad)" stroke="#2D3436" strokeWidth="2.5" />

                    {/* Belly - Adds high-end depth */}
                    <Ellipse cx="42" cy="62" rx="20" ry="12" fill="url(#bellyGrad)" />
                </G>

                {/* Tail Fin */}
                <Path
                    d="M 12 50 L -2 35 Q -8 50 -2 65 Z"
                    fill="#FBC02D"
                    stroke="#2D3436"
                    strokeWidth="2.5"
                />

                {/* Eye Section - Expressive & Premium */}
                <G>
                    {/* White of the eye */}
                    <Circle cx="68" cy="40" r="13" fill="white" stroke="#2D3436" strokeWidth="2" />
                    {/* Pupil with highlight */}
                    <Circle cx="74" cy="40" r="6" fill="#2D3436" />
                    <Circle cx="76" cy="37" r="2.5" fill="white" />
                </G>

                {/* Beak - Two parts for realism */}
                <G>
                    {/* Upper Beak */}
                    <Path d="M 78 48 L 98 52 Q 100 55 98 58 L 76 58 Z" fill="url(#beakGrad)" stroke="#2D3436" strokeWidth="2" />
                    {/* Lower Beak Shadow */}
                    <Path d="M 76 58 L 92 58 Q 90 64 76 64 Z" fill="#BF360C" stroke="#2D3436" strokeWidth="2" />
                </G>

                {/* Red Cheek Accent */}
                <Circle cx="58" cy="55" r="7" fill="#FF5252" opacity="0.5" />
            </Svg>

            {/* Premium Animated Wing */}
            <Animated.View style={[styles.wingContainer, wingStyle]}>
                <Svg width={35} height={35} viewBox="0 0 40 40">
                    <Defs>
                        <LinearGradient id="wingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor="#FFFFFF" />
                            <Stop offset="100%" stopColor="#FFF9C4" />
                        </LinearGradient>
                    </Defs>
                    <Path
                        d="M 5 20 Q 20 0 35 20 Q 20 40 5 20"
                        fill="url(#wingGrad)"
                        stroke="#2D3436"
                        strokeWidth="2.5"
                    />
                    {/* Wing detail lines */}
                    <Path d="M 15 20 L 25 20" stroke="#2D3436" strokeWidth="1.5" opacity="0.3" />
                </Svg>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: CONFIG.BIRD_X,
        width: CONFIG.BIRD_SIZE * 1.5,
        height: CONFIG.BIRD_SIZE * 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
    },
    glow: {
        position: 'absolute',
        width: CONFIG.BIRD_SIZE * 2,
        height: CONFIG.BIRD_SIZE * 2,
        backgroundColor: '#FFEB3B',
        borderRadius: 100,
        opacity: 0.15,
        transform: [{ scale: 1.2 }],
    },
    wingContainer: {
        position: 'absolute',
        left: 20,
        top: 35,
        width: 35,
        height: 35,
        zIndex: 60,
    }
});
