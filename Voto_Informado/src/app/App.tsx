import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { CandidatesPageImproved } from './components/CandidatesPageImproved';
import { ComparePageImproved } from './components/ComparePageImproved';
import { CandidateDetailPage } from './components/CandidateDetailPage';
import { CronogramaPage } from './components/CronogramaPage';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { AccessibilityDemoPanel } from './components/AccessibilityDemoPanel';
import { CandidateListPage } from './components/CandidateListPage';
import { SobreNosotrosPage } from './components/SobreNosotrosPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { Experiencia3DPage } from './components/Experiencia3DPage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | undefined>(undefined);
  const [compareSelectedIds, setCompareSelectedIds] = useState<number[]>([]);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoTab, setDemoTab] = useState<'teclado' | 'voz' | 'areas'>('teclado');
  const { t } = useLanguage();

  const handleNavigate = (page: string, candidateId?: number, selectedIds?: number[]) => {
    setCurrentPage(page);
    if (candidateId) setSelectedCandidateId(candidateId);
    if (selectedIds) setCompareSelectedIds(selectedIds);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Move focus to main content after navigation
    setTimeout(() => {
      const main = document.getElementById('main-content');
      if (main) main.focus();
    }, 100);
  };

  // Voice command handler — understands Spanish and Quechua commands
  const handleVoiceCommand = useCallback((transcript: string) => {
    const cmd = transcript.toLowerCase();
    if (cmd.includes('inicio') || cmd.includes('qallariy') || cmd.includes('principal')) {
      handleNavigate('home');
    } else if (cmd.includes('candidato') || cmd.includes('akllakuq') || cmd.includes('presidente')) {
      handleNavigate('presidentes');
    } else if (cmd.includes('comparar') || cmd.includes('kikinchay') || cmd.includes('compara')) {
      handleNavigate('comparar');
    } else if (cmd.includes('cronograma') || cmd.includes('pacha hapiy') || cmd.includes('calendario')) {
      handleNavigate('cronograma');
    } else if (cmd.includes('diputado') || cmd.includes('llaqta kamachiq')) {
      handleNavigate('diputados');
    } else if (cmd.includes('senador') || cmd.includes('hatun rimaq')) {
      handleNavigate('senadores');
    }
  }, []);

  const comingSoonPages: string[] = [];

  return (
    <AccessibilityProvider onVoiceCommand={handleVoiceCommand}>
      {/* Skip to main content — keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#c41e3a] focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:font-bold focus:text-base focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-white"
      >
        {t('skip_to_content')}
      </a>

      {/* Screen reader live region for navigation announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="sr-announcer" />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {currentPage !== 'experiencia3d' && <Header currentPage={currentPage} onNavigate={handleNavigate} />}

        <main
          id="main-content"
          tabIndex={-1}
          className={`${currentPage === 'experiencia3d' ? 'flex-1' : 'pb-12'} outline-none`}
          aria-label={t('nav_home')}
        >
          {currentPage === 'experiencia3d' && <Experiencia3DPage onNavigate={handleNavigate} />}
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'presidentes' && (
            <CandidatesPageImproved
              onNavigate={handleNavigate}
              preSelectedIds={compareSelectedIds}
            />
          )}
          {currentPage === 'comparar' && (
            <ComparePageImproved
              onNavigate={handleNavigate}
              preSelectedIds={compareSelectedIds}
            />
          )}
          {currentPage === 'candidato-detalle' && (
            <CandidateDetailPage
              onNavigate={handleNavigate}
              candidateId={selectedCandidateId}
            />
          )}
          {currentPage === 'cronograma' && (
            <CronogramaPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'diputados' && (
            <CandidateListPage role="diputados" onNavigate={handleNavigate} />
          )}
          {currentPage === 'senadores' && (
            <CandidateListPage role="senadores" onNavigate={handleNavigate} />
          )}
          {currentPage === 'parlamento' && (
            <CandidateListPage role="parlamento" onNavigate={handleNavigate} />
          )}
          {currentPage === 'sobre-nosotros' && (
            <SobreNosotrosPage onNavigate={handleNavigate} />
          )}
          {comingSoonPages.includes(currentPage) && (
            <div className="max-w-7xl mx-auto px-4 py-8">
              <button
                onClick={() => handleNavigate('home')}
                className="flex items-center gap-2 text-[#c41e3a] font-medium text-lg mb-6 hover:gap-3 transition-all group focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded-lg px-2 py-1"
                aria-label={t('home_back')}
              >
                ← {t('home_back')}
              </button>
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                    <span className="text-5xl">🚧</span>
                  </div>
                  <h2 className="text-4xl font-bold mb-4 text-gray-800">{t('home_coming_soon')}</h2>
                  <p className="text-xl text-gray-600 mb-6">{t('home_coming_soon_sub')}</p>
                  <button
                    onClick={() => handleNavigate('home')}
                    className="bg-[#c41e3a] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#a01729] transition-colors focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
                  >
                    {t('home_back')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {currentPage !== 'experiencia3d' && (
          <footer className="bg-white" role="contentinfo">
            {/* Logos Section */}
            <div className="bg-gray-100 py-8">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-wrap items-center justify-center md:justify-around gap-8">
                  <div className="flex items-center gap-2" aria-label="Liga de la Democracia">
                    <div className="text-gray-400 text-3xl font-bold">
                      <span className="text-4xl">L</span>IGA <span className="text-sm">DE LA</span>
                    </div>
                    <div className="text-gray-400 text-3xl font-bold">DEMOCRACIA</div>
                  </div>

                  <div className="flex items-center gap-3" aria-label="Observa Igualdad">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-400 flex items-center justify-center" aria-hidden="true">
                      <div className="grid grid-cols-3 gap-0.5">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-gray-400 rounded-full" />
                        ))}
                      </div>
                    </div>
                    <div className="text-gray-500">
                      <div className="font-bold text-xl">OBSERVA</div>
                      <div className="font-bold text-xl">IGUALDAD</div>
                    </div>
                  </div>

                  <div className="bg-gray-400 px-6 py-3 rounded-lg shadow-md" aria-label="JNE Fact Checking">
                    <div className="text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold" aria-hidden="true">#</span>
                        <div>
                          <div className="text-sm font-medium">JNE Fact</div>
                          <div className="text-lg font-bold -mt-1">Checking</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact and Social Media */}
            <div className="bg-[#707070] text-white py-6">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-base mb-1">{t('footer_contact')}</p>
                    {/* Email — min-height 44px for WCAG 2.5.5 compliance */}
                    <a
                      href="mailto:votoinformado@jne.gob.pe"
                      className="inline-flex items-center min-h-[44px] px-3 py-2 rounded-lg hover:underline hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
                      aria-label="Enviar email a votoinformado@jne.gob.pe"
                    >
                      votoinformado@jne.gob.pe
                    </a>
                    <p className="text-sm mt-1">{t('footer_rights')}</p>
                  </div>

                  <nav aria-label={t('footer_follow')}>
                    <p className="text-base hidden md:block mb-2">{t('footer_follow')}</p>
                    {/* Social icons — min 44×44px each for WCAG 2.5.5 */}
                    <div className="flex items-center gap-1">
                      {[
                        { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                        { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                        { label: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                        { label: 'X (Twitter)', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                        { label: 'TikTok', path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
                      ].map(({ label, path }) => (
                        <a
                          key={label}
                          href="#"
                          className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                          aria-label={label}
                        >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d={path} />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>

      <AccessibilityToolbar
        onOpenDemo={(tab = 'teclado') => {
          setDemoTab(tab);
          setDemoOpen(true);
        }}
      />

      {demoOpen && (
        <AccessibilityDemoPanel
          onNavigate={handleNavigate}
          onClose={() => setDemoOpen(false)}
          initialTab={demoTab}
        />
      )}
    </AccessibilityProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
