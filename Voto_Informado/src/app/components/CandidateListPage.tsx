import { useState } from 'react';
import {
  ArrowLeft, Filter, ChevronDown, X, Check, CheckCircle2,
  Circle, BarChart3, Sparkles, Award, Briefcase, BookOpen,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const senadoresCandidates = [
  { id: 101, name: 'AMELIA CHÁVEZ HUANCA', party: 'PROGRESO PERÚ', logo: 'PP', color: '#e91e63', age: 54, profession: 'Abogada', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, numero: 1 },
  { id: 102, name: 'CARLOS RIVAS MENDOZA', party: 'ALIANZA PARA EL PROGRESO', logo: 'APP', color: '#2196f3', age: 49, profession: 'Economista', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true, numero: 2 },
  { id: 103, name: 'ROSA QUISPE MAMANI', party: 'ACCIÓN POPULAR', logo: 'AP', color: '#ff9800', age: 45, profession: 'Educadora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, numero: 3 },
  { id: 104, name: 'MIGUEL SOTO PAREDES', party: 'FUERZA POPULAR', logo: 'FP', color: '#ff5722', age: 57, profession: 'Médico', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: false, numero: 4 },
  { id: 105, name: 'LUCÍA FERNÁNDEZ TORRES', party: 'PODEMOS PERÚ', logo: 'PODE', color: '#9c27b0', age: 43, profession: 'Ingeniera', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, numero: 5 },
  { id: 106, name: 'PEDRO CALDERÓN VEGA', party: 'PERÚ LIBRE', logo: 'PL', color: '#f44336', age: 51, profession: 'Sociólogo', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, numero: 6 },
  { id: 107, name: 'ANA LAURA SALINAS', party: 'RENOVACIÓN POPULAR', logo: 'RP', color: '#00bcd4', age: 38, profession: 'Periodista', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, numero: 7 },
  { id: 108, name: 'JORGE CCALLO HUANCA', party: 'JUNTOS POR EL PERÚ', logo: 'JPP', color: '#4caf50', age: 60, profession: 'Agricultor', education: 'Técnico', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, numero: 8 },
  { id: 109, name: 'VALENTINA ROCA SÁENZ', party: 'SOMOS PERÚ', logo: 'SP', color: '#ff6f00', age: 46, profession: 'Contadora', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, numero: 9 },
  { id: 110, name: 'RAÚL CONDORI LLANOS', party: 'AVANZA PAÍS', logo: 'AVAN', color: '#3f51b5', age: 53, profession: 'Ingeniero', education: 'Universitario', experience: 'Sector Público', noPenalSentences: false, noNonPenalSentences: true, numero: 10 },
  { id: 111, name: 'SILVIA MAYTA PARI', party: 'PARTIDO MORADO', logo: 'PM', color: '#673ab7', age: 41, profession: 'Psicóloga', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, numero: 11 },
  { id: 112, name: 'OMAR LAURA APAZA', party: 'FRENTE AMPLIO', logo: 'FA', color: '#e91e63', age: 48, profession: 'Abogado', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true, numero: 12 },
  { id: 113, name: 'CARMEN VILCA CHOQUE', party: 'ALIANZA NACIONAL', logo: 'AN', color: '#f57c00', age: 55, profession: 'Administradora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, numero: 13 },
  { id: 114, name: 'PABLO HERRERA SOTA', party: 'PERÚ NACIÓN', logo: 'PN', color: '#1976d2', age: 39, profession: 'Politólogo', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, numero: 14 },
  { id: 115, name: 'INÉS MAMANI COAQUIRA', party: 'DEMOCRACIA DIRECTA', logo: 'DD', color: '#00acc1', age: 44, profession: 'Trabajadora Social', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, numero: 15 },
  { id: 116, name: 'HUGO CÁCERES TAPIA', party: 'VAMOS PERÚ', logo: 'VP', color: '#7b1fa2', age: 62, profession: 'Médico', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, numero: 16 },
  { id: 117, name: 'FLOR TICONA QUISPE', party: 'PERÚ PRIMERO', logo: 'PPR', color: '#0288d1', age: 37, profession: 'Comunicadora', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, numero: 17 },
  { id: 118, name: 'MANUEL CCOPA FLORES', party: 'FUERZA CIUDADANA', logo: 'FC', color: '#f06292', age: 50, profession: 'Ingeniero Civil', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true, numero: 18 },
  { id: 119, name: 'DORIS ZÁRATE PALOMINO', party: 'TODOS POR EL PERÚ', logo: 'TPP', color: '#5c6bc0', age: 47, profession: 'Bióloga', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, numero: 19 },
  { id: 120, name: 'FÉLIX HUANCA MARCA', party: 'FRENTE SOCIAL', logo: 'FS', color: '#ef5350', age: 58, profession: 'Agricultor técnico', education: 'Técnico', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, numero: 20 },
];

const diputadosCandidates = [
  { id: 201, name: 'NATALIA BERRIOS CAMPOS', party: 'PROGRESO PERÚ', logo: 'PP', color: '#e91e63', age: 45, profession: 'Abogada', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Lima', numero: 1 },
  { id: 202, name: 'ERICK TANTALEÁN PONCE', party: 'ALIANZA PARA EL PROGRESO', logo: 'APP', color: '#2196f3', age: 38, profession: 'Economista', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Lima', numero: 2 },
  { id: 203, name: 'PAMELA FLORES VEGA', party: 'FUERZA POPULAR', logo: 'FP', color: '#ff5722', age: 52, profession: 'Médica', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Lima', numero: 3 },
  { id: 204, name: 'JORGE MEZA ALVA', party: 'RENOVACIÓN POPULAR', logo: 'RP', color: '#00bcd4', age: 47, profession: 'Ingeniero', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: false, distrito: 'Lima', numero: 4 },
  { id: 205, name: 'MILAGROS HUAMÁN PUMA', party: 'JUNTOS POR EL PERÚ', logo: 'JPP', color: '#4caf50', age: 41, profession: 'Educadora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Cusco', numero: 1 },
  { id: 206, name: 'WILBER CCALLO CUSI', party: 'ACCIÓN POPULAR', logo: 'AP', color: '#ff9800', age: 55, profession: 'Agricultor', education: 'Técnico', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Cusco', numero: 2 },
  { id: 207, name: 'ROXANA QUISPE TTITO', party: 'PERÚ LIBRE', logo: 'PL', color: '#f44336', age: 43, profession: 'Socióloga', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Cusco', numero: 3 },
  { id: 208, name: 'ADOLFO PUMA HUALLPA', party: 'AVANZA PAÍS', logo: 'AVAN', color: '#3f51b5', age: 49, profession: 'Abogado', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Cusco', numero: 4 },
  { id: 209, name: 'SOLEDAD MEDINA CHURA', party: 'PODEMOS PERÚ', logo: 'PODE', color: '#9c27b0', age: 39, profession: 'Ingeniera', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Arequipa', numero: 1 },
  { id: 210, name: 'HÉCTOR ARAGÓN VIZCARRA', party: 'PARTIDO MORADO', logo: 'PM', color: '#673ab7', age: 53, profession: 'Arquitecto', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Arequipa', numero: 2 },
  { id: 211, name: 'MARISOL CÁCERES PACHECO', party: 'FRENTE AMPLIO', logo: 'FA', color: '#e91e63', age: 46, profession: 'Periodista', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Arequipa', numero: 3 },
  { id: 212, name: 'ENRIQUE CUEVA MORÁN', party: 'ALIANZA NACIONAL', logo: 'AN', color: '#f57c00', age: 57, profession: 'Médico', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Piura', numero: 1 },
  { id: 213, name: 'DIANA ZAPATA SAAVEDRA', party: 'SOMOS PERÚ', logo: 'SP', color: '#ff6f00', age: 42, profession: 'Contadora', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Piura', numero: 2 },
  { id: 214, name: 'RODRIGO TEMOCHE SILVA', party: 'VAMOS PERÚ', logo: 'VP', color: '#7b1fa2', age: 48, profession: 'Economista', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: false, noNonPenalSentences: true, distrito: 'Piura', numero: 3 },
  { id: 215, name: 'YENY COAQUIRA MAMANI', party: 'DEMOCRACIA DIRECTA', logo: 'DD', color: '#00acc1', age: 36, profession: 'Educadora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Puno', numero: 1 },
  { id: 216, name: 'SANTOS APAZA CATACORA', party: 'PERÚ NACIÓN', logo: 'PN', color: '#1976d2', age: 61, profession: 'Agricultor', education: 'Técnico', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Puno', numero: 2 },
  { id: 217, name: 'GLADYS RAMOS TICONA', party: 'FUERZA CIUDADANA', logo: 'FC', color: '#f06292', age: 44, profession: 'Trabajadora social', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Puno', numero: 3 },
  { id: 218, name: 'ABEL RÍOS CONTRERAS', party: 'TODOS POR EL PERÚ', logo: 'TPP', color: '#5c6bc0', age: 50, profession: 'Abogado', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Junín', numero: 1 },
  { id: 219, name: 'NORMA PALOMINO CCANTO', party: 'FRENTE SOCIAL', logo: 'FS', color: '#ef5350', age: 39, profession: 'Ingeniera', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Junín', numero: 2 },
  { id: 220, name: 'WALDIR CÓNDOR BELLIDO', party: 'PERÚ PRIMERO', logo: 'PPR', color: '#0288d1', age: 55, profession: 'Empresario', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Junín', numero: 3 },
  { id: 221, name: 'ESPERANZA VARAS RODRÍGUEZ', party: 'PROGRESO PERÚ', logo: 'PP', color: '#e91e63', age: 47, profession: 'Educadora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'La Libertad', numero: 1 },
  { id: 222, name: 'JOSÉ SÁNCHEZ CHUNGA', party: 'ALIANZA PARA EL PROGRESO', logo: 'APP', color: '#2196f3', age: 53, profession: 'Médico', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: false, distrito: 'La Libertad', numero: 2 },
  { id: 223, name: 'LIDIA RAMIREZ POLO', party: 'ACCIÓN POPULAR', logo: 'AP', color: '#ff9800', age: 41, profession: 'Abogada', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true, distrito: 'La Libertad', numero: 3 },
  { id: 224, name: 'WILLIAM BURGA TELLO', party: 'FUERZA POPULAR', logo: 'FP', color: '#ff5722', age: 58, profession: 'Ingeniero', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Lambayeque', numero: 1 },
  { id: 225, name: 'CELIA LLONTOP FARFÁN', party: 'PERÚ LIBRE', logo: 'PL', color: '#f44336', age: 44, profession: 'Contadora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, distrito: 'Lambayeque', numero: 2 },
];

const parlamentoCandidates = [
  { id: 301, name: 'ELIZABETH VARGAS TORRES', party: 'PROGRESO PERÚ', logo: 'PP', color: '#e91e63', age: 52, profession: 'Diplomática', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Integración Andina' },
  { id: 302, name: 'MANUEL CONDORI QUISPE', party: 'ACCIÓN POPULAR', logo: 'AP', color: '#ff9800', age: 48, profession: 'Economista', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Comercio Internacional' },
  { id: 303, name: 'PATRICIA SALAZAR MÉNDEZ', party: 'ALIANZA PARA EL PROGRESO', logo: 'APP', color: '#2196f3', age: 44, profession: 'Abogada', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Derechos Humanos' },
  { id: 304, name: 'ARTURO MAMANI LAZO', party: 'JUNTOS POR EL PERÚ', logo: 'JPP', color: '#4caf50', age: 55, profession: 'Médico', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: false, enfoque: 'Salud Andina' },
  { id: 305, name: 'FÁTIMA HERRERA NÚÑEZ', party: 'PODEMOS PERÚ', logo: 'PODE', color: '#9c27b0', age: 39, profession: 'Ing. Ambiental', education: 'Universitario', experience: 'Ambos Sectores', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Medio Ambiente' },
  { id: 306, name: 'VÍCTOR LAZO CÁRDENAS', party: 'FUERZA POPULAR', logo: 'FP', color: '#ff5722', age: 61, profession: 'Empresario', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Desarrollo Económico' },
  { id: 307, name: 'CARMEN ALCALÁ VIDAL', party: 'RENOVACIÓN POPULAR', logo: 'RP', color: '#00bcd4', age: 46, profession: 'Politóloga', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Democracia Regional' },
  { id: 308, name: 'RENZO PAREDES OLIVOS', party: 'AVANZA PAÍS', logo: 'AVAN', color: '#3f51b5', age: 43, profession: 'Sociólogo', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Cultura e Identidad' },
  { id: 309, name: 'NORA TICONA FLORES', party: 'PERÚ LIBRE', logo: 'PL', color: '#f44336', age: 50, profession: 'Educadora', education: 'Universitario', experience: 'Sector Público', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Educación Andina' },
  { id: 310, name: 'CLAUDIO ZAPATA INGA', party: 'PARTIDO MORADO', logo: 'PM', color: '#673ab7', age: 37, profession: 'Tecnólogo', education: 'Universitario', experience: 'Sector Privado', noPenalSentences: true, noNonPenalSentences: true, enfoque: 'Innovación' },
];

type Candidate = {
  id: number; name: string; party: string; logo: string; color: string;
  age: number; profession: string; education: string; experience: string;
  noPenalSentences: boolean; noNonPenalSentences: boolean;
  numero?: number; distrito?: string; enfoque?: string;
};

type Role = 'diputados' | 'senadores' | 'parlamento';

interface CandidateListPageProps {
  role: Role;
  onNavigate: (page: string, id?: number, ids?: number[]) => void;
}

export function CandidateListPage({ role, onNavigate }: CandidateListPageProps) {
  const { t, language } = useLanguage();

  const [showFilters, setShowFilters] = useState(false);
  const [appliedParties, setAppliedParties] = useState<string[]>([]);
  const [appliedEducation, setAppliedEducation] = useState<string[]>([]);
  const [appliedExperience, setAppliedExperience] = useState<string[]>([]);
  const [appliedJudicial, setAppliedJudicial] = useState<string[]>([]);
  const [pendingParties, setPendingParties] = useState<string[]>([]);
  const [pendingEducation, setPendingEducation] = useState<string[]>([]);
  const [pendingExperience, setPendingExperience] = useState<string[]>([]);
  const [pendingJudicial, setPendingJudicial] = useState<string[]>([]);
  const [appliedDistrito, setAppliedDistrito] = useState<string[]>([]);
  const [pendingDistrito, setPendingDistrito] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'party'>('name');
  const [displayedCount, setDisplayedCount] = useState(10);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);

  const allCandidates: Candidate[] =
    role === 'senadores' ? senadoresCandidates :
    role === 'diputados' ? diputadosCandidates :
    parlamentoCandidates;

  const cfg = {
    diputados: {
      title: { es: 'Candidatos a Diputados', qu: 'Llaqta Kamachiq Akllakuqkuna' },
      subtitle: { es: 'Elecciones Generales 2026 — Cámara de Diputados', qu: 'Tukuy Llaqtaq Akllakuynin 2026 — Llaqta Kamachiqkuna' },
      seats: { es: '130 escaños — Distritos electorales departamentales', qu: '130 sillakuna — Suyu akllakuy wasikunapi' },
    },
    senadores: {
      title: { es: 'Candidatos al Senado', qu: 'Hatun Rimaq Akllakuqkuna' },
      subtitle: { es: 'Elecciones Generales 2026 — Cámara de Senadores', qu: 'Tukuy Llaqtaq Akllakuynin 2026 — Hatun Rimaqkuna' },
      seats: { es: '60 escaños — Distrito único nacional', qu: '60 sillakuna — Suyu hatun llaqta' },
    },
    parlamento: {
      title: { es: 'Candidatos al Parlamento Andino', qu: 'Antasuyu Kamachiq Akllakuqkuna' },
      subtitle: { es: 'Elecciones Generales 2026 — Parlamento Andino', qu: 'Tukuy Llaqtaq Akllakuynin 2026 — Antasuyu Kamachiqkuna' },
      seats: { es: '5 representantes — Distrito único nacional', qu: '5 Kamachiqkuna — Suyu hatun llaqta' },
    },
  }[role];

  const uniqueParties = Array.from(new Set(allCandidates.map(c => c.party))).sort();
  const uniqueDistritos = role === 'diputados'
    ? Array.from(new Set(diputadosCandidates.map(c => c.distrito!))).sort()
    : [];

  const toggleItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const handleOpenFilters = () => {
    if (!showFilters) {
      setPendingParties(appliedParties); setPendingEducation(appliedEducation);
      setPendingExperience(appliedExperience); setPendingJudicial(appliedJudicial);
      setPendingDistrito(appliedDistrito);
    }
    setShowFilters(!showFilters);
  };

  const handleApply = () => {
    setAppliedParties(pendingParties); setAppliedEducation(pendingEducation);
    setAppliedExperience(pendingExperience); setAppliedJudicial(pendingJudicial);
    setAppliedDistrito(pendingDistrito);
    setShowFilters(false);
    setDisplayedCount(10);
  };

  const handleClear = () => {
    const reset: string[] = [];
    setPendingParties(reset); setPendingEducation(reset); setPendingExperience(reset);
    setPendingJudicial(reset); setPendingDistrito(reset);
    setAppliedParties(reset); setAppliedEducation(reset); setAppliedExperience(reset);
    setAppliedJudicial(reset); setAppliedDistrito(reset);
    setDisplayedCount(10);
  };

  const filtered = allCandidates.filter(c => {
    if (appliedParties.length && !appliedParties.includes(c.party)) return false;
    if (appliedEducation.length && !appliedEducation.includes(c.education)) return false;
    if (appliedExperience.length && !appliedExperience.includes(c.experience)) return false;
    if (appliedJudicial.includes('noPenal') && !c.noPenalSentences) return false;
    if (appliedJudicial.includes('noNonPenal') && !c.noNonPenalSentences) return false;
    if (appliedDistrito.length && !appliedDistrito.includes((c as any).distrito ?? '')) return false;
    return true;
  }).sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : a.party.localeCompare(b.party));

  const displayed = filtered.slice(0, displayedCount);
  const hasMore = displayedCount < filtered.length;
  const showingAll = displayedCount >= filtered.length && filtered.length > 10;
  const activeFiltersCount = appliedParties.length + appliedEducation.length + appliedExperience.length + appliedJudicial.length + appliedDistrito.length;
  const pendingCount = pendingParties.length + pendingEducation.length + pendingExperience.length + pendingJudicial.length + pendingDistrito.length;

  const toggleCompareSelection = (id: number) => {
    if (!isCompareMode) return;
    setSelectedForCompare(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  // Shared filter chip
  const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left ${
        active
          ? 'bg-[#c41e3a] border-[#c41e3a] text-white shadow-sm'
          : 'bg-white border-gray-200 text-gray-700 hover:border-[#c41e3a]/50 hover:bg-red-50'
      }`}
    >
      <span className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${active ? 'bg-white border-white' : 'border-gray-300'}`}>
        {active && <Check size={10} className="text-[#c41e3a]" strokeWidth={3} />}
      </span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-[#c41e3a] font-medium text-lg mb-6 hover:gap-3 transition-all group focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded-lg px-2 py-1"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          {language === 'qu' ? 'Qallariman kutiy' : 'Volver al inicio'}
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{cfg.title[language]}</h1>
          <p className="text-xl text-gray-600">{cfg.subtitle[language]}</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-[#c41e3a]/10 text-[#c41e3a] px-4 py-1.5 rounded-full text-sm font-bold">
            🏛️ {cfg.seats[language]}
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col gap-4">
            {/* Top row */}
            <div className="flex flex-col lg:flex-row gap-4">
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
                <ChevronDown size={20} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'name' | 'party')}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl font-medium text-lg focus:border-[#c41e3a] focus:outline-none bg-white cursor-pointer"
              >
                <option value="name">{t('cand_sort')} {t('cand_sort_name')}</option>
                <option value="party">{t('cand_sort')} {t('cand_sort_party')}</option>
              </select>

              <button className="ml-auto px-6 py-4 rounded-xl font-bold text-lg flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white hover:from-violet-700 hover:to-purple-800 shadow-lg hover:scale-105 transition-all">
                <Sparkles size={22} aria-hidden="true" />
                EleccIA
              </button>
            </div>

            {/* Count + compare */}
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
              <p className="text-sm font-medium text-gray-600" aria-live="polite">
                {t('cand_showing')} <strong className="text-blue-600">{Math.min(displayedCount, filtered.length)}</strong> {t('cand_of')} <strong>{filtered.length}</strong> {t('cand_results')}
                {filtered.length < allCandidates.length && ` (${allCandidates.length} ${language === 'qu' ? 'tukuymanta' : 'en total'})`}
              </p>
              {!isCompareMode ? (
                <button
                  onClick={() => { setIsCompareMode(true); setSelectedForCompare([]); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
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
                    onClick={() => { setIsCompareMode(false); setSelectedForCompare([]); }}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all"
                  >
                    {t('cand_compare_exit')}
                  </button>
                  <button
                    onClick={() => { if (selectedForCompare.length === 2) onNavigate('comparar', undefined, selectedForCompare); }}
                    disabled={selectedForCompare.length !== 2}
                    aria-disabled={selectedForCompare.length !== 2}
                    className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 ${
                      selectedForCompare.length === 2
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm focus:ring-green-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <BarChart3 size={15} aria-hidden="true" />
                    {t('cand_compare_go')} ({selectedForCompare.length}/2)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              {/* Active pending tags */}
              {pendingCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[...pendingParties, ...pendingEducation, ...pendingExperience, ...pendingDistrito,
                    ...pendingJudicial.map(j => j === 'noPenal'
                      ? (language === 'qu' ? 'Huchayuq mana kan' : 'Sin sent. penales')
                      : (language === 'qu' ? 'Huk huchan mana kan' : 'Sin sent. no penales')),
                  ].map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-[#c41e3a]/10 text-[#c41e3a] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#c41e3a]/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Estudios */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
                    {t('cand_filter_education')}
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { val: 'Universitario', label_es: 'Universitario', label_qu: 'Yachaqwasi' },
                      { val: 'Técnico', label_es: 'Técnico', label_qu: 'Ruway Yachay' },
                    ].map(({ val, label_es, label_qu }) => (
                      <FilterChip key={val} label={language === 'qu' ? label_qu : label_es}
                        active={pendingEducation.includes(val)}
                        onClick={() => setPendingEducation(toggleItem(pendingEducation, val))} />
                    ))}
                  </div>
                </div>

                {/* Experiencia */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                    {t('cand_filter_experience')}
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { val: 'Sector Público', label_es: 'Sector Público', label_qu: 'Suyuq Llamk\'ay' },
                      { val: 'Sector Privado', label_es: 'Sector Privado', label_qu: 'Apuq Llamk\'ay' },
                      { val: 'Ambos Sectores', label_es: 'Ambos Sectores', label_qu: 'Iskaynin Llamk\'ay' },
                    ].map(({ val, label_es, label_qu }) => (
                      <FilterChip key={val} label={language === 'qu' ? label_qu : label_es}
                        active={pendingExperience.includes(val)}
                        onClick={() => setPendingExperience(toggleItem(pendingExperience, val))} />
                    ))}
                  </div>
                </div>

                {/* Judicial or Distrito */}
                <div>
                  {role === 'diputados' ? (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                        {language === 'qu' ? 'Suyu' : 'Distrito Electoral'}
                      </p>
                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                        {uniqueDistritos.map(d => (
                          <FilterChip key={d} label={d}
                            active={pendingDistrito.includes(d)}
                            onClick={() => setPendingDistrito(toggleItem(pendingDistrito, d))} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                        {t('cand_filter_judicial')}
                      </p>
                      <div className="space-y-1.5">
                        <FilterChip
                          label={language === 'qu' ? 'Huchayuq mana kan' : 'Sin sentencias penales firmes'}
                          active={pendingJudicial.includes('noPenal')}
                          onClick={() => setPendingJudicial(toggleItem(pendingJudicial, 'noPenal'))} />
                        <FilterChip
                          label={language === 'qu' ? 'Huk huchan mana kan' : 'Sin sentencias no penales firmes'}
                          active={pendingJudicial.includes('noNonPenal')}
                          onClick={() => setPendingJudicial(toggleItem(pendingJudicial, 'noNonPenal'))} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Partido */}
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                  {t('cand_filter_party')}
                  {pendingParties.length > 0 && (
                    <span className="ml-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-xs font-bold">{pendingParties.length} {language === 'qu' ? 'akllasqa' : 'seleccionados'}</span>
                  )}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
                  {uniqueParties.map(party => (
                    <FilterChip key={party} label={party}
                      active={pendingParties.includes(party)}
                      onClick={() => setPendingParties(toggleItem(pendingParties, party))} />
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              {(() => {
                const hasSelection = pendingCount > 0;
                return (
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={handleClear}
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <X size={14} aria-hidden="true" />
                      {t('cand_filter_clear')}
                    </button>
                    <button
                      onClick={handleApply}
                      disabled={!hasSelection}
                      aria-disabled={!hasSelection}
                      className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        hasSelection
                          ? 'bg-[#c41e3a] text-white hover:bg-[#a8152d] shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer ring-2 ring-[#c41e3a]/30 focus:ring-[#c41e3a]'
                          : 'bg-rose-100 text-rose-300 border border-rose-200 cursor-not-allowed'
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

        {/* ── CANDIDATE GRID — identical structure to CandidatesPageImproved ── */}
        {filtered.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {displayed.map((candidate, index) => {
                const isSelected = selectedForCompare.includes(candidate.id);
                const canSelect = selectedForCompare.length < 2 || isSelected;

                return (
                  <div
                    key={candidate.id}
                    className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 overflow-hidden group cursor-pointer animate-in fade-in relative flex flex-col ${
                      isSelected && isCompareMode
                        ? 'border-blue-500 ring-2 ring-blue-100 scale-105'
                        : 'border-transparent hover:border-[#c41e3a]'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => isCompareMode ? toggleCompareSelection(candidate.id) : undefined}
                  >
                    {/* Compare checkbox */}
                    {isCompareMode && (
                      <div className="absolute top-2 right-2 z-20">
                        <div className={`p-1.5 rounded-lg transition-all shadow-lg ${
                          isSelected
                            ? 'bg-blue-600 text-white scale-110'
                            : canSelect
                            ? 'bg-white text-gray-600 border-2 border-gray-300'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                        }`}>
                          {isSelected ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Circle size={20} strokeWidth={2} />}
                        </div>
                      </div>
                    )}

                    {/* Selected badge */}
                    {isSelected && isCompareMode && (
                      <div className="absolute top-2 left-2 z-20 bg-blue-600 text-white px-2 py-1 rounded-md font-bold text-xs shadow-lg flex items-center gap-1">
                        <Check size={14} aria-hidden="true" />
                        {language === 'qu' ? 'Akllasqa' : 'Seleccionado'}
                      </div>
                    )}

                    {/* Photo section — same gray gradient, circle avatar */}
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-36 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" aria-hidden="true" />
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-gray-600 text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform z-10">
                        {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                        {candidate.name}
                      </h3>

                      {/* Info pills */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700">
                          <Award size={12} aria-hidden="true" />
                          {candidate.age} {language === 'qu' ? 'wata' : 'años'}
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700">
                          <Briefcase size={12} aria-hidden="true" />
                          <span className="line-clamp-1">{candidate.profession}</span>
                        </div>
                      </div>

                      {/* Extra badges — distrito / enfoque / N° lista (fixed min height) */}
                      <div className="flex flex-wrap gap-1 mb-2 min-h-[1.25rem]">
                        {candidate.distrito && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            {candidate.distrito}
                          </span>
                        )}
                        {candidate.enfoque && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold line-clamp-1">
                            {candidate.enfoque}
                          </span>
                        )}
                        {candidate.numero !== undefined && (
                          <span className="text-xs bg-[#c41e3a]/10 text-[#c41e3a] px-2 py-0.5 rounded-full font-bold">
                            N° {candidate.numero}
                          </span>
                        )}
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

                        <button
                          className="w-full bg-gradient-to-r from-[#c41e3a] to-[#a01729] text-white py-2 rounded-lg font-bold text-sm hover:from-[#a01729] hover:to-[#8a1523] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 group-hover:gap-2"
                          onClick={e => { e.stopPropagation(); }}
                        >
                          <BookOpen size={16} aria-hidden="true" />
                          {language === 'qu' ? 'Munayta qhaway' : 'Ver Propuestas'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ver más */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setDisplayedCount(c => c + 10)}
                  className="bg-[#c41e3a] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#a01729] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
                  aria-label={`${t('cand_see_more')} (${filtered.length - displayedCount})`}
                >
                  <ChevronDown size={24} aria-hidden="true" />
                  {t('cand_see_more')}
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-sm" aria-hidden="true">
                    {filtered.length - displayedCount}
                  </span>
                </button>
              </div>
            )}

            {/* Ver menos */}
            {showingAll && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => { setDisplayedCount(10); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
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
              <Filter size={48} className="text-gray-400" aria-hidden="true" />
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-2">{t('cand_no_results')}</p>
            <p className="text-lg text-gray-600 mb-6">{t('cand_clear_filters')}</p>
            <button
              onClick={handleClear}
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
