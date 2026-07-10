import { Users, Building2, Globe, Play, Award, MessageSquare, Map, ArrowRight, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-700 mb-2">{t('home_elections')}</h1>
        <p className="text-6xl font-bold text-[#c41e3a]" aria-label="2026">2026</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

        {/* Card: Exposición de Planes de Gobierno */}
        <div className="lg:col-span-4">
          <button
            data-card="video"
            className="w-full h-full bg-gradient-to-br from-[#d4a76a] to-[#c49a5e] rounded-2xl p-8 flex flex-col justify-center items-center text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
            aria-label={`${t('home_video_title')} ${t('home_video_subtitle')} - ${t('home_video_desc')}`}
          >
            <div className="mb-6 bg-white/20 p-6 rounded-full group-hover:scale-110 transition-transform" aria-hidden="true">
              <Play size={48} className="text-white" fill="white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-center">{t('home_video_title')}</h2>
            <p className="text-xl font-bold mb-2 text-center">{t('home_video_subtitle')}</p>
            <p className="text-lg text-center mt-4 bg-white/20 px-4 py-2 rounded-lg">
              {t('home_video_desc')}
            </p>
          </button>
        </div>

        {/* Right Column — 4 Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card: Presidentes y vicepresidentes */}
          <button
            data-card="presidentes"
            onClick={() => onNavigate('presidentes')}
            className="bg-[#e57373] hover:bg-[#ef5350] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
            aria-label={t('home_presidents')}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-white/30 text-xs font-bold px-3 py-1 rounded-full">
                {t('know_more')}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/20 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                <Users size={56} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-center">{t('home_presidents')}</h2>
            </div>
          </button>

          {/* Card: Diputados */}
          <button
            data-card="diputados"
            onClick={() => onNavigate('diputados')}
            className="bg-[#81c784] hover:bg-[#66bb6a] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
            aria-label={t('home_deputies')}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-white/20 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                <Award size={56} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-center">{t('home_deputies')}</h2>
            </div>
          </button>

          {/* Card: Senadores */}
          <button
            data-card="senadores"
            onClick={() => onNavigate('senadores')}
            className="bg-[#5c6bc0] hover:bg-[#5e35b1] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
            aria-label={t('home_senators')}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-white/20 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                <Building2 size={56} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-center">{t('home_senators')}</h2>
            </div>
          </button>

          {/* Card: Parlamento Andino */}
          <button
            data-card="parlamento"
            onClick={() => onNavigate('parlamento')}
            className="bg-[#aed581] hover:bg-[#9ccc65] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
            aria-label={t('home_parliament')}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-white/20 p-6 rounded-2xl mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                <Globe size={56} className="text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-center">{t('home_parliament')}</h2>
            </div>
          </button>
        </div>
      </div>

      {/* Immersive 3D Experience Banner */}
      <div className="w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-[#2e080c] rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden border border-slate-800/80 group">
        {/* Decorative background grid and glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(196,30,58,0.25),rgba(255,255,255,0))]" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/15 transition-all duration-700" />
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/15 transition-all duration-700" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="bg-gradient-to-tr from-[#c41e3a] to-red-500 p-5 rounded-2xl shadow-xl shadow-red-950/20 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0 border border-red-400/20">
              <span className="text-5xl select-none" role="img" aria-label="3D Simulator Cube">🗳️</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                <span className="bg-[#c41e3a]/15 text-[#f43f5e] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-red-500/20 animate-pulse">
                  NUEVO / INMERSIVO
                </span>
                <span className="bg-indigo-500/15 text-indigo-300 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/20">
                  REALIDAD VIRTUAL 3D
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                {t('home_3d_title')}
              </h2>
              <p className="text-slate-300 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                {t('home_3d_desc')}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('experiencia3d')}
            className="w-full lg:w-auto bg-gradient-to-r from-[#c41e3a] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-lg md:text-xl px-8 py-5 rounded-2xl transition-all duration-300 shadow-lg shadow-red-900/30 hover:shadow-red-800/40 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center gap-3 border border-red-500/30 active:scale-95"
          >
            <span>{t('home_3d_btn')}</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Banner ElecciA — ¿Revisa, compara y decide? */}
      <button
        data-banner="eleccia"
        className="w-full bg-gradient-to-r from-[#4fc3f7] to-[#29b6f6] rounded-2xl p-6 mb-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer text-left focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
        aria-label={`${t('home_revisa')} — ${t('home_revisa_sub')}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full" aria-hidden="true">
              <Map size={40} className="text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-1">{t('home_revisa')}</h2>
              <p className="text-xl">{t('home_revisa_sub')}</p>
            </div>
          </div>
          <div className="hidden md:block text-white text-6xl opacity-30" aria-hidden="true">→</div>
        </div>
      </button>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer group border-2 border-gray-300 text-left focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true">
              <MessageSquare size={40} className="text-white" />
            </div>
            <div>
              <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-2">
                {t('home_debate').split(' ')[0]} {t('home_debate').split(' ')[1] ?? ''}
              </span>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">
                {t('home_debate').split(' ').slice(-1)[0]}
              </h2>
            </div>
          </div>
          <p className="text-gray-700 text-xl font-bold">{t('home_debate_sub')}</p>
        </button>

        <button className="bg-gradient-to-br from-[#c41e3a] to-[#a01729] rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group text-left focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#c41e3a]">
          <div className="flex items-start gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-3">{t('home_abroad')}</h2>
              <p className="text-xl mb-4">{t('home_abroad_sub')}</p>
            </div>
          </div>
        </button>
      </div>

      {/* First vote info card */}
      <div className="mt-8 grid md:grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-xl flex-shrink-0" aria-hidden="true">
              <Info className="text-green-600" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('home_first_vote')}</h2>
              <p className="text-gray-600 text-lg">{t('home_first_vote_sub')}</p>
              <button className="mt-3 inline-flex items-center gap-2 text-green-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-green-600 rounded-lg px-3 py-3 min-h-[44px] hover:bg-green-50 transition-colors">
                {t('home_guide')}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
