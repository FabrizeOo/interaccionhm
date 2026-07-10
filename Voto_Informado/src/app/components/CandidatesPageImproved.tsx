import { Filter, X, ArrowLeft, ChevronDown, BookOpen, Award, Briefcase, CheckCircle2, Circle, Check, BarChart3, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const mockCandidates = [
  { id: 1, name: 'JUAN CARLOS LÓPEZ RÍOS', party: 'PROGRESO PERÚ', logo: 'PP', color: '#e91e63', age: 52, profession: 'Economista', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 2, name: 'MARÍA ISABEL GARCÍA TORRES', party: 'ALIANZA PARA EL PROGRESO', logo: 'APP', color: '#2196f3', age: 48, profession: 'Abogada', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: false },
  { id: 3, name: 'CARLOS ALBERTO MENDOZA', party: 'ACCIÓN POPULAR', logo: 'AP', color: '#ff9800', age: 55, profession: 'Ingeniero Civil', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 4, name: 'ANA PATRICIA ROJAS', party: 'FUERZA POPULAR', logo: 'FP', color: '#ff5722', age: 45, profession: 'Administradora', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true },
  { id: 5, name: 'ROBERTO PÉREZ SILVA', party: 'PODEMOS PERÚ', logo: 'PODE', color: '#9c27b0', age: 50, profession: 'Médico', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 6, name: 'LUCÍA FERNÁNDEZ', party: 'PERÚ LIBRE', logo: 'PL', color: '#f44336', age: 43, profession: 'Educadora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 7, name: 'MIGUEL ÁNGEL TORRES', party: 'RENOVACIÓN POPULAR', logo: 'RP', color: '#00bcd4', age: 58, profession: 'Empresario', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true },
  { id: 8, name: 'CARMEN ROSA VALDEZ', party: 'JUNTOS POR EL PERÚ', logo: 'JPP', color: '#4caf50', age: 47, profession: 'Socióloga', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true },
  { id: 9, name: 'JOSÉ ANTONIO QUISPE', party: 'SOMOS PERÚ', logo: 'SP', color: '#ff6f00', age: 51, profession: 'Contador', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: false },
  { id: 10, name: 'ELENA MORALES CASTRO', party: 'AVANZA PAÍS', logo: 'AVAN', color: '#3f51b5', age: 44, profession: 'Periodista', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true },
  { id: 11, name: 'RAÚL MENDOZA GARCÍA', party: 'PARTIDO MORADO', logo: 'PM', color: '#673ab7', age: 49, profession: 'Ingeniero Industrial', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true },
  { id: 12, name: 'PATRICIA LEÓN FLORES', party: 'FRENTE AMPLIO', logo: 'FA', color: '#e91e63', age: 42, profession: 'Antropóloga', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 13, name: 'EDUARDO RAMOS SILVA', party: 'ALIANZA NACIONAL', logo: 'AN', color: '#f57c00', age: 56, profession: 'Abogado', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 14, name: 'SANDRA VARGAS CONDE', party: 'PERÚ PATRIA SEGURA', logo: 'PPS', color: '#455a64', age: 48, profession: 'Ex militar', education: 'Técnico', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 15, name: 'MARIO CASTRO DÁVILA', party: 'DEMOCRACIA DIRECTA', logo: 'DD', color: '#00acc1', age: 40, profession: 'Politólogo', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true },
  { id: 16, name: 'ROSA CHÁVEZ MAMANI', party: 'UNIÓN POR EL PERÚ', logo: 'UPP', color: '#d32f2f', age: 46, profession: 'Educadora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 17, name: 'ALBERTO FLORES NÚÑEZ', party: 'PERÚ NACIÓN', logo: 'PN', color: '#1976d2', age: 53, profession: 'Economista', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 18, name: 'JULIA MENDOZA RÍOS', party: 'VAMOS PERÚ', logo: 'VP', color: '#7b1fa2', age: 41, profession: 'Psicóloga', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 19, name: 'FERNANDO GARCÍA SOTO', party: 'RESTAURACIÓN NACIONAL', logo: 'RN', color: '#558b2f', age: 54, profession: 'Pastor evangélico', education: 'Técnico', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true },
  { id: 20, name: 'ANDREA SILVA CAMPOS', party: 'PARTIDO VERDE', logo: 'PV', color: '#388e3c', age: 39, profession: 'Bióloga', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true },
  { id: 21, name: 'RICARDO TORRES PÉREZ', party: 'PERÚ LIBRE DEMOCRÁTICO', logo: 'PLD', color: '#e65100', age: 57, profession: 'Historiador', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 22, name: 'MÓNICA HERRERA CASTRO', party: 'NUEVA CONSTITUCIÓN', logo: 'NC', color: '#c2185b', age: 45, profession: 'Constitucionalista', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 23, name: 'LUIS PACHECO ROJAS', party: 'PERÚ PRIMERO', logo: 'PPR', color: '#0288d1', age: 50, profession: 'Empresario', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true },
  { id: 24, name: 'ISABEL ROJAS VEGA', party: 'FUERZA CIUDADANA', logo: 'FC', color: '#f06292', age: 43, profession: 'Comunicadora social', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true },
  { id: 25, name: 'HERNÁN SALAS DÍAZ', party: 'TODOS POR EL PERÚ', logo: 'TPP', color: '#5c6bc0', age: 52, profession: 'Médico cirujano', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 26, name: 'GLORIA NÚÑEZ PAREDES', party: 'PERÚ UNIDO', logo: 'PU', color: '#ab47bc', age: 47, profession: 'Trabajadora social', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
  { id: 27, name: 'JORGE VELÁSQUEZ ARIAS', party: 'CAMBIO RADICAL', logo: 'CR', color: '#26a69a', age: 38, profession: 'Ingeniero de sistemas', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true },
  { id: 28, name: 'CECILIA RAMOS TORRES', party: 'FRENTE SOCIAL', logo: 'FS', color: '#ef5350', age: 44, profession: 'Economista social', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true },
  { id: 29, name: 'VÍCTOR PAREDES OCHOA', party: 'ALIANZA POPULAR', logo: 'APOP', color: '#ff7043', age: 55, profession: 'Agricultor técnico', education: 'Técnico', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true },
  { id: 30, name: 'DIANA CAMPOS QUISPE', party: 'PERÚ PROGRESA', logo: 'PP2', color: '#42a5f5', age: 41, profession: 'Administradora pública', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true },
];

interface CandidatesPageImprovedProps {
  onNavigate: (page: string, candidateId?: number, selectedIds?: number[]) => void;
  preSelectedIds?: number[];
}

export function CandidatesPageImproved({ onNavigate, preSelectedIds = [] }: CandidatesPageImprovedProps) {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'party'>('name');

  // Compare Mode
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>(preSelectedIds);

  // Applied filters (multi-select arrays)
  const [appliedParties, setAppliedParties] = useState<string[]>([]);
  const [appliedEducation, setAppliedEducation] = useState<string[]>([]);
  const [appliedExperience, setAppliedExperience] = useState<string[]>([]);
  const [appliedJudicial, setAppliedJudicial] = useState<string[]>([]);

  // Pending (staged) filters
  const [pendingParties, setPendingParties] = useState<string[]>([]);
  const [pendingEducation, setPendingEducation] = useState<string[]>([]);
  const [pendingExperience, setPendingExperience] = useState<string[]>([]);
  const [pendingJudicial, setPendingJudicial] = useState<string[]>([]);

  // Pagination state
  const [displayedCount, setDisplayedCount] = useState(10);
  const CANDIDATES_PER_LOAD = 10;

  const toggleItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const handleApplyFilters = () => {
    setAppliedParties(pendingParties);
    setAppliedEducation(pendingEducation);
    setAppliedExperience(pendingExperience);
    setAppliedJudicial(pendingJudicial);
    setShowFilters(false);
    setDisplayedCount(10); // Reset to initial count when filters are applied
  };

  const handleClearFilters = () => {
    setPendingParties([]);
    setPendingEducation([]);
    setPendingExperience([]);
    setPendingJudicial([]);
    setAppliedParties([]);
    setAppliedEducation([]);
    setAppliedExperience([]);
    setAppliedJudicial([]);
    setDisplayedCount(10); // Reset to initial count when filters are cleared
  };

  const handleOpenFilters = () => {
    if (!showFilters) {
      setPendingParties(appliedParties);
      setPendingEducation(appliedEducation);
      setPendingExperience(appliedExperience);
      setPendingJudicial(appliedJudicial);
    }
    setShowFilters(!showFilters);
  };

  const toggleCompareMode = () => {
    if (isCompareMode) {
      // Salir del modo comparación
      setIsCompareMode(false);
      setSelectedForCompare([]);
    } else {
      // Entrar al modo comparación
      setIsCompareMode(true);
      setSelectedForCompare([]);
    }
  };

  const toggleCompareSelection = (candidateId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!isCompareMode) return;

    if (selectedForCompare.includes(candidateId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== candidateId));
    } else if (selectedForCompare.length < 2) {
      setSelectedForCompare([...selectedForCompare, candidateId]);
    }
  };

  const handleCompare = () => {
    if (selectedForCompare.length === 2) {
      onNavigate('comparar', undefined, selectedForCompare);
      setIsCompareMode(false);
      setSelectedForCompare([]);
    }
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + CANDIDATES_PER_LOAD);
  };

  const handleShowLess = () => {
    setDisplayedCount(10);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesParty = appliedParties.length === 0 || appliedParties.includes(candidate.party);
    const matchesEducation = appliedEducation.length === 0 || appliedEducation.includes(candidate.education);
    const matchesExperience = appliedExperience.length === 0 || appliedExperience.includes(candidate.experience);
    const matchesNoPenal = !appliedJudicial.includes('noPenal') || candidate.noPenalSentences === true;
    const matchesNoNonPenal = !appliedJudicial.includes('noNonPenal') || candidate.noNonPenalSentences === true;
    return matchesParty && matchesEducation && matchesExperience && matchesNoPenal && matchesNoNonPenal;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return a.party.localeCompare(b.party);
  });

  const uniqueParties = Array.from(new Set(mockCandidates.map(c => c.party))).sort();

  const activeFiltersCount = appliedParties.length + appliedEducation.length + appliedExperience.length + appliedJudicial.length;

  const displayedCandidates = filteredCandidates.slice(0, displayedCount);
  const hasMoreCandidates = displayedCount < filteredCandidates.length;
  const showingAllCandidates = displayedCount >= filteredCandidates.length && filteredCandidates.length > 10;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-[#c41e3a] font-medium text-lg mb-6 hover:gap-3 transition-all group focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded-lg px-2 py-1"
          aria-label={t('home_back')}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          {t('home_back')}
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t('cand_title')}</h1>
          <p className="text-xl text-gray-600">{t('cand_subtitle')}</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col gap-4">
            {/* Top Row - Filter and Sort */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Filter Button */}
              <button
                onClick={handleOpenFilters}
                className={`px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-[#c41e3a] text-white hover:bg-[#a01729]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Filter size={22} aria-hidden="true" />
                {t('cand_filter')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                <ChevronDown size={20} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'party')}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl font-medium text-lg focus:border-[#c41e3a] focus:outline-none bg-white cursor-pointer"
              >
                <option value="name">{t('cand_sort')} {t('cand_sort_name')}</option>
                <option value="party">{t('cand_sort')} {t('cand_sort_party')}</option>
              </select>

              {/* EleccIA Button */}
              <button
                className="ml-auto px-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white hover:from-violet-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Sparkles size={22} />
                EleccIA
              </button>
            </div>

            {/* Compare Mode Section */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
              <p className="text-sm font-medium text-gray-600">
                {t('cand_showing')} <strong className="text-blue-600">{Math.min(displayedCount, filteredCandidates.length)}</strong> {t('cand_of')} <strong>{filteredCandidates.length}</strong> {t('cand_results')} {filteredCandidates.length < mockCandidates.length && `(${mockCandidates.length})`}
              </p>

              {!isCompareMode ? (
                <button
                  onClick={toggleCompareMode}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
                  aria-label={t('cand_compare_mode')}
                >
                  <BarChart3 size={16} aria-hidden="true" />
                  {t('cand_compare_mode')}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-600 bg-white border border-blue-200 px-3 py-1.5 rounded-lg" aria-live="polite">
                    {selectedForCompare.length} / 2 {t('cand_compare_selected')}
                  </span>
                  <button
                    onClick={toggleCompareMode}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    {t('cand_compare_exit')}
                  </button>
                  <button
                    onClick={handleCompare}
                    disabled={selectedForCompare.length !== 2}
                    aria-disabled={selectedForCompare.length !== 2}
                    className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 ${
                      selectedForCompare.length === 2
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm focus:ring-green-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed focus:ring-gray-400'
                    }`}
                  >
                    <BarChart3 size={15} aria-hidden="true" />
                    {t('cand_compare_go')} ({selectedForCompare.length}/2)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              {/* Selección activa summary */}
              {(pendingParties.length + pendingEducation.length + pendingExperience.length + pendingJudicial.length) > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[...pendingParties, ...pendingEducation, ...pendingExperience,
                    ...pendingJudicial.map(j => j === 'noPenal' ? 'Sin sent. penales' : 'Sin sent. no penales')
                  ].map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-[#c41e3a]/10 text-[#c41e3a] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#c41e3a]/20">
                      {tag}
                    </span>
                  ))}
                  <button onClick={() => { setPendingParties([]); setPendingEducation([]); setPendingExperience([]); setPendingJudicial([]); }} className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">limpiar todo</button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                {/* Nivel de Estudios */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-400"></span>
                    {t('cand_filter_education')}
                  </p>
                  <div className="space-y-1.5">
                    {['Técnico', 'Universitario'].map(opt => {
                      const active = pendingEducation.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => setPendingEducation(toggleItem(pendingEducation, opt))}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                            active
                              ? 'bg-purple-500 border-purple-500 text-white shadow-sm'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${active ? 'bg-white border-white' : 'border-gray-300'}`}>
                            {active && <Check size={10} className="text-purple-500" strokeWidth={3} />}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experiencia Laboral */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-400"></span>
                    {t('cand_filter_experience')}
                  </p>
                  <div className="space-y-1.5">
                    {['Sector Público', 'Sector Privado', 'Ambos Sectores'].map(opt => {
                      const active = pendingExperience.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => setPendingExperience(toggleItem(pendingExperience, opt))}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                            active
                              ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${active ? 'bg-white border-white' : 'border-gray-300'}`}>
                            {active && <Check size={10} className="text-orange-500" strokeWidth={3} />}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Antecedentes Judiciales */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                    {t('cand_filter_judicial')}
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { key: 'noPenal', label: 'Sin sentencias penales firmes' },
                      { key: 'noNonPenal', label: 'Sin sentencias no penales firmes' },
                    ].map(({ key, label }) => {
                      const active = pendingJudicial.includes(key);
                      return (
                        <button
                          key={key}
                          onClick={() => setPendingJudicial(toggleItem(pendingJudicial, key))}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
                            active
                              ? 'bg-green-500 border-green-500 text-white shadow-sm'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${active ? 'bg-white border-white' : 'border-gray-300'}`}>
                            {active && <Check size={10} className="text-green-500" strokeWidth={3} />}
                          </span>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Partido Político */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                  {t('cand_filter_party')}
                  {pendingParties.length > 0 && (
                    <span className="ml-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-xs font-bold">{pendingParties.length} seleccionados</span>
                  )}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
                  {uniqueParties.map(party => {
                    const active = pendingParties.includes(party);
                    return (
                      <button
                        key={party}
                        onClick={() => setPendingParties(toggleItem(pendingParties, party))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all text-left ${
                          active
                            ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        <span className={`flex-shrink-0 w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-all ${active ? 'bg-white border-white' : 'border-gray-300'}`}>
                          {active && <Check size={8} className="text-blue-500" strokeWidth={3} />}
                        </span>
                        <span className="truncate">{party}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              {(() => {
                const pendingCount = pendingParties.length + pendingEducation.length + pendingExperience.length + pendingJudicial.length;
                const hasSelection = pendingCount > 0;
                return (
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={handleClearFilters}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <X size={14} aria-hidden="true" />
                      {t('cand_filter_clear')}
                    </button>
                    <button
                      onClick={handleApplyFilters}
                      disabled={!hasSelection}
                      aria-disabled={!hasSelection}
                      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        hasSelection
                          ? 'bg-[#c41e3a] text-white hover:bg-[#a8152d] shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer ring-2 ring-[#c41e3a]/30 focus:ring-[#c41e3a]'
                          : 'bg-rose-100 text-rose-300 border border-rose-200 cursor-not-allowed focus:ring-rose-300'
                      }`}
                    >
                      <CheckCircle2 size={16} aria-hidden="true" />
                      {t('cand_filter_apply')}
                      {hasSelection && (
                        <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Candidates Grid */}
        {filteredCandidates.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayedCandidates.map((candidate, index) => {
              const isSelected = selectedForCompare.includes(candidate.id);
              const canSelect = selectedForCompare.length < 2 || isSelected;

              return (
              <div
                key={candidate.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 overflow-hidden group cursor-pointer animate-in fade-in relative flex flex-col ${
                  isSelected && isCompareMode ? 'border-blue-500 ring-2 ring-blue-100 scale-105' : 'border-transparent hover:border-[#c41e3a]'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={(e) => {
                  if (isCompareMode) {
                    toggleCompareSelection(candidate.id, e);
                  } else {
                    onNavigate('candidato-detalle', candidate.id);
                  }
                }}
              >
                {/* Checkbox for Compare - Only visible in compare mode */}
                {isCompareMode && (
                  <div className="absolute top-2 right-2 z-20">
                    <div
                      className={`p-1.5 rounded-lg transition-all shadow-lg ${
                        isSelected
                          ? 'bg-blue-600 text-white scale-110'
                          : canSelect
                          ? 'bg-white text-gray-600 border-2 border-gray-300'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 size={20} strokeWidth={2.5} />
                      ) : (
                        <Circle size={20} strokeWidth={2} />
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Badge */}
                {isSelected && isCompareMode && (
                  <div className="absolute top-2 left-2 z-20 bg-blue-600 text-white px-2 py-1 rounded-md font-bold text-xs shadow-lg flex items-center gap-1">
                    <Check size={14} />
                    Seleccionado
                  </div>
                )}

                {/* Photo Section */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-36 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-gray-600 text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform z-10">
                    {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {candidate.name}
                  </h3>

                  {/* Info Pills */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700">
                      <Award size={12} aria-hidden="true" />
                      {candidate.age} {t('cand_years')}
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700">
                      <Briefcase size={12} aria-hidden="true" />
                      <span className="line-clamp-1">{candidate.profession}</span>
                    </div>
                  </div>

                  {/* Party + Button pushed to bottom */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform flex-shrink-0"
                        style={{ backgroundColor: candidate.color }}
                        aria-hidden="true"
                      >
                        {candidate.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">{candidate.party}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-[#c41e3a] to-[#a01729] text-white py-2 rounded-lg font-bold text-sm hover:from-[#a01729] hover:to-[#8a1523] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 group-hover:gap-2">
                      <BookOpen size={16} aria-hidden="true" />
                      {t('cand_view_profile')}
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
            </div>

            {/* Ver más / Ver menos buttons */}
            {hasMoreCandidates && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-[#c41e3a] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#a01729] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
                  aria-label={`${t('cand_see_more')} (${filteredCandidates.length - displayedCount})`}
                >
                  <ChevronDown size={24} aria-hidden="true" />
                  {t('cand_see_more')}
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-sm" aria-hidden="true">
                    {filteredCandidates.length - displayedCount}
                  </span>
                </button>
              </div>
            )}

            {showingAllCandidates && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleShowLess}
                  className="bg-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-gray-600 focus:ring-offset-2"
                >
                  <ChevronDown size={24} className="rotate-180" aria-hidden="true" />
                  {t('cand_see_less')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter size={48} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-2">{t('cand_no_results')}</p>
            <p className="text-lg text-gray-600 mb-6">{t('cand_no_results')}</p>
            <button
              onClick={handleClearFilters}
              className="bg-[#c41e3a] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#a01729] transition-colors focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
            >
              {t('cand_clear_filters')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
