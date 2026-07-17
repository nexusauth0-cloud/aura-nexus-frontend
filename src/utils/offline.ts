const OFFLINE_STORAGE_KEY = 'aura_offline_data';

interface OfflineData {
  conversations: any[];
  tasks: any[];
  notes: any[];
  memories: any[];
  lastSync: string;
}

export const offlineStorage = {
  save(data: Partial<OfflineData>) {
    try {
      const existing = this.load();
      const merged = { ...existing, ...data, lastSync: new Date().toISOString() };
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(merged));
    } catch {}
  },

  load(): OfflineData {
    try {
      const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
      return data ? JSON.parse(data) : { conversations: [], tasks: [], notes: [], memories: [], lastSync: '' };
    } catch {
      return { conversations: [], tasks: [], notes: [], memories: [], lastSync: '' };
    }
  },

  clear() {
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
  },
};

export const offlineAI = {
  generateResponse(message: string): string {
    const message_lower = message.toLowerCase();

    if (message_lower.includes('hello') || message_lower.includes('hi')) {
      return "Hello! I'm Aura operating in offline mode. I can still help you with basic tasks, notes, and reminders.";
    }

    if (message_lower.includes('task') || message_lower.includes('todo')) {
      return "I've noted your task. You can add it in the Productivity Hub when you're back online, or I can save it locally.";
    }

    if (message_lower.includes('remember') || message_lower.includes('save')) {
      return "I'll remember that locally. It will sync to the cloud when you're back online.";
    }

    if (message_lower.includes('help')) {
      return "I can help you with: managing tasks, taking notes, setting reminders, answering basic questions, and organizing your thoughts. What do you need?";
    }

    if (message_lower.includes('time') || message_lower.includes('date')) {
      return `The current time is ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}.`;
    }

    return "I'm currently in offline mode. I can help with local tasks, notes, and basic commands. For advanced AI features, please connect to the internet.";
  },
};

export const checkOnlineStatus = (): boolean => {
  return navigator.onLine;
};
