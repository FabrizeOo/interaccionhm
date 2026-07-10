import { Menu, Sparkles, X, Home, Users, BarChart3, HelpCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function Header({ currentPage, onNavigate }: { currentPage?: string; onNavigate?: (page: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { page: 'home', label: t('nav_home'), icon: <Home size={24} aria-hidden="true" /> },
    { page: 'presidentes', label: t('nav_candidates'), icon: <Users size={24} aria-hidden="true" /> },
    { page: 'comparar', label: t('nav_compare'), icon: <BarChart3 size={24} aria-hidden="true" /> },
    { page: 'cronograma', label: t('nav_schedule'), icon: <Calendar size={24} aria-hidden="true" /> },
    { page: 'sobre-nosotros', label: t('nav_about'), icon: <HelpCircle size={24} aria-hidden="true" /> },
  ];

  return (
    <header className="bg-[#c41e3a] text-white shadow-lg sticky top-0 z-50" role="banner">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => handleNavigation('home')}
            className="flex items-center gap-4 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#c41e3a] rounded-lg p-1"
            aria-label={`${language === 'es' ? 'Voto Informado JNE - Ir al inicio' : 'Yachaywan Qillqay JNE - Qallariman riy'}`}
          >
            <div className="flex items-center" aria-hidden="true">
              <svg width="50" height="50" viewBox="0 0 50 50" className="text-white fill-current">
                <circle cx="25" cy="15" r="6" />
                <path d="M15 22 L25 18 L35 22 L30 35 L20 35 Z" />
                <rect x="12" y="36" width="26" height="3" />
              </svg>
              <div className="ml-2">
                <div className="text-xs font-bold leading-tight">JNE</div>
              </div>
            </div>
            <div className="border-2 border-white rounded-full px-4 py-1.5 flex items-center gap-2" aria-hidden="true">
              <div className="text-center">
                <div className="text-sm font-bold leading-tight">Voto</div>
                <div className="text-xs leading-tight">informado</div>
              </div>
              <div className="text-xs font-bold">JNE</div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label={language === 'es' ? 'Navegación principal' : 'Allin puriy'}>

            {/* Authorities — pill style, active = white bg */}
            {(['presidentes', 'diputados', 'senadores', 'parlamento'] as const).includes(currentPage as any) ? (
              <button
                onClick={() => handleNavigation('presidentes')}
                aria-current="page"
                className="bg-white text-[#c41e3a] px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition-all shadow-md focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#c41e3a]"
              >
                {t('nav_authorities')}
              </button>
            ) : (
              <button
                onClick={() => handleNavigation('presidentes')}
                className="text-white/90 hover:text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
              >
                {t('nav_authorities')}
              </button>
            )}

            {/* Text nav items — active gets white background pill */}
            {[
              { page: 'cronograma', label: t('nav_schedule') },
              { page: 'sobre-nosotros', label: t('nav_about') },
            ].map(({ page, label }) => (
              <button
                key={page}
                onClick={() => handleNavigation(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`px-4 py-2 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                  currentPage === page
                    ? 'bg-white text-[#c41e3a] font-bold shadow-md'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                {label}
              </button>
            ))}

            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/15 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" aria-hidden="true" />
              {t('nav_jnetv')}
            </button>

            {/* Language switcher — desktop */}
            <div className="ml-2 flex items-center gap-1 bg-white/20 rounded-full p-1" role="group" aria-label={t('acc_language')}>
              <button
                onClick={() => setLanguage('es')}
                aria-pressed={language === 'es'}
                aria-label="Cambiar a Español"
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                  language === 'es' ? 'bg-white text-[#c41e3a]' : 'text-white hover:bg-white/20'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setLanguage('qu')}
                aria-pressed={language === 'qu'}
                aria-label="Tikray Quechumanta / Cambiar a Quechua"
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                  language === 'qu' ? 'bg-white text-[#c41e3a]' : 'text-white hover:bg-white/20'
                }`}
              >
                QU
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? t('nav_close_menu') : t('nav_open_menu')}
          >
            {isMobileMenuOpen ? <X size={28} aria-hidden="true" /> : <Menu size={28} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden bg-white text-gray-800 shadow-2xl border-t-2 border-gray-200 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2" aria-label={language === 'es' ? 'Menú móvil' : 'Uchuy menú'}>

          {navItems.map(({ page, label, icon }) => {
            // Consider sub-pages active under their parent
            const isActive = currentPage === page ||
              (page === 'presidentes' && ['diputados', 'senadores', 'parlamento'].includes(currentPage ?? ''));
            return (
              <button
                key={page}
                onClick={() => handleNavigation(page)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-medium text-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:ring-offset-1 ${
                  isActive ? 'bg-[#c41e3a] text-white' : 'hover:bg-gray-100'
                }`}
              >
                {icon}
                {label}
              </button>
            );
          })}

          <button className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-medium text-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#c41e3a]">
            <Sparkles size={24} aria-hidden="true" />
            {t('nav_ai')}
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-medium text-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-[#c41e3a]">
            <HelpCircle size={24} aria-hidden="true" />
            {t('nav_help')}
          </button>

          {/* Language switcher — mobile */}
          <div className="px-4 pt-2 pb-2">
            <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">{t('acc_language')}</p>
            <div className="flex gap-2" role="group" aria-label={t('acc_language')}>
              <button
                onClick={() => setLanguage('es')}
                aria-pressed={language === 'es'}
                aria-label="Cambiar a Español"
                className={`flex-1 py-3 rounded-xl font-bold text-base border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#c41e3a] ${
                  language === 'es' ? 'bg-[#c41e3a] text-white border-[#c41e3a]' : 'border-gray-200 text-gray-600 hover:border-[#c41e3a]'
                }`}
              >
                🇵🇪 Español
              </button>
              <button
                onClick={() => setLanguage('qu')}
                aria-pressed={language === 'qu'}
                aria-label="Tikray Quechumanta / Cambiar a Quechua"
                className={`flex-1 py-3 rounded-xl font-bold text-base border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#c41e3a] ${
                  language === 'qu' ? 'bg-[#c41e3a] text-white border-[#c41e3a]' : 'border-gray-200 text-gray-600 hover:border-[#c41e3a]'
                }`}
              >
                🌄 Quechua
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
