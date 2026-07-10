import { useState, useRef, useEffect } from 'react';
import {
  Accessibility, X, Type, Eye, Mic, MicOff, Globe,
  ChevronRight, Keyboard, MousePointer, FlaskConical,
  BookOpen, Glasses, Contrast,
} from 'lucide-react';
import { useAccessibility, FontSize, VisualMode } from '../contexts/AccessibilityContext';
import { useLanguage, Language } from '../contexts/LanguageContext';

const fontSizeOptions: { key: FontSize }[] = [
  { key: 'sm' }, { key: 'md' }, { key: 'lg' }, { key: 'xl' },
];
const sizeClass = ['text-xs', 'text-sm', 'text-base', 'text-xl'];

interface AccessibilityToolbarProps {
  onOpenDemo?: (tab?: 'teclado' | 'voz' | 'areas') => void;
}

/* ─────────────────────────────────────────────────────────────────────
   Tema visual del panel por modo de accesibilidad
   Cada propiedad es una cadena de clases Tailwind / valor CSS
───────────────────────────────────────────────────────────────────── */
const PANEL_THEME = {
  normal: {
    /* Botón flotante */
    trigger:      'bg-[#c41e3a] text-white hover:bg-[#a01729]',
    triggerRing:  'focus:ring-offset-[#c41e3a]',
    /* Panel contenedor */
    panel:        'bg-white border border-gray-200 text-gray-800',
    /* Header del panel */
    header:       'bg-[#c41e3a] text-white',
    headerClose:  'text-white/80 hover:text-white',
    /* Divisor */
    divider:      'border-gray-100',
    /* Icono acento */
    accentIcon:   'text-[#c41e3a]',
    /* Botones de modo visual */
    modeActive:   'bg-[#c41e3a] text-white border-[#c41e3a] focus:ring-[#c41e3a]',
    modeInactive: 'border-gray-200 text-gray-700 hover:border-[#c41e3a] hover:text-[#c41e3a] focus:ring-[#c41e3a]',
    /* Pills de idioma / tamaño */
    pillActive:   'bg-[#c41e3a] text-white border-[#c41e3a] focus:ring-[#c41e3a]',
    pillInactive: 'border-gray-200 text-gray-600 hover:border-[#c41e3a] hover:text-[#c41e3a] focus:ring-[#c41e3a]',
    /* Demo nav */
    demoBtn:      'border-gray-200 text-gray-700 hover:border-[#c41e3a] hover:text-[#c41e3a] hover:bg-[#c41e3a]/5 focus:ring-[#c41e3a]',
    /* Caja de estado */
    statusBox:    'bg-gray-50 border-gray-200 text-gray-600',
    /* Hint de teclado */
    hint:         'bg-blue-50 text-blue-700 border-blue-100',
    /* Voz */
    voiceOn:      'bg-green-600 text-white border-green-600 focus:ring-green-600',
    voiceOff:     'border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-600 focus:ring-green-600',
    voiceBox:     'bg-gray-50 border-gray-200 text-gray-600',
    /* Dislexia */
    dyslexiaOn:   'bg-purple-600 text-white border-purple-600 focus:ring-purple-600',
    dyslexiaOff:  'border-gray-200 text-gray-700 hover:border-purple-600 hover:text-purple-700 focus:ring-purple-600',
  },
  'high-contrast': {
    trigger:      'bg-black text-[#FFD600] border-4 border-[#FFD600]',
    triggerRing:  'focus:ring-offset-black',
    panel:        'bg-black border-2 border-white text-white',
    header:       'bg-black text-white border-b-2 border-white',
    headerClose:  'text-white/80 hover:text-white',
    divider:      'border-white/30',
    accentIcon:   'text-[#FFD600]',
    modeActive:   'bg-[#FFD600] text-black border-[#FFD600] focus:ring-[#FFD600]',
    modeInactive: 'border-white text-white hover:border-[#FFD600] hover:bg-white/10 focus:ring-[#FFD600]',
    pillActive:   'bg-[#FFD600] text-black border-[#FFD600] focus:ring-[#FFD600]',
    pillInactive: 'border-white text-white hover:border-[#FFD600] hover:bg-white/10 focus:ring-[#FFD600]',
    demoBtn:      'border-white text-white hover:border-[#FFD600] hover:bg-white/10 focus:ring-[#FFD600]',
    statusBox:    'bg-black border-white/30 text-white/80',
    hint:         'bg-black border-white/20 text-white/70',
    voiceOn:      'bg-[#FFD600] text-black border-[#FFD600] focus:ring-[#FFD600]',
    voiceOff:     'border-white text-white hover:border-[#FFD600] hover:bg-white/10 focus:ring-[#FFD600]',
    voiceBox:     'bg-black border-white/30 text-white',
    dyslexiaOn:   'bg-[#FFD600] text-black border-[#FFD600] focus:ring-[#FFD600]',
    dyslexiaOff:  'border-white text-white hover:border-[#FFD600] hover:bg-white/10 focus:ring-[#FFD600]',
  },
  'high-contrast-strict': {
    trigger:      'bg-black text-[#FFD600] border-4 border-[#FFD600]',
    triggerRing:  'focus:ring-offset-black',
    panel:        'bg-black border-4 border-white text-white',
    header:       'bg-black text-[#FFD600] border-b-4 border-white',
    headerClose:  'text-[#FFD600]/80 hover:text-[#FFD600]',
    divider:      'border-white/40',
    accentIcon:   'text-[#FFD600]',
    modeActive:   'bg-[#FFD600] text-black border-[#FFD600] focus:ring-[#FFD600]',
    modeInactive: 'border-white/60 text-white hover:border-[#FFD600] hover:bg-white/5 focus:ring-[#FFD600]',
    pillActive:   'bg-[#FFD600] text-black border-[#FFD600] focus:ring-[#FFD600]',
    pillInactive: 'border-white/60 text-white hover:border-[#FFD600] focus:ring-[#FFD600]',
    demoBtn:      'border-white/60 text-white hover:border-[#FFD600] hover:bg-white/5 focus:ring-[#FFD600]',
    statusBox:    'bg-black border-[#FFD600]/40 text-[#FFD600]/90',
    hint:         'bg-black border-white/20 text-white/70',
    voiceOn:      'bg-[#FFD600] text-black border-[#FFD600] focus:ring-[#FFD600]',
    voiceOff:     'border-white/60 text-white hover:border-[#FFD600] focus:ring-[#FFD600]',
    voiceBox:     'bg-black border-white/30 text-white',
    dyslexiaOn:   'bg-[#FFD600] text-black border-[#FFD600] focus:ring-[#FFD600]',
    dyslexiaOff:  'border-white/60 text-white hover:border-[#FFD600] focus:ring-[#FFD600]',
  },
  colorblind: {
    trigger:      'bg-[#005FCC] text-white hover:bg-[#004099]',
    triggerRing:  'focus:ring-offset-[#005FCC]',
    panel:        'bg-white border border-gray-200 text-gray-800',
    header:       'bg-[#005FCC] text-white',
    headerClose:  'text-white/80 hover:text-white',
    divider:      'border-gray-100',
    accentIcon:   'text-[#005FCC]',
    modeActive:   'bg-[#005FCC] text-white border-[#005FCC] focus:ring-[#005FCC]',
    modeInactive: 'border-gray-200 text-gray-700 hover:border-[#005FCC] hover:text-[#005FCC] focus:ring-[#005FCC]',
    pillActive:   'bg-[#005FCC] text-white border-[#005FCC] focus:ring-[#005FCC]',
    pillInactive: 'border-gray-200 text-gray-600 hover:border-[#005FCC] hover:text-[#005FCC] focus:ring-[#005FCC]',
    demoBtn:      'border-gray-200 text-gray-700 hover:border-[#005FCC] hover:text-[#005FCC] hover:bg-[#005FCC]/5 focus:ring-[#005FCC]',
    statusBox:    'bg-[#E3F2FD] border-[#005FCC]/30 text-[#005FCC]',
    hint:         'bg-[#E3F2FD] text-[#005FCC] border-[#005FCC]/20',
    voiceOn:      'bg-green-600 text-white border-green-600 focus:ring-green-600',
    voiceOff:     'border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-600 focus:ring-green-600',
    voiceBox:     'bg-[#E3F2FD] border-[#005FCC]/20 text-gray-700',
    dyslexiaOn:   'bg-purple-600 text-white border-purple-600 focus:ring-purple-600',
    dyslexiaOff:  'border-gray-200 text-gray-700 hover:border-purple-600 hover:text-purple-700 focus:ring-purple-600',
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────
   ToggleSwitch — usa CSS Design Tokens para sus colores.
   Soporta contorno (outline) para modo estricto vía token --sw-*-outline-color.
   No aplica ningún filtro CSS.
───────────────────────────────────────────────────────────────────── */
function ToggleSwitch({ active, label }: { active: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
      <span
        aria-hidden="true"
        style={{
          fontSize:     '0.65rem',
          fontWeight:   700,
          letterSpacing:'0.05em',
          color:        active ? '#16a34a' : '#6b7280',
          minWidth:     '1.75rem',
          textAlign:    'right',
          transition:   'color 0.2s',
        }}
      >
        {active ? 'ON' : 'OFF'}
      </span>
      <div
        aria-hidden="true"
        style={{
          backgroundColor: active ? '#16a34a' : '#9ca3af',
          border:          active ? '2px solid white' : '2px solid #6b7280',
          position:        'relative',
          width:           '2.75rem',
          height:          '1.5rem',
          borderRadius:    '9999px',
          flexShrink:      0,
          transition:      'background-color 0.2s, border-color 0.2s',
          boxShadow:       active ? '0 0 0 2px rgba(22,163,74,0.4)' : 'none',
        }}
      >
        <div
          style={{
            position:        'absolute',
            top:             '2px',
            left:            active ? '1.25rem' : '2px',
            width:           '1rem',
            height:          '1rem',
            borderRadius:    '9999px',
            backgroundColor: active ? '#ffffff' : 'transparent',
            border:          active ? '2px solid white' : '2px solid white',
            boxShadow:       '0 1px 3px rgba(0,0,0,0.35)',
            transition:      'left 0.2s, background-color 0.2s, border 0.2s',
          }}
        />
      </div>
      <span className="sr-only">{active ? 'Activado' : 'Desactivado'}: {label}</span>
    </div>
  );
}

/* Configuración de los 3 modos visuales */
const VISUAL_MODES: {
  id: VisualMode;
  icon: React.ReactNode;
  label_es: string;
  label_qu: string;
  desc_es: string;
  desc_qu: string;
}[] = [
  {
    id: 'high-contrast',
    icon: <Eye size={16} aria-hidden="true" />,
    label_es: 'Alto Contraste',
    label_qu: 'Hatun Contraste',
    desc_es:  'Alto contraste — fondo negro, texto blanco',
    desc_qu:  'Hatun contraste — yana, yuraq',
  },
  {
    id: 'high-contrast-strict',
    icon: <Contrast size={16} aria-hidden="true" />,
    label_es: 'Alto Contraste Estricto',
    label_qu: 'Hatun Contraste Estricto',
    desc_es:  'Alto contraste estricto — ratio 19.56:1',
    desc_qu:  'Hatun contraste estricto — ratio 19.56:1',
  },
  {
    id: 'colorblind',
    icon: <Glasses size={16} aria-hidden="true" />,
    label_es: 'Modo Daltonismo',
    label_qu: 'Daltonismo Kamay',
    desc_es:  'Modo daltonismo — paleta distinguible para deuteranopia',
    desc_qu:  'Daltonismo — seguros deuteranopia',
  },
];

export function AccessibilityToolbar({ onOpenDemo }: AccessibilityToolbarProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef   = useRef<HTMLButtonElement>(null);

  const {
    fontSize, setFontSize,
    visualMode, setVisualMode,
    highContrast, strictContrast, colorBlind,
    dyslexia, toggleDyslexia,
    voiceEnabled, toggleVoice, voiceTranscript, voiceSupported,
  } = useAccessibility();
  const { language, setLanguage, t } = useLanguage();

  const th = PANEL_THEME[visualMode];

  /* Cerrar al hacer clic fuera */
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  /* Cerrar con Escape */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) { setOpen(false); btnRef.current?.focus(); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open]);

  const handleOpenDemo = (tab: 'teclado' | 'voz' | 'areas') => {
    setOpen(false);
    onOpenDemo?.(tab);
  };

  const activeModeCfg = VISUAL_MODES.find(m => m.id === visualMode);
  const divider = <hr className={`${th.divider}`} aria-hidden="true" />;

  return (
    <>
      {/* ── Botón flotante ──────────────────────────────────────────── */}
      <button
        ref={btnRef}
        onClick={() => setOpen(p => !p)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? t('acc_close') : t('acc_open')}
        className={[
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl',
          'flex items-center justify-center transition-all',
          'focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2',
          th.trigger, th.triggerRing,
        ].join(' ')}
      >
        {open ? <X size={24} aria-hidden="true" /> : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            {/* Cabeza */}
            <circle cx="12" cy="3.8" r="2.8" />
            {/* Brazos extendidos */}
            <rect x="2" y="7.2" width="20" height="3.5" rx="1.75" />
            {/* Torso */}
            <rect x="10" y="10" width="4" height="6.5" rx="2" />
            {/* Piernas */}
            <path d="M10 16.5 L6 23 Q5.2 24.2 6.5 24.5 Q7.8 24.8 8.5 23.5 L12 18 L15.5 23.5 Q16.2 24.8 17.5 24.5 Q18.8 24.2 18 23 L14 16.5 Z" />
          </svg>
        )}
        {voiceEnabled && !open && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"
            aria-hidden="true"
          />
        )}
      </button>

      {/* ── Panel de accesibilidad ───────────────────────────────────── */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('acc_panel_title')}
          className={`fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden ${th.panel}`}
        >
          {/* Header */}
          <div className={`px-5 py-4 flex items-center justify-between ${th.header}`}>
            <div className="flex items-center gap-2">
              <Accessibility size={20} aria-hidden="true" />
              <span className="font-bold text-base">{t('acc_panel_title')}</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t('acc_close')}
              className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-white ${th.headerClose}`}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">

            {/* ── Idioma ── */}
            <section aria-labelledby="lang-heading">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} aria-hidden="true" className={th.accentIcon} />
                <h2 id="lang-heading" className="text-sm font-bold uppercase tracking-wide">{t('acc_language')}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-labelledby="lang-heading">
                {(['es', 'qu'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    role="radio"
                    aria-checked={language === lang}
                    onClick={() => setLanguage(lang)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      language === lang ? th.pillActive : th.pillInactive
                    }`}
                  >
                    {lang === 'es' ? '🇵🇪 Español' : '🌄 Quechua'}
                  </button>
                ))}
              </div>
            </section>

            {divider}

            {/* ── Tamaño de texto ── */}
            <section aria-labelledby="fontsize-heading">
              <div className="flex items-center gap-2 mb-3">
                <Type size={16} aria-hidden="true" className={th.accentIcon} />
                <h2 id="fontsize-heading" className="text-sm font-bold uppercase tracking-wide">{t('acc_text_size')}</h2>
              </div>
              <div className="flex items-end gap-2" role="radiogroup" aria-labelledby="fontsize-heading">
                {fontSizeOptions.map((opt, i) => (
                  <button
                    key={opt.key}
                    role="radio"
                    aria-checked={fontSize === opt.key}
                    aria-label={`${t('acc_text_size')} ${[t('acc_small'), t('acc_medium'), t('acc_large'), t('acc_xlarge')][i]}`}
                    onClick={() => setFontSize(opt.key)}
                    style={{ paddingTop: `${6 + i * 2}px`, paddingBottom: `${6 + i * 2}px` }}
                    className={`flex-1 flex items-center justify-center rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${sizeClass[i]} font-bold ${
                      fontSize === opt.key ? th.pillActive : th.pillInactive
                    }`}
                  >
                    A
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-1 px-1" aria-hidden="true">
                {[t('acc_small'), t('acc_medium'), t('acc_large'), t('acc_xlarge')].map((label, i) => (
                  <span key={i} className="text-xs opacity-60" style={{ width: '25%', textAlign: 'center' }}>
                    {label}
                  </span>
                ))}
              </div>
            </section>

            {divider}

            {/* ── Modos Visuales (radio-group mutuamente excluyente) ── */}
            <section aria-labelledby="visual-heading">
              <div className="flex items-center gap-2 mb-3">
                <Eye size={16} aria-hidden="true" className={th.accentIcon} />
                <h2 id="visual-heading" className="text-sm font-bold uppercase tracking-wide">
                  {language === 'qu' ? 'Qhawana Kamaynikuna' : 'Modos Visuales'}
                </h2>
              </div>

              {/* Tooltip de modo activo */}
              {activeModeCfg && (
                <p
                  className={`text-xs mb-3 px-3 py-2 rounded-lg border ${th.statusBox}`}
                  role="status"
                  aria-live="polite"
                >
                  {language === 'qu' ? activeModeCfg.desc_qu : activeModeCfg.desc_es}
                </p>
              )}

              <div role="radiogroup" aria-labelledby="visual-heading" className="space-y-2">
                {VISUAL_MODES.map(mode => {
                  const isActive = visualMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => setVisualMode(mode.id)}
                      aria-label={isActive
                        ? `Desactivar ${mode.label_es}`
                        : `Activar ${mode.label_es}`}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 text-sm font-bold ${
                        isActive ? th.modeActive : th.modeInactive
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {mode.icon}
                        {language === 'qu' ? mode.label_qu : mode.label_es}
                      </div>
                      <ToggleSwitch active={isActive} label={mode.label_es} />
                    </button>
                  );
                })}
              </div>
            </section>

            {divider}

            {/* ── Dislexia (independiente del modo visual) ── */}
            <section aria-labelledby="dyslexia-heading">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} aria-hidden="true" className={th.accentIcon} />
                <h2 id="dyslexia-heading" className="text-sm font-bold uppercase tracking-wide">
                  {language === 'qu' ? 'Dislexia Kamay' : 'Modo Dislexia'}
                </h2>
              </div>
              <button
                onClick={toggleDyslexia}
                aria-pressed={dyslexia}
                aria-label={dyslexia
                  ? 'Desactivar modo dislexia'
                  : 'Activar modo dislexia: fuente Lexend con espaciado optimizado'}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  dyslexia ? th.dyslexiaOn : th.dyslexiaOff
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={16} aria-hidden="true" />
                  {language === 'qu' ? 'Dislexia (Lexend)' : 'Fuente Dislexia (Lexend)'}
                </div>
                <ToggleSwitch active={dyslexia} label="Modo Dislexia" />
              </button>
              {dyslexia && (
                <p className="text-xs mt-2 opacity-60 px-1">
                  {language === 'qu'
                    ? 'Lexend · espaciado hatun · interlineado 1.9'
                    : 'Fuente Lexend · Espaciado ampliado · Interlineado 1.9'}
                </p>
              )}
            </section>

            {divider}

            {/* ── Comandos de voz ── */}
            <section aria-labelledby="voice-heading">
              <div className="flex items-center gap-2 mb-3">
                <Mic size={16} aria-hidden="true" className={th.accentIcon} />
                <h2 id="voice-heading" className="text-sm font-bold uppercase tracking-wide">{t('acc_voice')}</h2>
              </div>
              {!voiceSupported ? (
                <p className={`text-xs rounded-lg p-2 border ${th.statusBox}`} role="alert">
                  {t('acc_voice_not_supported')}
                </p>
              ) : (
                <>
                  <button
                    onClick={toggleVoice}
                    aria-pressed={voiceEnabled}
                    aria-label={voiceEnabled ? t('acc_voice_off') : t('acc_voice_on')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      voiceEnabled ? th.voiceOn : th.voiceOff
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {voiceEnabled ? <Mic size={16} aria-hidden="true" /> : <MicOff size={16} aria-hidden="true" />}
                      {voiceEnabled ? t('acc_voice_listening') : t('acc_voice_on')}
                    </div>
                    {voiceEnabled && (
                      <div className="flex gap-0.5" aria-hidden="true">
                        {[1, 2, 3].map(i => (
                          <div key={i}
                            className="w-1 rounded-full animate-pulse bg-current"
                            style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                  {voiceEnabled && (
                    <div className={`mt-2 rounded-lg p-3 text-xs border ${th.voiceBox}`} aria-live="polite">
                      <p className="mb-1">{t('acc_voice_say')}</p>
                      {voiceTranscript && (
                        <p className="font-bold">{t('acc_voice_heard')} "{voiceTranscript}"</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>

            {divider}

            {/* ── Demostración técnica ── */}
            <section aria-labelledby="demo-heading">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical size={16} aria-hidden="true" className={th.accentIcon} />
                <h2 id="demo-heading" className="text-sm font-bold uppercase tracking-wide">
                  {language === 'qu' ? 'Técnica Qhawarina' : 'Demostración Técnica'}
                </h2>
              </div>
              <nav
                aria-label={language === 'qu' ? 'Técnica qhawariy rimaykuna' : 'Demostraciones técnicas de accesibilidad'}
                className="space-y-2"
              >
                {([
                  { tab: 'teclado' as const, icon: <Keyboard size={15} aria-hidden="true" />, label_es: 'Navegación por Teclado', label_qu: 'Kichwa Qillqanawan Puriy' },
                  { tab: 'voz' as const,     icon: <Mic size={15} aria-hidden="true" />,      label_es: 'Comandos de Voz',         label_qu: 'Simiwan Kamay' },
                  { tab: 'areas' as const,   icon: <MousePointer size={15} aria-hidden="true" />, label_es: 'Áreas de Clic (Hit Targets)', label_qu: "Llamk'ay Suyukuna" },
                ]).map(({ tab, icon, label_es, label_qu }) => (
                  <button
                    key={tab}
                    onClick={() => handleOpenDemo(tab)}
                    aria-label={`Abrir demostración: ${language === 'qu' ? label_qu : label_es}`}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-1 ${th.demoBtn}`}
                  >
                    <div className="flex items-center gap-2">
                      {icon}
                      {language === 'qu' ? label_qu : label_es}
                    </div>
                    <ChevronRight size={14} aria-hidden="true" />
                  </button>
                ))}
              </nav>
            </section>

            {/* Hint de teclado */}
            <div
              className={`text-xs rounded-lg p-3 flex items-start gap-2 border ${th.hint}`}
              role="note"
            >
              <ChevronRight size={14} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p>
                {language === 'es'
                  ? 'Navega con Tab, Enter y teclas de dirección. Presiona Escape para cerrar.'
                  : "Tab, Enter, Suytu qillqakunawan puriy. Escape nispa wichq'aykunata wichq'ay."}
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
