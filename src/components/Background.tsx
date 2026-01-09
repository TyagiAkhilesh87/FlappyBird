import React from 'react';
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, interpolate, Easing } from 'react-native-reanimated';
import { CONFIG, COLORS } from '../constants/Config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Background: React.FC = () => {
    const scrollX = useSharedValue(0);

    React.useEffect(() => {
        scrollX.value = withRepeat(
            withTiming(-SCREEN_WIDTH, {
                duration: 10000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: scrollX.value }],
    }));

    return (
        <View style={styles.container}>
            {/* Sky */}
            <View style={[styles.sky, { backgroundColor: COLORS.SKY }]} />

            {/* Parallax Mountains/Clouds (Simplified for now with Views) */}
            <Animated.View style={[styles.parallaxLayer, animatedStyle]}>
                {/* Drawing some mountains with absolute views */}
                <View style={[styles.mountain, { left: 50, height: 150, width: 200 }]} />
                <View style={[styles.mountain, { left: 200, height: 200, width: 250 }]} />
                <View style={[styles.mountain, { left: 400, height: 120, width: 180 }]} />
                {/* Repeated for seamless scroll */}
                <View style={[styles.mountain, { left: 50 + SCREEN_WIDTH, height: 150, width: 200 }]} />
                <View style={[styles.mountain, { left: 200 + SCREEN_WIDTH, height: 200, width: 250 }]} />
                <View style={[styles.mountain, { left: 400 + SCREEN_WIDTH, height: 120, width: 180 }]} />
            </Animated.View>

            {/* Ground */}
            <View style={[styles.ground, { backgroundColor: COLORS.GROUND }]}>
                <View style={styles.groundLine} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        zIndex: -1,
    },
    sky: {
        flex: 1,
    },
    parallaxLayer: {
        position: 'absolute',
        bottom: 100,
        width: SCREEN_WIDTH * 2,
        height: 300,
        flexDirection: 'row',
    },
    mountain: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#3FB0BB',
        opacity: 0.5,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
    },
    ground: {
        height: 100,
        width: '100%',
        borderTopWidth: 5,
        borderTopColor: '#52AD1C',
    },
    groundLine: {
        height: 10,
        width: '100%',
        backgroundColor: '#73BF2E',
        marginTop: 5,
    },
});
