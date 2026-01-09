import React from 'react';
import { View, Text, StyleSheet, Animated as RNAnimated } from 'react-native';
import { MousePointer2, Keyboard, Touchpad } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { COLORS } from '../constants/Config';

export const Instructions: React.FC = () => {
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.title}>HOW TO PLAY</Text>

                <View style={styles.row}>
                    <View style={styles.item}>
                        <Keyboard color={COLORS.WHITE} size={32} />
                        <Text style={styles.text}>SPACE / UP</Text>
                    </View>
                    <View style={styles.item}>
                        <MousePointer2 color={COLORS.WHITE} size={32} />
                        <Text style={styles.text}>CLICK</Text>
                    </View>
                    <View style={styles.item}>
                        <Touchpad color={COLORS.WHITE} size={32} />
                        <Text style={styles.text}>TAP</Text>
                    </View>
                </View>

                <Text style={styles.hint}>TAP TO START</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
    },
    container: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: 30,
        borderRadius: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    title: {
        color: COLORS.WHITE,
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 30,
        letterSpacing: 2,
    },
    row: {
        flexDirection: 'row',
        gap: 30,
        marginBottom: 40,
    },
    item: {
        alignItems: 'center',
        gap: 10,
    },
    text: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    hint: {
        color: COLORS.PRIMARY,
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 4,
        // Add a pulsing effect if possible, but keep it simple for now
    }
});
