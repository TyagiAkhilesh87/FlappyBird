import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Trophy, Medal, RefreshCw } from 'lucide-react-native';
import { getTopScores, ScoreEntry } from '../src/utils/supabase';
import { COLORS } from '../src/constants/Config';
import Animated, { FadeInRight, FadeIn } from 'react-native-reanimated';
import { Background } from '../src/components/Background';

export default function Leaderboard() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchScores = async () => {
        setLoading(true);
        const data = await getTopScores(20);
        setScores(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchScores();
    }, []);

    const getMedalColor = (index: number) => {
        switch (index) {
            case 0: return '#FFD700'; // Gold
            case 1: return '#C0C0C0'; // Silver
            case 2: return '#CD7F32'; // Bronze
            default: return 'transparent';
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Background />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color="#FFF" size={32} />
                </TouchableOpacity>
                <Text style={styles.title}>GLOBAL RANKS</Text>
                <TouchableOpacity onPress={fetchScores} style={styles.refreshButton}>
                    <RefreshCw color="#FFF" size={24} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                </View>
            ) : (
                <FlatList
                    data={scores}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Animated.View
                            entering={FadeInRight.delay(index * 50)}
                            style={styles.card}
                        >
                            <View style={styles.rankContainer}>
                                {index < 3 ? (
                                    <Medal color={getMedalColor(index)} size={24} fill={getMedalColor(index)} />
                                ) : (
                                    <Text style={styles.rankText}>#{index + 1}</Text>
                                )}
                            </View>

                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.score}>{item.score}</Text>
                        </Animated.View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Trophy color="rgba(255,255,255,0.2)" size={80} />
                            <Text style={styles.emptyText}>No records yet. Be the first!</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.SKY,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 2,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginBottom: 12,
        padding: 18,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '900',
    },
    username: {
        flex: 1,
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 15,
    },
    score: {
        color: COLORS.PRIMARY,
        fontSize: 22,
        fontWeight: '900',
    },
    emptyText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
    }
});
