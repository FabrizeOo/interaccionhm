import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Keyboard, Mic, MousePointer, ChevronRight, ChevronLeft,
  Play, Pause, SkipForward, AlertTriangle, CheckCircle2,
  Volume2, Navigation, Info, Layers,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAccessibility } from '../contexts/AccessibilityContext';

type DemoTab = 'teclado' | 'voz' | 'areas';

interface HitTarget {
  tag: string;
  role: string;
  label: string;
  width: number;
  height: number;
  compliant: boolean; // ≥ 44×44px WCAG 2.5.5
  type: 'button' | 'link' | 'input' | 'other';
  top: number;
  left: number;
}

interface FocusableEl {
  el: Element;
  index: number;
  tag: string;
  label: string;
  role: string;
  rect: DOMRect;
}

// Voice commands mapped to their navigation action
const voiceCommands = [
  { es: 'inicio', qu: 'qallariy', icon: '🏠', action: 'home', desc_es: 'Ir a Inicio', desc_qu: 'Qallariman riy' },
  { es: 'candidatos', qu: 'akllakuqkuna', icon: '👥', action: 'presidentes', desc_es: 'Ver Candidatos', desc_qu: 'Akllakuqkunata qhaway' },
  { es: 'comparar', qu: 'kikinchay', icon: '⚖️', action: 'comparar', desc_es: 'Comparar Candidatos', desc_qu: 'Akllakuqkunata kikinchay' },
  { es: 'cronograma', qu: 'pacha hapiy', icon: '📅', action: 'cronograma', desc_es: 'Ver Cronograma', desc_qu: 'Pacha Hapiyta qhaway' },
  { es: 'presidente', qu: 'hatun kamachiq', icon: '👤', action: 'presidentes', desc_es: 'Ver Presidentes', desc_qu: 'Hatun Kamachiqkunata qhaway' },
  { es: 'diputados', qu: 'llaqta kamachiq', icon: '🏛️', action: 'diputados', desc_es: 'Ver Diputados', desc_qu: 'Llaqta Kamachiqkunata qhaway' },
  { es: 'senadores', qu: 'hatun rimaq', icon: '🎙️', action: 'senadores', desc_es: 'Ver Senadores', desc_qu: 'Hatun Rimaqkunata qhaway' },
  { es: 'principal', qu: 'qallariy', icon: '⭐', action: 'home', desc_es: 'Página Principal', desc_qu: 'Ñawpaq p\'anqa' },
];

const keyboardShortcuts = [
  { key: 'Tab', desc_es: 'Avanzar al siguiente elemento interactivo', desc_qu: 'Qatiq ruway munayman riy' },
  { key: 'Shift + Tab', desc_es: 'Retroceder al elemento anterior', desc_qu: 'Ñawpaq ruway munayman kutiy' },
  { key: 'Enter', desc_es: 'Activar botón o enlace enfocado', desc_qu: 'Enfocasqa waturita o enlaceta ruway' },
  { key: 'Space', desc_es: 'Activar botón enfocado', desc_qu: 'Enfocasqa waturita ruway' },
  { key: '← → ↑ ↓', desc_es: 'Navegar en grupos (radio, tab panels)', desc_qu: 'Grupopi puriy' },
  { key: 'Escape', desc_es: 'Cerrar diálogos y menús abiertos', desc_qu: 'Kicharisqa menúta wichq\'ay' },
  { key: 'Alt + F4', desc_es: 'Cerrar ventana actual', desc_qu: 'Kicharisqa ventanata wichq\'ay' },
];

function getElementLabel(el: Element): string {
  return (
    el.getAttribute('aria-label') ||
    el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby')!)?.textContent ||
    el.getAttribute('title') ||
    (el as HTMLElement).innerText?.trim().slice(0, 40) ||
    el.getAttribute('placeholder') ||
    el.getAttribute('name') ||
    el.tagName.toLowerCase()
  ) || el.tagName.toLowerCase();
}

