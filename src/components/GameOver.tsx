import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { RefreshCcw, Home, Trophy, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/useGameStore';
import { COLORS } from '../constants/Config';
import { submitScore } from '../utils/supabase';

interface GameOverProps {
    onRestart: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GameOver: React.FC<GameOverProps> = ({ onRestart }) => {
    const { score, highScore, setHighScore } = useGameStore();
    const [username, setUsername] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
        }
    }, [score, highScore]);

    const handleSubmit = async () => {
        if (!username.trim()) return;
        setIsSubmitting(true);
        const success = await submitScore(username, score);
        setIsSubmitting(false);
        if (success) setSubmitted(true);
    };

    return (
        <View style={styles.overlay}>
            <Animated.View entering={ZoomIn.duration(400)} style={styles.container}>
                <Text style={styles.title}>GAME OVER</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>SCORE</Text>
                        <Text style={styles.statValue}>{score}</Text>
                    </View>
                    <View style={[styles.statBox, { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)' }]}>
                        <Text style={styles.statLabel}>BEST</Text>
                        <Text style={styles.statValue}>{highScore}</Text>
                    </View>
                </View>

                {!submitted ? (
                    <View style={styles.submissionBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="ENTER YOUR NAME"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={username}
                            onChangeText={setUsername}
                            maxLength={15}
                        />
                        <TouchableOpacity
                            style={[styles.submitIconButton, { opacity: username.trim() ? 1 : 0.5 }]}
                            onPress={handleSubmit}
                            disabled={isSubmitting || !username.trim()}
                        >
                            {isSubmitting ? <ActivityIndicator color={COLORS.WHITE} /> : <Send color={COLORS.WHITE} size={20} />}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text style={styles.submittedText}>SCORE SUBMITTED!</Text>
                )}

                <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
                    <RefreshCcw color={COLORS.WHITE} size={28} />
                    <Text style={styles.buttonText}>TRY AGAIN</Text>
                </TouchableOpacity>

                <View style={styles.row}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.replace('/')}>
                        <Home color={COLORS.WHITE} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/leaderboard')}>
                        <Trophy color={COLORS.WHITE} size={24} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    container: {
        width: SCREEN_WIDTH * 0.85,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 30,
        padding: 30,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: COLORS.WHITE,
        marginBottom: 30,
        letterSpacing: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
        marginBottom: 20,
        width: '100%',
    },
    statBox: {
        flex: 1,
        paddingVertical: 20,
        alignItems: 'center',
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 5,
    },
    statValue: {
        color: COLORS.WHITE,
        fontSize: 36,
        fontWeight: '900',
    },
    submissionBox: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        marginBottom: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    input: {
        flex: 1,
        height: 50,
        color: COLORS.WHITE,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
    },
    submitIconButton: {
        padding: 10,
        backgroundColor: COLORS.PIPE,
        borderRadius: 10,
    },
    submittedText: {
        color: COLORS.PIPE,
        fontSize: 14,
        fontWeight: '800',
        marginBottom: 20,
        letterSpacing: 1,
    },
    restartButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.PRIMARY,
        paddingHorizontal: 40,
        paddingVertical: 18,
        borderRadius: 50,
        alignItems: 'center',
        gap: 15,
        marginBottom: 25,
        width: '100%',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        gap: 20,
    },
    iconButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});
