import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Trophy, Volume2, VolumeX } from 'lucide-react-native';
import { COLORS } from '../src/constants/Config';
import { useGameStore } from '../src/store/useGameStore';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Background } from '../src/components/Background';

const { width } = Dimensions.get('window');

export default function Hub() {
    const router = useRouter();
    const { isSoundEnabled, toggleSound } = useGameStore();

    return (
        <View style={styles.container}>
            <Background />

            <View style={styles.content}>
                {/* Logo Section */}
                <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.logoContainer}>
                    <View>
                        <Text style={styles.logoText}>FLAPPY</Text>
                        <Text style={[styles.logoText, { color: COLORS.PRIMARY, marginTop: -20 }]}>BIRD</Text>
                        <Text style={[styles.logoText, { fontSize: 24, marginTop: -5, color: '#FFF' }]}>BY AKHILESH</Text>
                    </View>
                    <View style={styles.dot} />
                </Animated.View>

                {/* Menu Buttons */}
                <View style={styles.menu}>
                    <Animated.View entering={FadeInUp.delay(400)}>
                        <TouchableOpacity
                            style={styles.mainButton}
                            onPress={() => router.push('/game')}
                        >
                            <Play color="#000" size={32} fill="#000" />
                            <Text style={styles.mainButtonText}>START GAME</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(500)} style={styles.secondaryRow}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => router.push('/leaderboard')}
                        >
                            <Trophy color="#FFF" size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: isSoundEnabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,0,0,0.3)' }]}
                            onPress={toggleSound}
                        >
                            {isSoundEnabled ? <Volume2 color="#FFF" size={24} /> : <VolumeX color="#FFF" size={24} />}
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                <Animated.Text entering={FadeInUp.delay(800)} style={styles.footerText}>
                    made by love vibe coding - Akhilesh Tyagi
                </Animated.Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.SKY,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 80,
    },
    logoText: {
        fontSize: 84,
        fontWeight: '900',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 15,
        letterSpacing: -2,
    },
    dot: {
        width: 15,
        height: 15,
        backgroundColor: COLORS.PRIMARY,
        borderRadius: 10,
        position: 'absolute',
        bottom: 25,
        right: -10,
    },
    menu: {
        width: '100%',
        maxWidth: 350,
        gap: 15,
    },
    mainButton: {
        backgroundColor: COLORS.PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderRadius: 20,
        gap: 15,
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    mainButtonText: {
        color: '#000',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 1,
    },
    secondaryRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginTop: 10,
    },
    iconButton: {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    footerText: {
        position: 'absolute',
        bottom: 40,
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
    },
});
