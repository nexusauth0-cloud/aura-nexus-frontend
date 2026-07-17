import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Sparkles, Circle } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel';
import AnimatedAICore from '../components/ui/AnimatedAICore';
import { useAppStore } from '../store/appStore';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceMode() {
  const { assistantStatus, setAssistantStatus } = useAppStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };

      recog.onend = () => {
        if (isListening) {
          try { recog.start(); } catch {}
        }
      };

      recog.onerror = () => {
        setIsListening(false);
        setAssistantStatus('idle');
      };

      setRecognition(recog);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) {
      setResponse("Voice recognition isn't available in your browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setAssistantStatus('idle');
      if (transcript.trim()) {
        setAssistantStatus('thinking');
        setTimeout(() => {
          setAssistantStatus('speaking');
          const responses = [
            `I heard you say: "${transcript}". That's interesting! How can I help you with that?`,
            `Thanks for sharing. Regarding "${transcript}", I'd love to help you explore this further.`,
            `I understand you're talking about "${transcript}". Let me think about the best way to assist you.`,
          ];
          setResponse(responses[Math.floor(Math.random() * responses.length)]);
          setTimeout(() => {
            setAssistantStatus('idle');
            speakResponse(responses[Math.floor(Math.random() * responses.length)]);
          }, 1500);
        }, 1000);
      }
    } else {
      recognition.start();
      setIsListening(true);
      setAssistantStatus('listening');
      setTranscript('');
      setResponse('');
    }
  }, [recognition, isListening, transcript, setAssistantStatus]);

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.onend = () => setAssistantStatus('idle');
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-2xl md:text-3xl font-bold neon-text">Voice Mode</h1>
        <p className="text-gray-500 text-sm mt-1">Talk to Aura naturally</p>
      </motion.div>

      <GlassPanel className="flex flex-col items-center py-12 px-8" glow>
        <div className="relative">
          <AnimatedAICore size={220} status={assistantStatus} />
          {isListening && (
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-aura-400 to-cyber-glow rounded-full"
                  animate={{ height: [10, 30, 10] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          )}
        </div>

        <div className="mt-8 text-center">
          {assistantStatus === 'listening' && (
            <motion.p
              className="text-aura-400 font-mono text-sm"
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Listening...
            </motion.p>
          )}
          {assistantStatus === 'thinking' && (
            <p className="text-yellow-400 font-mono text-sm">Thinking...</p>
          )}
          {assistantStatus === 'speaking' && (
            <p className="text-green-400 font-mono text-sm flex items-center justify-center gap-2">
              <Volume2 size={14} /> Speaking...
            </p>
          )}
          {assistantStatus === 'idle' && !response && (
            <p className="text-gray-500 text-sm">Tap the mic to start speaking</p>
          )}
        </div>

        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 glass-panel rounded-xl max-w-md w-full"
          >
            <p className="text-xs text-gray-500 mb-1">You said:</p>
            <p className="text-sm text-gray-200">{transcript}</p>
          </motion.div>
        )}

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 glass-panel rounded-xl max-w-md w-full"
          >
            <p className="text-xs text-aura-400 mb-1">Aura responds:</p>
            <p className="text-sm text-gray-200">{response}</p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleListening}
          className={`mt-8 p-6 rounded-full transition-all ${
            isListening
              ? 'bg-red-500/20 text-red-400 border-2 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              : 'bg-gradient-to-r from-aura-600 to-cyber-purple text-white shadow-lg shadow-aura-500/25'
          }`}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </motion.button>

        <p className="mt-4 text-xs text-gray-500">
          {isListening ? 'Tap to stop listening' : 'Tap to start'}
        </p>
      </GlassPanel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          { label: 'Ask questions', desc: 'Get answers naturally' },
          { label: 'Voice commands', desc: 'Control with your voice' },
          { label: 'Hands-free', desc: 'Multitask effortlessly' },
        ].map((feature) => (
          <GlassPanel key={feature.label} className="text-center p-4">
            <Sparkles size={16} className="mx-auto mb-2 text-aura-400" />
            <p className="text-sm font-medium">{feature.label}</p>
            <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
