import { create } from 'zustand';

interface GameState {
    isPlaying: boolean;
    isGameOver: boolean;
    isSoundEnabled: boolean;
    score: number;
    highScore: number;
    startGame: () => void;
    endGame: () => void;
    resetGame: () => void;
    incrementScore: () => void;
    setHighScore: (score: number) => void;
    toggleSound: () => void;
}

export const useGameStore = create<GameState>((set) => ({
    isPlaying: false,
    isGameOver: false,
    isSoundEnabled: true,
    score: 0,
    highScore: 0,
    startGame: () => set({ isPlaying: true, isGameOver: false, score: 0 }),
    endGame: () => set({ isPlaying: false, isGameOver: true }),
    resetGame: () => set({ isPlaying: false, isGameOver: false, score: 0 }),
    incrementScore: () => set((state) => ({ score: state.score + 1 })),
    setHighScore: (score) => set((state) => ({ highScore: Math.max(state.highScore, score) })),
    toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
}));
