import { createClient } from '@supabase/supabase-js';

// Fallback for Vercel/Web builds - ensure these are in your Vercel Project Settings!
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials missing! Check your .env file or Vercel environment variables.');
}

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

export interface ScoreEntry {
    id: string;
    username: string;
    score: number;
    created_at: string;
}

export const getTopScores = async (limit = 10) => {
    try {
        if (!supabase) {
            console.error('Supabase client not initialized');
            return [];
        }
        console.log('Fetching top scores from Supabase...');
        const { data, error } = await supabase
            .from('scores')
            .select('*')
            .order('score', { ascending: false })
            .limit(limit);
        // ...

        if (error) {
            console.error('Supabase fetch error:', error.message, error.details);
            return [];
        }

        console.log(`Successfully fetched ${data?.length || 0} scores.`);
        return data as ScoreEntry[];
    } catch (err) {
        console.error('getTopScores exception:', err);
        return [];
    }
};

export const submitScore = async (username: string, score: number) => {
    try {
        if (!supabase) {
            console.error('Supabase client not initialized');
            return false;
        }
        console.log(`Submitting score for ${username}: ${score}`);
        const { data, error } = await supabase
            .from('scores')
            .insert([{ username, score }])
            .select();

        if (error) {
            console.error('Supabase submit error:', error.message, error.details);
            return false;
        }

        console.log('Score submitted successfully:', data);
        return true;
    } catch (err) {
        console.error('submitScore exception:', err);
        return false;
    }
};

export const deleteScore = async (id: string) => {
    try {
        if (!supabase) {
            console.error('Supabase client not initialized');
            return false;
        }
        console.log(`Attempting to delete score ID: ${id}`);
        const { error } = await supabase
            .from('scores')
            .delete()
            .match({ id });

        if (error) {
            console.error('Supabase delete error:', error.message, error.details);
            return false;
        }

        console.log('Score deleted successfully.');
        return true;
    } catch (err) {
        console.error('deleteScore exception:', err);
        return false;
    }
};

export const getUserRank = async (score: number) => {
    try {
        if (!supabase) {
            console.error('Supabase client not initialized');
            return null;
        }
        const { count, error } = await supabase
            .from('scores')
            .select('*', { count: 'exact', head: true })
            .gt('score', score);

        if (error) {
            console.error('Supabase rank count error:', error.message);
            return null;
        }

        return (count || 0) + 1;
    } catch (err) {
        console.error('getUserRank exception:', err);
        return null;
    }
};
