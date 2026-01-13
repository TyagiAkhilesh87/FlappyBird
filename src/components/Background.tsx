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
                duration: 15000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const layer1Style = useAnimatedStyle(() => ({
        transform: [{ translateX: scrollX.value * 0.2 }],
    }));

    const layer2Style = useAnimatedStyle(() => ({
        transform: [{ translateX: scrollX.value * 0.5 }],
    }));

    const layer3Style = useAnimatedStyle(() => ({
        transform: [{ translateX: scrollX.value }],
    }));

    const renderLayer = (style: any, children: React.ReactNode) => (
        <Animated.View style={[styles.parallaxLayer, style]}>
            <View style={styles.layerContent}>
                {children}
            </View>
            <View style={[styles.layerContent, { left: SCREEN_WIDTH }]}>
                {children}
            </View>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            {/* Sky Gradient */}
            <View style={styles.sky}>
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1e3c72' }]} />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: '#2a5298', opacity: 0.5 }]} />
            </View>

            {/* Distant Layer: Clouds (Slowest) */}
            {renderLayer(layer1Style, (
                <>
                    <View style={[styles.cloud, { top: 50, left: 40, width: 100, height: 40 }]} />
                    <View style={[styles.cloud, { top: 120, left: 200, width: 140, height: 50 }]} />
                    <View style={[styles.cloud, { top: 80, left: 400, width: 120, height: 45 }]} />
                </>
            ))}

            {/* Mid Layer: Mountains (Medium) */}
            {renderLayer(layer2Style, (
                <>
                    <View style={[styles.mountain, { left: 20, height: 180, width: 220, backgroundColor: '#2c3e50', opacity: 0.6 }]} />
                    <View style={[styles.mountain, { left: 180, height: 240, width: 280, backgroundColor: '#34495e', opacity: 0.6 }]} />
                    <View style={[styles.mountain, { left: 400, height: 150, width: 200, backgroundColor: '#2c3e50', opacity: 0.6 }]} />
                </>
            ))}

            {/* Near Layer: Hills (Fastest) */}
            {renderLayer(layer3Style, (
                <>
                    <View style={[styles.hill, { left: 0, height: 80, width: 300 }]} />
                    <View style={[styles.hill, { left: 250, height: 100, width: 350 }]} />
                </>
            ))}

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
        width: SCREEN_WIDTH,
        height: 400,
    },
    layerContent: {
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: '100%',
    },
    cloud: {
        position: 'absolute',
        backgroundColor: '#FFF',
        opacity: 0.3,
        borderRadius: 50,
    },
    mountain: {
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 150,
        borderTopRightRadius: 150,
    },
    hill: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#27ae60',
        opacity: 0.8,
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
