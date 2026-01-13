import React, { useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence, FadeOut, runOnJS } from 'react-native-reanimated';
import { COLORS } from '../constants/Config';

interface ParticleProps {
    x: number;
    y: number;
    onDone: (id: string) => void;
    id: string;
}

const Particle: React.FC<ParticleProps> = ({ x, y, onDone, id }) => {
    const opacity = useSharedValue(0.8);
    const scale = useSharedValue(Math.random() * 0.5 + 0.5);
    const translateY = useSharedValue(0);
    const translateX = useSharedValue((Math.random() - 0.5) * 50);

    useEffect(() => {
        translateY.value = withTiming(-100 - Math.random() * 100, { duration: 800 });
        opacity.value = withTiming(0, { duration: 800 }, () => {
            runOnJS(onDone)(id);
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateX: x + translateX.value },
            { translateY: y + translateY.value },
            { scale: scale.value },
        ],
    }));

    return <Animated.View style={[styles.particle, animatedStyle]} />;
};

export interface ParticleSystemRef {
    emit: (x: number, y: number) => void;
}

export const ParticleSystem = forwardRef<ParticleSystemRef>((props, ref) => {
    const [particles, setParticles] = useState<{ id: string; x: number; y: number }[]>([]);

    useImperativeHandle(ref, () => ({
        emit: (x: number, y: number) => {
            const id = Math.random().toString(36).substr(2, 9);
            setParticles(prev => [...prev, { id, x, y }]);
        },
    }));

    const removeParticle = (id: string) => {
        setParticles(prev => prev.filter(p => p.id !== id));
    };

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles.map(p => (
                <Particle key={p.id} id={p.id} x={p.x} y={p.y} onDone={removeParticle} />
            ))}
        </View>
    );
});

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
        width: 10,
        height: 10,
        backgroundColor: '#FFF',
        borderRadius: 5,
        zIndex: 45,
    },
});
