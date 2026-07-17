import { create } from 'zustand';

interface AppState {
  assistantStatus: 'idle' | 'listening' | 'thinking' | 'speaking';
  setAssistantStatus: (status: 'idle' | 'listening' | 'thinking' | 'speaking') => void;
  isVoiceActive: boolean;
  setVoiceActive: (active: boolean) => void;
  isOnline: boolean;
  setOnline: (online: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  assistantStatus: 'idle',
  setAssistantStatus: (status) => set({ assistantStatus: status }),
  isVoiceActive: false,
  setVoiceActive: (active) => set({ isVoiceActive: active }),
  isOnline: navigator.onLine,
  setOnline: (online) => set({ isOnline: online }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  activeView: 'dashboard',
  setActiveView: (view) => set({ activeView: view }),
}));
