import { create } from 'zustand';
import api from './api';
import { User } from '@/types/User.type';

interface AuthState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<void>;
}

const getInitialUser = (): User | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: getInitialUser(),
    
    setUser: (user) => {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user });
    },
    
    clearUser: () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('user');
        }
        set({ user: null });
    },
    
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const user: User = { Id: response.data.data.id, role: response.data.data.role, name:response.data.data.name };
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            set({ user });
        } catch (e) {
            console.error('Login failed:', e);
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.removeItem('user');
            }
            set({ user: null });
            throw e;
        }
    },
    
    logout: async () => {
        try {
            await api.delete('/auth/logout');
        } catch (e) {
            console.error('Logout failed on server:', e);
        } finally {
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.removeItem('user');
            }
            set({ user: null });
        }
    },
    
    getCurrentUser: async () => {
        if (typeof window === 'undefined') return; // Don't run on the server

        try {
            const response = await api.get('/auth/me');
            const user: User = { Id: response.data.data.id, role: response.data.data.role };
            if (window.localStorage) {
                localStorage.setItem('user', JSON.stringify(user));
            }
            set({ user });
        } catch (e) {
            console.error('Failed to get current user:', e);
            if (window.localStorage) {
                localStorage.removeItem('user');
            }
            set({ user: null });
        }
    },
}));