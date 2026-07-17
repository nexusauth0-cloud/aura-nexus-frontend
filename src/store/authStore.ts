import { create } from 'zustand';
import { auth } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  preferences?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('aura_user') || 'null'),
  token: localStorage.getItem('aura_token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await auth.login({ email, password });
      localStorage.setItem('aura_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Login failed',
        loading: false,
      });
      throw err;
    }
  },

  register: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await auth.register({ username, email, password });
      localStorage.setItem('aura_token', data.token);
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.error || 'Registration failed',
        loading: false,
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
    set({ user: null, token: null });
  },

  loadProfile: async () => {
    try {
      const { data } = await auth.profile();
      localStorage.setItem('aura_user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch {
      // ignore
    }
  },

  clearError: () => set({ error: null }),
}));
