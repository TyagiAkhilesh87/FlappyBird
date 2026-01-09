import { useEffect, useState, useCallback, useRef } from 'react';
import { useSharedValue, useFrameCallback, runOnJS } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { CONFIG } from '../constants/Config';
import { useGameStore } from '../store/useGameStore';

export const useGameEngine = () => {
    const { isPlaying, isGameOver, isSoundEnabled, endGame, incrementScore } = useGameStore();

    const birdY = useSharedValue(CONFIG.SCREEN_HEIGHT / 2);
    const birdVelocity = useSharedValue(0);
    const birdRotation = useSharedValue(0);
    const scrollX = useSharedValue(0);

    const [pipesMetadata, setPipesMetadata] = useState<{ id: number; initialScroll: number; height: number; passed: boolean }[]>([]);
    const pipeCounter = useSharedValue(0);

    const jumpSound = useRef<Audio.Sound | null>(null);
    const hitSound = useRef<Audio.Sound | null>(null);
    const scoreSound = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        async function loadSounds() {
            try {
                // Ensure audio mode is set before loading
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false
                });

                // Attempt to load sounds safely
                // If they don't exist, we just catch the error and the game continues silently
                // This is important for Vercel/Web builds if assets aren't perfectly mapped
                try {
                    const { sound: j } = await Audio.Sound.createAsync(require('../assets/jump.mp3'));
                    jumpSound.current = j;
                } catch (e) { }

                try {
                    const { sound: h } = await Audio.Sound.createAsync(require('../assets/hit.mp3'));
                    hitSound.current = h;
                } catch (e) { }

                try {
                    const { sound: s } = await Audio.Sound.createAsync(require('../assets/score.mp3'));
                    scoreSound.current = s;
                } catch (e) { }

            } catch (e) {
                console.log('Audio Engine Setup Error:', e);
            }
        }
        loadSounds();
        return () => {
            jumpSound.current?.unloadAsync();
            hitSound.current?.unloadAsync();
            scoreSound.current?.unloadAsync();
        };
    }, []);

    const playSound = async (type: 'jump' | 'hit' | 'score') => {
        if (!isSoundEnabled) return;
        try {
            if (type === 'jump' && jumpSound.current) await jumpSound.current.replayAsync();
            if (type === 'hit' && hitSound.current) await hitSound.current.replayAsync();
            if (type === 'score' && scoreSound.current) await scoreSound.current.replayAsync();
        } catch (e) { }
    };

    const resetEngine = useCallback(() => {
        birdY.value = CONFIG.SCREEN_HEIGHT / 2;
        birdVelocity.value = 0;
        birdRotation.value = 0;
        scrollX.value = 0;
        setPipesMetadata([]);
        pipeCounter.value = 0;
    }, [birdY, birdVelocity, birdRotation, scrollX, pipeCounter]);

    const jump = useCallback(() => {
        if (!isPlaying || isGameOver) return;
        const baseForce = CONFIG.JUMP_FORCE;
        const currentVelocity = birdVelocity.value;
        const reactiveForce = currentVelocity > 0 ? baseForce * 1.15 : baseForce;
        birdVelocity.value = reactiveForce;
        birdRotation.value = -35;
        runOnJS(playSound)('jump');
    }, [isPlaying, isGameOver, birdVelocity, birdRotation, isSoundEnabled]);

    const frameCallback = useFrameCallback(() => {
        if (!isPlaying || isGameOver) return;
        birdVelocity.value += CONFIG.GRAVITY;
        birdY.value += birdVelocity.value;
        const targetRotation = Math.min(Math.max(birdVelocity.value * 4.5, -35), 90);
        birdRotation.value = birdRotation.value + (targetRotation - birdRotation.value) * 0.12;
        scrollX.value += CONFIG.PIPE_SPEED;

        if (Math.floor(scrollX.value / 300) > pipeCounter.value) {
            pipeCounter.value += 1;
            const height = 100 + Math.random() * (CONFIG.SCREEN_HEIGHT - CONFIG.PIPE_GAP - 250 - 100);
            runOnJS(setPipesMetadata)(prev => [
                ...prev.filter(p => (scrollX.value - p.initialScroll) < CONFIG.SCREEN_WIDTH + 200),
                { id: Date.now(), initialScroll: scrollX.value + CONFIG.SCREEN_WIDTH, height, passed: false }
            ]);
        }

        const birdRect = {
            x: CONFIG.BIRD_X + 10,
            y: birdY.value + 10,
            width: CONFIG.BIRD_SIZE - 20,
            height: CONFIG.BIRD_SIZE - 20,
        };

        if (birdY.value <= 0 || birdY.value + CONFIG.BIRD_SIZE >= CONFIG.SCREEN_HEIGHT - 100) {
            runOnJS(playSound)('hit');
            runOnJS(endGame)();
        }

        pipesMetadata.forEach((p) => {
            const pipeX = p.initialScroll - scrollX.value;
            if (birdRect.x + birdRect.width > pipeX && birdRect.x < pipeX + CONFIG.PIPE_WIDTH) {
                if (birdRect.y < p.height || birdRect.y + birdRect.height > p.height + CONFIG.PIPE_GAP) {
                    runOnJS(playSound)('hit');
                    runOnJS(endGame)();
                }
            }
            if (!p.passed && pipeX + CONFIG.PIPE_WIDTH < birdRect.x) {
                p.passed = true;
                runOnJS(playSound)('score');
                runOnJS(incrementScore)();
            }
        });
    });

    useEffect(() => {
        if (isPlaying && !isGameOver) {
            frameCallback.setActive(true);
        } else {
            frameCallback.setActive(false);
        }
    }, [isPlaying, isGameOver]);

    return {
        birdY,
        birdVelocity,
        birdRotation,
        scrollX,
        pipes: pipesMetadata,
        jump,
        resetEngine,
    };
};
