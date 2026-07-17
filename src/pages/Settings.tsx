import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Volume2, Globe, Save } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import { useAuthStore } from '../store/authStore';
import { auth } from '../services/api';

export default function Settings() {
  const { user, loadProfile } = useAuthStore();
  const [preferences, setPreferences] = useState(user?.preferences || {});
  const [saving, setSaving] = useState(false);

  const updatePref = (key: string, value: any) => {
    setPreferences((prev: any) => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await auth.updateProfile({ preferences });
      await loadProfile();
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Customize your Aura experience</p>
      </div>

      <GlassPanel>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aura-500 to-cyber-purple flex items-center justify-center text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.username}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel>
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <User size={16} className="text-aura-400" /> Profile
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Display Name</label>
            <input
              value={preferences.name || ''}
              onChange={(e) => updatePref('name', e.target.value)}
              placeholder="What should Aura call you?"
              className="input-cyber"
            />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel>
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Volume2 size={16} className="text-aura-400" /> Voice & Audio
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Voice Responses</span>
            <button
              onClick={() => updatePref('voice_enabled', !preferences.voice_enabled)}
              className={`w-12 h-6 rounded-full transition-all ${preferences.voice_enabled ? 'bg-aura-500' : 'bg-gray-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-all ${preferences.voice_enabled ? 'ml-6' : 'ml-0.5'} mt-0.5`} />
            </button>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Language</label>
            <select
              value={preferences.language || 'en'}
              onChange={(e) => updatePref('language', e.target.value)}
              className="input-cyber"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel>
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Palette size={16} className="text-aura-400" /> Appearance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Theme</span>
            <span className="text-sm text-gray-500">Dark Mode (default)</span>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">AI Personality</label>
            <select
              value={preferences.personality || 'helpful'}
              onChange={(e) => updatePref('personality', e.target.value)}
              className="input-cyber"
            >
              <option value="helpful">Helpful & Friendly</option>
              <option value="professional">Professional & Formal</option>
              <option value="creative">Creative & Imaginative</option>
              <option value="witty">Witty & Humorous</option>
            </select>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel>
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <Globe size={16} className="text-aura-400" /> Data & Privacy
        </h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-center justify-between">
            <span>Store conversation history</span>
            <span className="text-green-400">Enabled</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Personalize responses using memories</span>
            <span className="text-green-400">Enabled</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">Your data is encrypted and stored securely. You can delete any memory or conversation at any time.</p>
        </div>
      </GlassPanel>

      <div className="flex justify-end">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={savePreferences}
          disabled={saving}
          className="cyber-button flex items-center gap-2"
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>
    </div>
  );
}
