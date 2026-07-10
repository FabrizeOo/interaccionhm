import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl';

/** Los 3 modos visuales son mutuamente excluyentes */
export type VisualMode = 'normal' | 'high-contrast' | 'high-contrast-strict' | 'colorblind';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  // Modo visual — solo uno activo a la vez
  visualMode: VisualMode;
  setVisualMode: (mode: VisualMode) => void;
  // Helpers derivados para compatibilidad con componentes existentes
  highContrast: boolean;
  strictContrast: boolean;
  colorBlind: boolean;
  // Dislexia — independiente del modo visual
  dyslexia: boolean;
  toggleDyslexia: () => void;
  // Voz
  voiceEnabled: boolean;
  toggleVoice: () => void;
  voiceTranscript: string;
  voiceSupported: boolean;
}

const fontSizeMap: Record<FontSize, string> = {
  sm: '14px',
  md: '16px',
  lg: '20px',
  xl: '24px',
};

const ACC_CLASS_MAP: Record<VisualMode, string> = {
  normal: '',
  'high-contrast': 'high-contrast',
  'high-contrast-strict': 'high-contrast-strict',
  colorblind: 'colorblind-mode',
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({
  children,
  onVoiceCommand,
}: {
  children: ReactNode;
  onVoiceCommand?: (command: string) => void;
}) {
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [visualMode, setVisualModeState] = useState<VisualMode>('normal');
  const [dyslexia, setDyslexia] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSupported] = useState(
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );

  // Apply font-size token
  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSizeMap[fontSize]);
  }, [fontSize]);

  // Apply visual mode class — only one at a time
  useEffect(() => {
    const html = document.documentElement;
    // Remove all visual mode classes first
    Object.values(ACC_CLASS_MAP).filter(Boolean).forEach(cls => html.classList.remove(cls));
    // Apply the active one
    const cls = ACC_CLASS_MAP[visualMode];
    if (cls) html.classList.add(cls);
  }, [visualMode]);

  // Apply dyslexia independently
  useEffect(() => {
    document.documentElement.classList.toggle('dyslexia-mode', dyslexia);
  }, [dyslexia]);

  // Voice recognition
  useEffect(() => {
    if (!voiceEnabled || !voiceSupported) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'es-PE';
    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      const transcript = last[0].transcript.toLowerCase().trim();
      setVoiceTranscript(transcript);
      if (last.isFinal && onVoiceCommand) onVoiceCommand(transcript);
    };
    recognition.onerror = () => setVoiceTranscript('');
    recognition.start();
    return () => recognition.stop();
  }, [voiceEnabled, voiceSupported, onVoiceCommand]);

  const setVisualMode = (mode: VisualMode) => {
    // Toggle: clicking the active mode returns to normal
    setVisualModeState(prev => (prev === mode ? 'normal' : mode));
  };

  const toggleDyslexia = () => setDyslexia(prev => !prev);
  const toggleVoice = () => { setVoiceEnabled(prev => !prev); setVoiceTranscript(''); };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        visualMode,
        setVisualMode,
        // Derived booleans — backwards compat
        highContrast: visualMode === 'high-contrast',
        strictContrast: visualMode === 'high-contrast-strict',
        colorBlind: visualMode === 'colorblind',
        dyslexia,
        toggleDyslexia,
        voiceEnabled,
        toggleVoice,
        voiceTranscript,
        voiceSupported,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
