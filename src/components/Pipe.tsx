import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { CONFIG, COLORS } from '../constants/Config';

interface PipeProps {
    pipe: { id: number; initialScroll: number; height: number };
    scrollX: SharedValue<number>;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Pipe: React.FC<PipeProps> = ({ pipe, scrollX }) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: pipe.initialScroll - scrollX.value }],
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {/* Top Pipe */}
            <View style={[styles.pipe, { height: pipe.height, top: 0, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }]}>
                <View style={styles.gradient} />
                <View style={[styles.gradient, { left: 40, width: 5, opacity: 0.1 }]} />
                <View style={styles.pipeCap} />
            </View>

            {/* Bottom Pipe */}
            <View
                style={[
                    styles.pipe,
                    {
                        height: SCREEN_HEIGHT - pipe.height - CONFIG.PIPE_GAP - 100,
                        bottom: 100,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    },
                ]}
            >
                <View style={styles.gradient} />
                <View style={[styles.gradient, { left: 40, width: 5, opacity: 0.1 }]} />
                <View style={[styles.pipeCap, { bottom: -5, top: undefined }]} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: CONFIG.PIPE_WIDTH,
        height: SCREEN_HEIGHT,
    },
    pipe: {
        position: 'absolute',
        width: CONFIG.PIPE_WIDTH,
        backgroundColor: COLORS.PIPE,
        borderColor: '#3a5a1a',
        borderWidth: 5,
        overflow: 'hidden',
    },
    pipeCap: {
        position: 'absolute',
        width: CONFIG.PIPE_WIDTH + 14,
        height: 35,
        backgroundColor: COLORS.PIPE,
        left: -7,
        top: -5,
        borderColor: '#3a5a1a',
        borderWidth: 5,
        borderRadius: 8,
        zIndex: 10,
    },
    gradient: {
        position: 'absolute',
        left: 10,
        width: 15,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.2)',
    }
});
