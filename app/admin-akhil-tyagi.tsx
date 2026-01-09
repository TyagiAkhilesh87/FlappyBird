import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Trash2, ChevronLeft, ShieldAlert } from 'lucide-react-native';
import { getTopScores, deleteScore, ScoreEntry } from '../src/utils/supabase';
import { COLORS } from '../src/constants/Config';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AdminPanel() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);
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

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.PRIMARY} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={scores}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 30)} style={styles.scoreRow}>
                            <View style={styles.scoreInfo}>
                                <Text style={styles.username}>{item.username}</Text>
                                <Text style={styles.scoreValue}>{item.score} pts</Text>
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
    listContent: {
        padding: 20,
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
    scoreValue: {
        color: COLORS.PRIMARY,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
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