function getElementType(el: Element): HitTarget['type'] {
  const tag = el.tagName.toLowerCase();
  if (tag === 'button' || el.getAttribute('role') === 'button') return 'button';
  if (tag === 'a') return 'link';
  if (tag === 'input' || tag === 'select' || tag === 'textarea') return 'input';
  return 'other';
}

interface AccessibilityDemoPanelProps {
  onNavigate: (page: string) => void;
  onClose: () => void;
  initialTab?: DemoTab;
}

export function AccessibilityDemoPanel({ onNavigate, onClose, initialTab = 'teclado' }: AccessibilityDemoPanelProps) {
  const [tab, setTab] = useState<DemoTab>(initialTab);
  const { language } = useLanguage();
  const { colorBlind } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);

  // ─── HIT TARGETS state ───────────────────────────────────────────────────────
  const [hitTargets, setHitTargets] = useState<HitTarget[]>([]);
  const [showHitOverlay, setShowHitOverlay] = useState(false);
  const [hitScanned, setHitScanned] = useState(false);

  // ─── KEYBOARD NAV state ──────────────────────────────────────────────────────
  const [focusables, setFocusables] = useState<FocusableEl[]>([]);
  const [tourActive, setTourActive] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const tourTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── VOICE SIM state ─────────────────────────────────────────────────────────
  const [voiceSim, setVoiceSim] = useState<string | null>(null);
  const [voiceAnimating, setVoiceAnimating] = useState(false);
  const [voiceResult, setVoiceResult] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  // ─── HIT TARGETS SCAN ────────────────────────────────────────────────────────
  const scanHitTargets = useCallback(() => {
    const selectors = 'button:not([disabled]):not([aria-hidden="true"]), a[href], input:not([disabled]), select:not([disabled]), [role="button"]:not([disabled])';
    const elements = Array.from(document.querySelectorAll(selectors));
    const targets: HitTarget[] = elements
      .filter(el => !panelRef.current?.contains(el))
      .map(el => {
        const rect = el.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        return {
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute('role') || el.tagName.toLowerCase(),
          label: getElementLabel(el),
          width: w,
          height: h,
          compliant: w >= 44 && h >= 44,
          type: getElementType(el),
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        };
      });
    setHitTargets(targets);
    setHitScanned(true);
  }, []);

  // ─── KEYBOARD TOUR ───────────────────────────────────────────────────────────
  const collectFocusables = useCallback(() => {
    const sel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const elements = Array.from(document.querySelectorAll(sel))
      .filter(el => !panelRef.current?.contains(el) && el.getAttribute('aria-hidden') !== 'true');
    const list: FocusableEl[] = elements.map((el, i) => ({
      el,
      index: i + 1,
      tag: el.tagName.toLowerCase(),
      label: getElementLabel(el),
      role: el.getAttribute('role') || el.getAttribute('aria-label') || el.tagName.toLowerCase(),
      rect: el.getBoundingClientRect(),
    }));
    setFocusables(list);
    return list;
  }, []);

  const startTour = useCallback(() => {
    const list = collectFocusables();
    if (!list.length) return;
    setTourActive(true);
    setTourIndex(0);
    setTourPlaying(false);
    // Focus the first element
    try { (list[0].el as HTMLElement).focus({ preventScroll: false }); } catch (_) {}
  }, [collectFocusables]);

  const stopTour = useCallback(() => {
    setTourActive(false);
    setTourPlaying(false);
    if (tourTimer.current) clearTimeout(tourTimer.current);
  }, []);

  const stepTour = useCallback((dir: 1 | -1) => {
    setTourIndex(prev => {
      const next = Math.max(0, Math.min(focusables.length - 1, prev + dir));
      try { (focusables[next].el as HTMLElement).focus({ preventScroll: false }); } catch (_) {}
      return next;
    });
  }, [focusables]);

  useEffect(() => {
    if (!tourPlaying || !tourActive) return;
    tourTimer.current = setTimeout(() => {
      setTourIndex(prev => {
        const next = prev + 1;
        if (next >= focusables.length) {
          setTourPlaying(false);
          return prev;
        }
        try { (focusables[next].el as HTMLElement).focus({ preventScroll: false }); } catch (_) {}
        return next;
      });
    }, 1200);
    return () => { if (tourTimer.current) clearTimeout(tourTimer.current); };
  }, [tourPlaying, tourActive, tourIndex, focusables]);

  // ─── VOICE SIMULATION ────────────────────────────────────────────────────────
  const simulateVoice = useCallback((cmd: typeof voiceCommands[0]) => {
    if (voiceAnimating) return;
    setVoiceSim(language === 'qu' ? cmd.qu : cmd.es);
    setVoiceAnimating(true);
    setVoiceResult(null);
    setTimeout(() => {
      setVoiceResult(language === 'qu' ? cmd.desc_qu : cmd.desc_es);
      setVoiceAnimating(false);
      setTimeout(() => {
        onNavigate(cmd.action);
        onClose();
      }, 900);
    }, 1500);
  }, [voiceAnimating, language, onNavigate, onClose]);

  // Compliance summary
  const compliantCount = hitTargets.filter(t => t.compliant).length;
  const nonCompliantCount = hitTargets.length - compliantCount;
  const complianceRate = hitTargets.length ? Math.round((compliantCount / hitTargets.length) * 100) : 0;

  const typeColor: Record<string, string> = {
    button: 'bg-blue-500',
    link: 'bg-green-500',
    input: 'bg-purple-500',
    other: 'bg-gray-500',
  };

  const tabs: { id: DemoTab; label_es: string; label_qu: string; icon: React.ReactNode }[] = [
    { id: 'teclado', label_es: 'Teclado', label_qu: 'Kichwa Qillqana', icon: <Keyboard size={16} /> },
    { id: 'voz', label_es: 'Comandos de Voz', label_qu: 'Simiwan Kamay', icon: <Mic size={16} /> },
    { id: 'areas', label_es: 'Áreas de Clic', label_qu: 'Llamk\'ay Suyukuna', icon: <MousePointer size={16} /> },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={language === 'qu' ? 'Tukuypaq Qhawarina' : 'Panel de Accesibilidad — Demostración Técnica'}
        className="fixed inset-4 md:inset-8 z-[70] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#c41e3a] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Layers size={22} aria-hidden="true" />
            <div>
              <h2 className="font-bold text-lg leading-tight">
                {language === 'qu' ? 'Tukuypaq Ruway — Técnica Qhawarina' : 'Demostración Técnica de Accesibilidad'}
              </h2>
              <p className="text-white/80 text-xs">
                {language === 'qu' ? 'WCAG 2.1 AA — Heurísticas Nielsen' : 'WCAG 2.1 AA · Heurísticas de Nielsen · Diseño Universal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={language === 'qu' ? 'Wichq\'ay' : 'Cerrar'}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200 flex-shrink-0 bg-gray-50">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-selected={tab === t.id}
              role="tab"
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#c41e3a] ${
                tab === t.id
                  ? 'border-b-2 border-[#c41e3a] text-[#c41e3a] bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span aria-hidden="true">{t.icon}</span>
              <span className="hidden sm:inline">{language === 'qu' ? t.label_qu : t.label_es}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">

          {/* ═══════════════════════════════════════════════════════════════
              TAB: KEYBOARD NAVIGATION
          ═══════════════════════════════════════════════════════════════ */}
          {tab === 'teclado' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <Keyboard size={20} className="text-[#c41e3a]" aria-hidden="true" />
                  {language === 'qu' ? 'Kichwa Qillqanawan Puriy' : 'Simulación de Navegación por Teclado'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {language === 'qu'
                    ? 'Tukuy ruway munaykuna Tab nispa astawan qatiqkunawan kicharisqa kanku.'
                    : 'Todos los elementos interactivos son accesibles sin ratón, usando solo el teclado.'}
                </p>
              </div>

              {/* Tour Controls */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${tourActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} aria-hidden="true" />
                    <span className="font-bold text-gray-700">
                      {tourActive
                        ? (language === 'qu' ? `${tourIndex + 1} / ${focusables.length} ruway munaykuna` : `Elemento ${tourIndex + 1} de ${focusables.length}`)
                        : (language === 'qu' ? 'Tour mana qallarisqachu' : 'Tour no iniciado')}
                    </span>
                  </div>
                  {!tourActive ? (
                    <button
                      onClick={startTour}
                      className="flex items-center gap-2 bg-[#c41e3a] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#a01729] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:ring-offset-2"
                    >
                      <Play size={16} aria-hidden="true" />
                      {language === 'qu' ? 'Tourayta Qallariy' : 'Iniciar Tour'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => stepTour(-1)}
                        disabled={tourIndex === 0}
                        aria-label={language === 'qu' ? 'Ñawpaq' : 'Anterior'}
                        className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <ChevronLeft size={18} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setTourPlaying(p => !p)}
                        aria-label={tourPlaying ? (language === 'qu' ? 'Samarikuy' : 'Pausar') : (language === 'qu' ? 'Ruway' : 'Reproducir')}
                        className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {tourPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                      </button>
                      <button
                        onClick={() => stepTour(1)}
                        disabled={tourIndex >= focusables.length - 1}
                        aria-label={language === 'qu' ? 'Qatiq' : 'Siguiente'}
                        className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                      <button
                        onClick={stopTour}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {language === 'qu' ? 'Tukuchiy' : 'Detener'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Current element info */}
                {tourActive && focusables[tourIndex] && (
                  <div className="bg-white rounded-xl border border-blue-200 p-4 animate-in fade-in duration-200">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                        #{tourIndex + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">
                          {focusables[tourIndex].label || focusables[tourIndex].tag}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                            &lt;{focusables[tourIndex].tag}&gt;
                          </span>
                          {focusables[tourIndex].role && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              role: {focusables[tourIndex].role}
                            </span>
                          )}
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            {Math.round(focusables[tourIndex].rect.width)}×{Math.round(focusables[tourIndex].rect.height)}px
                          </span>
                        </div>
                      </div>
                      <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                        FOCO
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                {tourActive && (
                  <div className="mt-3">
                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${((tourIndex + 1) / focusables.length) * 100}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs text-blue-600 mt-1 text-right">
                      {Math.round(((tourIndex + 1) / focusables.length) * 100)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Keyboard shortcuts reference */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Info size={16} aria-hidden="true" className="text-[#c41e3a]" />
                  {language === 'qu' ? 'Kichwa Qillqana Kamaynikuna' : 'Referencia de Atajos de Teclado'}
                </h4>
                <div className="space-y-2">
                  {keyboardShortcuts.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100">
                      <kbd className="flex-shrink-0 bg-gray-800 text-white text-xs font-mono px-2 py-1 rounded shadow-sm whitespace-nowrap">
                        {s.key}
                      </kbd>
                      <span className="text-sm text-gray-700">
                        {language === 'qu' ? s.desc_qu : s.desc_es}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Focus visible indicator demo */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">
                    {language === 'qu' ? 'Foco Qhawarina (Demo)' : 'Indicador de Foco Visible (Demo)'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2 focus:ring-offset-blue-50">
                      {language === 'qu' ? 'Tab nispa waturita' : 'Presiona Tab aquí'}
                    </button>
                    <button className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2">
                      {language === 'qu' ? 'Qatiq' : 'Siguiente →'}
                    </button>
                    <a href="#" onClick={e => e.preventDefault()} className="px-4 py-2 text-blue-600 underline rounded-lg text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2">
                      {language === 'qu' ? 'Enlace' : 'Enlace demo'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: VOICE COMMANDS
          ═══════════════════════════════════════════════════════════════ */}
          {tab === 'voz' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <Mic size={20} className="text-[#c41e3a]" aria-hidden="true" />
                  {language === 'qu' ? 'Simiwan Kamay Simulación' : 'Simulación de Comandos de Voz'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {language === 'qu'
                    ? 'Kay waturikuna nispayki página munaynikisman purirqonki. Simulayta qhawachikuypaq waturita hapiy.'
                    : 'Haz clic en cualquier comando para simular el reconocimiento de voz y la navegación resultante.'}
                </p>
              </div>

              {/* Microphone animation */}
              <div className="flex items-center justify-center mb-6">
                <div className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-500 ${
                  voiceAnimating
                    ? 'bg-[#c41e3a] shadow-[0_0_0_12px_rgba(196,30,58,0.15),0_0_0_24px_rgba(196,30,58,0.08)]'
                    : voiceResult
                    ? 'bg-green-600 shadow-lg'
                    : 'bg-gray-200'
                }`}>
                  {voiceAnimating ? (
                    <Volume2 size={36} className="text-white animate-pulse" />
                  ) : voiceResult ? (
                    <CheckCircle2 size={36} className="text-white" />
                  ) : (
                    <Mic size={36} className="text-gray-500" />
                  )}
                  {voiceAnimating && (
                    <div className="absolute inset-0 rounded-full border-4 border-[#c41e3a] animate-ping opacity-30" />
                  )}
                </div>
              </div>

              {/* Transcript display */}
              <div className="bg-gray-900 rounded-xl p-4 mb-6 min-h-[60px] flex flex-col items-center justify-center text-center">
                {voiceAnimating && (
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="flex gap-1">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="w-1 bg-green-400 rounded-full animate-pulse" style={{ height: `${12 + i * 8}px`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <span className="text-sm font-mono font-bold">
                      {language === 'qu' ? 'Uyarini...' : 'Escuchando...'}
                    </span>
                    <div className="flex gap-1">
                      {[3,2,1,0].map(i => (
                        <div key={i} className="w-1 bg-green-400 rounded-full animate-pulse" style={{ height: `${12 + i * 8}px`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                {voiceSim && (
                  <p className="text-white font-mono text-lg mt-1">
                    {language === 'qu' ? '🎙️ Uyarini: ' : '🎙️ Escuché: '}
                    <span className="text-yellow-300 font-bold">"{voiceSim}"</span>
                  </p>
                )}
                {voiceResult && !voiceAnimating && (
                  <p className="text-green-400 font-bold text-sm mt-1 animate-in fade-in">
                    ✓ {voiceResult}
                  </p>
                )}
                {!voiceSim && !voiceAnimating && (
                  <p className="text-gray-500 text-sm">
                    {language === 'qu' ? 'Kay waturita hapiy simulaciónpaq...' : 'Haz clic en un comando para simular...'}
                  </p>
                )}
              </div>

              {/* Command cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {voiceCommands.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => simulateVoice(cmd)}
                    disabled={voiceAnimating}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:ring-offset-2 ${
                      voiceAnimating && voiceSim === (language === 'qu' ? cmd.qu : cmd.es)
                        ? 'border-[#c41e3a] bg-[#c41e3a]/5 scale-[1.02]'
                        : voiceAnimating
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 bg-white hover:border-[#c41e3a] hover:shadow-md'
                    }`}
                  >
                    <span className="text-3xl flex-shrink-0" aria-hidden="true">{cmd.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-bold text-[#c41e3a] text-base">"{language === 'qu' ? cmd.qu : cmd.es}"</span>
                        {language === 'es' && cmd.qu !== cmd.es && (
                          <span className="text-xs text-gray-400 font-normal italic">QU: "{cmd.qu}"</span>
                        )}
                        {language === 'qu' && (
                          <span className="text-xs text-gray-400 font-normal italic">ES: "{cmd.es}"</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 flex items-center gap-1">
                        <Navigation size={12} className="flex-shrink-0" aria-hidden="true" />
                        {language === 'qu' ? cmd.desc_qu : cmd.desc_es}
                      </p>
                    </div>
                    <SkipForward size={16} className="text-gray-300 flex-shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <p className="font-bold mb-1">
                  {language === 'qu' ? 'Ñawpaq willakuy' : 'Nota técnica'}
                </p>
                <p>
                  {language === 'qu'
                    ? 'Web Speech API (SpeechRecognition) Chrome, Edge, Safari hinallataq Opera qhawachiqkunapi llamk\'an. Español hinallataq Quechua simikuqta reqsiyta atinmi.'
                    : 'La API Web Speech (SpeechRecognition) funciona en Chrome, Edge, Safari y Opera. Soporta reconocimiento en español y puede configurarse para Quechua con modelos extendidos.'}
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              TAB: HIT TARGETS
          ═══════════════════════════════════════════════════════════════ */}
          {tab === 'areas' && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <MousePointer size={20} className="text-[#c41e3a]" aria-hidden="true" />
                  {language === 'qu' ? 'Llamk\'ay Suyu — Evidencia Técnica' : 'Áreas de Clic — Evidencia Técnica'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {language === 'qu'
                    ? 'WCAG 2.5.5 (AAA): Tukuy ruway munay ≥ 44×44px kanan tiyan. Pacha 2.5.8 (AA): ≥ 24px.'
                    : 'WCAG 2.5.5 (AAA): todos los objetivos táctiles deben ser ≥ 44×44px. Criterio 2.5.8 (AA): ≥ 24px.'}
                </p>
              </div>

              {/* Scan button */}
              {!hitScanned ? (
                <div className="flex flex-col items-center py-12 gap-4">
                  <div className="bg-orange-100 p-6 rounded-full">
                    <MousePointer size={48} className="text-orange-500" aria-hidden="true" />
                  </div>
                  <p className="text-gray-600 text-center max-w-sm">
                    {language === 'qu'
                      ? 'Kay waturita hapiy tukuy interactivo ruway munaykunata qhawachikuypaq.'
                      : 'Haz clic en "Escanear" para analizar todos los elementos interactivos de la página actual.'}
                  </p>
                  <button
                    onClick={scanHitTargets}
                    className="flex items-center gap-2 bg-[#c41e3a] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#a01729] transition-colors focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
                  >
                    <MousePointer size={20} aria-hidden="true" />
                    {language === 'qu' ? 'Qhaway' : 'Escanear página'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                      <p className="text-2xl font-black text-blue-700">{hitTargets.length}</p>
                      <p className="text-xs text-blue-600 font-medium mt-0.5">
                        {language === 'qu' ? 'Tukuy' : 'Total'}
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                      <p className="text-2xl font-black text-green-700">{compliantCount}</p>
                      <p className="text-xs text-green-600 font-medium mt-0.5">
                        {language === 'qu' ? 'WCAG ✓' : 'WCAG ✓'}
                      </p>
                    </div>
                    <div className={`border rounded-xl p-3 text-center ${nonCompliantCount > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`text-2xl font-black ${nonCompliantCount > 0 ? 'text-red-700' : 'text-gray-400'}`}>{nonCompliantCount}</p>
                      <p className={`text-xs font-medium mt-0.5 ${nonCompliantCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {language === 'qu' ? 'Problema' : 'No conformes'}
                      </p>
                    </div>
                    <div className={`border rounded-xl p-3 text-center ${complianceRate >= 90 ? 'bg-green-50 border-green-200' : complianceRate >= 70 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                      <p className={`text-2xl font-black ${complianceRate >= 90 ? 'text-green-700' : complianceRate >= 70 ? 'text-amber-700' : 'text-red-700'}`}>
                        {complianceRate}%
                      </p>
                      <p className={`text-xs font-medium mt-0.5 ${complianceRate >= 90 ? 'text-green-600' : 'text-amber-600'}`}>
                        {language === 'qu' ? 'Allin' : 'Conformidad'}
                      </p>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {[
                      { type: 'button', label_es: 'Botón', label_qu: 'Watura' },
                      { type: 'link', label_es: 'Enlace', label_qu: 'Enlace' },
                      { type: 'input', label_es: 'Input', label_qu: 'Haykuy' },
                      { type: 'other', label_es: 'Otro', label_qu: 'Huk' },
                    ].map(({ type, label_es, label_qu }) => (
                      <div key={type} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-full ${typeColor[type]}`} aria-hidden="true" />
                        <span className="text-xs text-gray-600">{language === 'qu' ? label_qu : label_es}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-600" />
                      <span className="text-xs text-gray-600">≥44px WCAG AA</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={12} className="text-red-500" />
                      <span className="text-xs text-gray-600">&lt;44px</span>
                    </div>
                  </div>

                  {/* Rescan button */}
                  <button
                    onClick={scanHitTargets}
                    className="mb-4 text-sm text-[#c41e3a] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded"
                  >
                    ↺ {language === 'qu' ? 'Musuqmanta qhaway' : 'Volver a escanear'}
                  </button>

                  {/* Element table */}
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <table className="w-full text-sm" role="grid" aria-label={language === 'qu' ? 'Ruway munay suyukuna' : 'Tabla de áreas de clic'}>
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wide w-8">#</th>
                          <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wide">
                            {language === 'qu' ? 'Suti' : 'Elemento'}
                          </th>
                          <th className="text-left px-3 py-2.5 text-xs font-bold uppercase tracking-wide hidden sm:table-cell">
                            {language === 'qu' ? 'Tipo' : 'Tipo'}
                          </th>
                          <th className="text-right px-3 py-2.5 text-xs font-bold uppercase tracking-wide">
                            {language === 'qu' ? 'Hatun' : 'Tamaño'}
                          </th>
                          <th className="text-center px-3 py-2.5 text-xs font-bold uppercase tracking-wide">WCAG</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {hitTargets.map((target, i) => (
                          <tr
                            key={i}
                            className={`transition-colors ${target.compliant ? 'hover:bg-green-50' : 'hover:bg-red-50 bg-red-50/40'}`}
                          >
                            <td className="px-3 py-2 text-gray-400 text-xs font-mono">{i + 1}</td>
                            <td className="px-3 py-2 max-w-[180px]">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${typeColor[target.type]}`} aria-hidden="true" />
                                <span className="text-gray-800 truncate font-medium text-xs" title={target.label}>
                                  {target.label || target.tag}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 hidden sm:table-cell">
                              <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                &lt;{target.tag}&gt;
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <span className={`text-xs font-mono font-bold ${target.compliant ? 'text-green-700' : 'text-red-600'}`}>
                                {target.width}×{target.height}px
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              {target.compliant ? (
                                <span className="inline-flex items-center justify-center gap-1">
                                  <CheckCircle2 size={16} className="text-green-600" aria-hidden="true" />
                                  {colorBlind && (
                                    <span className="text-xs font-bold text-[#005FCC]" aria-hidden="true">✔</span>
                                  )}
                                  <span className="sr-only">Conforme — ≥ 44×44px</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center gap-1">
                                  <AlertTriangle size={16} className="text-red-500" aria-hidden="true" />
                                  {colorBlind && (
                                    <span className="text-xs font-bold text-[#CC8800]" aria-hidden="true">✖</span>
                                  )}
                                  <span className="sr-only">No conforme — menos de 44×44px</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* WCAG info box */}
                  <div className={`mt-4 p-4 rounded-xl border text-sm ${complianceRate === 100 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <p className="font-bold mb-1">
                      {complianceRate === 100
                        ? (language === 'qu' ? '✅ Tukuy WCAG 2.5.5 (AAA) allinmi!' : '✅ 100% conformidad con WCAG 2.5.5 (AAA)')
                        : (language === 'qu' ? `⚠️ ${nonCompliantCount} ruway munaykuna pisim (< 44×44px)` : `⚠️ ${nonCompliantCount} elemento(s) por debajo de 44×44px (WCAG 2.5.5)`)}
                    </p>
                    <p className="text-xs opacity-80">
                      {language === 'qu'
                        ? 'WCAG 2.5.5 AAA nispa tukuy touch target ≥ 44×44px. WCAG 2.5.8 AA nispa ≥ 24×24px. Hatun arean kanqa ruway aswan allinmi.'
                        : 'WCAG 2.5.5 (AAA) requiere ≥ 44×44px para todos los targets táctiles. WCAG 2.5.8 (AA) requiere al menos 24×24px. Áreas más grandes mejoran la usabilidad para usuarios con discapacidades motoras.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
