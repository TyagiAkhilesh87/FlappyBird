import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Trash2, ChevronLeft, ShieldAlert, Search, SortAsc, SortDesc } from 'lucide-react-native';
import { getTopScores, deleteScore, ScoreEntry } from '../src/utils/supabase';
import { COLORS } from '../src/constants/Config';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AdminPanel() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'score' | 'recent'>('score');
    const router = useRouter();

    const fetchScores = async () => {
        setLoading(true);
        const data = await getTopScores(100);
        setScores(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchScores();
    }, []);

    const filteredAndSortedScores = useMemo(() => {
        let result = [...scores];

        if (searchQuery) {
            result = result.filter(s =>
                s.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === 'recent') {
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else {
            result.sort((a, b) => b.score - a.score);
        }

        return result;
    }, [scores, searchQuery, sortBy]);

    const handleDelete = (id: string, username: string) => {
        Alert.alert(
            "Confirm Delete",
            `Are you sure you want to remove ${username}'s score?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteScore(id);
                        if (success) {
                            setScores(prev => prev.filter(s => s.id !== id));
                        } else {
                            Alert.alert("Error", "Could not delete score.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color={COLORS.WHITE} size={30} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ADMIN PANEL</Text>
                <ShieldAlert color={COLORS.PRIMARY} size={24} />
            </View>

            {/* Controls */}
            <View style={styles.controls}>
                <View style={styles.searchBox}>
                    <Search color="rgba(255,255,255,0.4)" size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setSortBy(prev => prev === 'score' ? 'recent' : 'score')}
                >
                    {sortBy === 'score' ? (
                        <>
                            <SortDesc color={COLORS.PRIMARY} size={20} />
                            <Text style={styles.sortText}>BY SCORE</Text>
                        </>
                    ) : (
                        <>
                            <SortAsc color={COLORS.PRIMARY} size={20} />
                            <Text style={styles.sortText}>BY DATE</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.PRIMARY} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={filteredAndSortedScores}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 30)} style={styles.scoreRow}>
                            <View style={styles.scoreInfo}>
                                <Text style={styles.username}>{item.username}</Text>
                                <View style={styles.scoreMeta}>
                                    <Text style={styles.scoreValue}>{item.score} pts</Text>
                                    <Text style={styles.dateText}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(item.id, item.username)}
                            >
                                <Trash2 color="#ff4444" size={20} />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No scores found.</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Pro Dark Theme
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '900',
        flex: 1,
        letterSpacing: 2,
    },
    controls: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        backgroundColor: '#1a1a1a',
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        borderRadius: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    searchInput: {
        flex: 1,
        height: 45,
        color: '#FFF',
        marginLeft: 8,
        fontSize: 14,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        borderRadius: 10,
        paddingHorizontal: 15,
        gap: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    sortText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    scoreInfo: {
        flex: 1,
    },
    username: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    scoreMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
    },
    scoreValue: {
        color: COLORS.PRIMARY,
        fontSize: 14,
        fontWeight: '600',
    },
    dateText: {
        color: '#666',
        fontSize: 12,
    },
    deleteButton: {
        padding: 10,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 100,
        fontSize: 16,
    }
});
