import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Experiencia3DPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900 overflow-hidden">
      {/* Immersive Top Bar */}
      <div className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800 z-10 shadow-lg">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 font-bold transition-all group focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded-xl px-4 py-2 min-h-[44px] cursor-pointer shadow-md"
          aria-label={t('home_back')}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('home_back')}</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#c41e3a]"></span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-wider uppercase text-gray-100">
            {t('home_3d_title')}
          </h1>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-700 text-xs text-gray-400">
          <span className="text-green-400 font-bold">ONPE / JNE</span>
          <span className="text-gray-600">|</span>
          <span>Interactivo</span>
        </div>
      </div>

      {/* Interactive Iframe */}
      <div className="flex-1 w-full h-full relative bg-black">
        <iframe
          src="/simulador3d/index.html"
          className="w-full h-full border-none"
          title={t('home_3d_title')}
          allow="xr-spatial-tracking; camera; gyroscope; accelerometer; pointer-lock"
          sandbox="allow-scripts allow-same-origin allow-downloads allow-forms allow-pointer-lock"
        />
      </div>
    </div>
  );
}
