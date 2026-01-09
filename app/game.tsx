import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text, Platform } from 'react-native';
import { Bird } from '../src/components/Bird';
import { Pipe } from '../src/components/Pipe';
import { Background } from '../src/components/Background';
import { useGameEngine } from '../src/hooks/useGameEngine';
import { useGameStore } from '../src/store/useGameStore';
import { COLORS, CONFIG } from '../src/constants/Config';
import { GameOver } from '../src/components/GameOver';
import { Instructions } from '../src/components/Instructions';
import { ParticleSystem, ParticleSystemRef } from '../src/components/ParticleSystem';
import Animated, { FadeIn, useAnimatedStyle, withRepeat, withTiming, Easing, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

export default function GameScreen() {
    const { birdY, birdVelocity, birdRotation, scrollX, pipes, jump, resetEngine } = useGameEngine();
    const { isPlaying, isGameOver, score, startGame, resetGame } = useGameStore();
    const [showInstructions, setShowInstructions] = useState(true);
    const particleRef = useRef<ParticleSystemRef>(null);

    useEffect(() => {
        resetEngine();
        resetGame();
    }, [resetEngine, resetGame]);

    const handleStart = useCallback(() => {
        setShowInstructions(false);
        resetEngine();
        startGame();
    }, [startGame, resetEngine]);

    const handlePress = useCallback(() => {
        if (showInstructions) {
            handleStart();
        } else if (isPlaying && !isGameOver) {
            jump();
            particleRef.current?.emit(CONFIG.BIRD_X + 20, birdY.value + 20);
        }
    }, [showInstructions, handleStart, isPlaying, isGameOver, jump, birdY]);

    useEffect(() => {
        if (Platform.OS === 'web') {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.code === 'Space' || e.code === 'ArrowUp') {
                    e.preventDefault();
                    handlePress();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [handlePress]);

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: isGameOver ? withRepeat(withTiming(15, { duration: 50, easing: Easing.bounce }), 6, true) : 0 }
            ]
        };
    });

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <Animated.View style={[styles.container, containerStyle]}>
                <Background />

                <ParticleSystem ref={particleRef} />

                {/* Render Pipes */}
                {pipes.map((pipe) => (
                    <Pipe key={pipe.id} pipe={pipe} scrollX={scrollX} />
                ))}

                <Bird birdY={birdY} birdRotation={birdRotation} birdVelocity={birdVelocity} />

                {showInstructions && <Instructions />}

                {/* Score Display (Glassmorphic) */}
                {isPlaying && !isGameOver && (
                    <Animated.View entering={FadeIn} style={styles.scoreContainer}>
                        <View style={styles.glassScore}>
                            <Text style={styles.scoreText}>{score}</Text>
                        </View>
                    </Animated.View>
                )}

                {isGameOver && <GameOver onRestart={() => {
                    resetEngine();
                    resetGame();
                    setShowInstructions(true);
                }} />}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.SKY,
    },
    scoreContainer: {
        position: 'absolute',
        top: 60,
        width: '100%',
        alignItems: 'center',
        zIndex: 60,
    },
    glassScore: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    scoreText: {
        fontSize: 70,
        fontWeight: '900',
        color: '#FFF',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
});
