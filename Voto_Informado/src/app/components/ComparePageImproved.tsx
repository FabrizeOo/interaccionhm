import { X, ArrowLeft, Info, RefreshCw, Check, Search, Filter as FilterIcon, User, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Quechua translations for the translatable fields of each candidate
const quTranslations: Record<number, {
  education: string;
  experience: string;
  proposals: { education: string; health: string; economy: string; security: string; environment: string };
}> = {
  1: {
    education: 'Qullqi Yachaq, Universidad Nacional Mayor de San Marcos',
    experience: '15 wata suyuq llamk\'aypi',
    proposals: {
      education: 'Yachay qullqita PBI-manta 6%-man hatunchiy, infraestructura hinallataq yachachiqkunata yacharichiy',
      health: '200 musuq qhali kay wasikunata llaqtakuna hinallataq barriopi ruway',
      economy: 'Uchuy hinallataq chawpi empresakunapaq impuestokuna pisichiy llamk\'ayta ruwaypaq',
      security: 'Policia equiponkuna musuqyachiy hinallataq chawpi llaqtakunapi qhawachiy',
      environment: 'Suyuq pachamamanta waqaychay hinallataq musuq energía yanapay',
    },
  },
  2: {
    education: 'Abogada, Pontificia Universidad Católica del Perú',
    experience: '10 wata congresista',
    proposals: {
      education: 'Yachachiqkunata yachachiy hinallataq yachay allin kananta qhawachiy',
      health: 'Tukuy Peru runakunapaq qhali kay aseguramiento',
      economy: 'Suyu lluqsiy ruwayta yanapay hinallataq llamk\'ay qhatiyta hatunchiy',
      security: 'Tukuy llaqtakunapi qhawana camaraskuna hinallataq justicia sistema allinchay',
      environment: 'Yaku waqaychay hinallataq sachakunata musuqmanta tarpuy',
    },
  },
  3: {
    education: 'Ingeniero Civil, Universidad Nacional de Ingeniería',
    experience: '20 wata llaqta kamachiypi',
    proposals: {
      education: 'Tukuy llaqta yachay wasikunapi mana qullqiwan internet hinallataq tablet',
      health: 'Lima, Arequipa, Trujillopi 3 hatun qhali kay wasikunata ruway',
      economy: 'Chakra llamk\'ayta yanapay qullqiwan hinallataq técnica yanapaywan',
      security: 'Policía sueldonkuna 30% hatunchiy hinallataq llamk\'ay allinchay',
      environment: 'Suyu reciclaje hinallataq musuq qullqi ruway yachay',
    },
  },
  4: {
    education: 'Administradora, Universidad de Lima',
    experience: '12 wata empresa kamachiypi',
    proposals: {
      education: 'Allin yachaqkunapaq llaqta yachaqwasikunapi tukuy yachay yanapay',
      health: 'Ñawpaq qhali kay wasikunata tukuy llaqtakunapi hatunchiy',
      economy: 'Impuestokuna pisichiy hinallataq empresa legalyachiy',
      security: 'Musuq tecnologíawan llaqta waqaychay sistema',
      environment: 'Allpa mama certificaciónwan empresakunapaq impuesto yanapay',
    },
  },
  5: {
    education: 'Médico Cirujano, Universidad Cayetano Heredia',
    experience: '18 wata llaqta qhali kaypi',
    proposals: {
      education: 'Técnica yachay hinallataq llamk\'aypaq yachay hatunchiy',
      health: 'Qhali kay sistema mayu llaqtakunaman hinallataq 24/7 qhawachiy',
      economy: 'Peru tech empresakunata yanapay',
      security: 'Saywa waqaychay hinallataq droga ruwaqkunawan lluchiy',
      environment: 'Amazonia hinallataq ñawpaq llaqtakuna waqaychay',
    },
  },
  6: {
    education: 'Yachachiq, Universidad Nacional del Altiplano',
    experience: '15 wata llaqta yachaypi',
    proposals: {
      education: 'Tukuy llaqta yachaqwasi mana qullqiwan',
      health: 'Hatun empresakunamanta impuestowanmi qullqichisqa 100% mana qullqiwan qhali kay',
      economy: 'Suyuq munaypi natural recursokunata churay',
      security: 'Policía tikray hinallataq llaqta justicia',
      environment: 'Allpa mama chakray hinallataq mikuy kamachiy',
    },
  },
  7: {
    education: 'Apuq Llamk\'aq, Universidad del Pacífico',
    experience: '25 wata apuq empresapi',
    proposals: {
      education: 'Suyuq hinallataq apuq alianzakuna yachay infraestructura allinchaypi',
      health: 'Llakisqa runakunapaq subsidiado privado seguro',
      economy: 'Estado pisichiy hinallataq apuq inversión yanapay',
      security: 'Hatun mana allin runaykupi lluchiy',
      environment: 'Empresa yanapaywan allin ruway',
    },
  },
  8: {
    education: 'Llaqta Qhawaq, Universidad de San Marcos',
    experience: '14 wata llaqta rurawaypi',
    proposals: {
      education: 'Suyu simi hinallataq runasimipim yachay llaqta wasikunapi',
      health: 'Ñawpaq yachay qhali kay sistemaman huñuy',
      economy: 'Tukuy yanapanakuy qullqi ruway hinallataq cooperativakunakuna',
      security: 'Llaqtapi mana allin ruway saywa',
      environment: 'Ñawpaq llaqtakuna allpa waqaychay',
    },
  },
  9: {
    education: 'Qullqi Qhawaq, Universidad Inca Garcilaso',
    experience: '16 wata suyuq qhawaypi',
    proposals: {
      education: 'Yachay kamachiy sut\'iyachiy hinallataq qhawachiy',
      health: 'Qhali kay sistema qhawachiy',
      economy: 'Suyuq qullqi tiyay waqaychay',
      security: 'Pantaywan lluchiy',
      environment: 'Allpa mama ley waqaychay',
    },
  },
  10: {
    education: 'Willakuq, Universidad de Lima',
    experience: '18 wata willakuy rurupi',
    proposals: {
      education: 'Yachay suyupi sut\'i willakuy',
      health: 'Hatun qhali kay yachachiy kampañakuna',
      economy: 'Sut\'i willakuy hinallataq mercado qullqi ruway',
      security: 'Hatun mana allin ruway qhawachiy willakuywan',
      environment: 'Suyuq allpa mama huchanmanta willakuy',
    },
  },
  11: {
    education: 'Industrial Ingeniero, UNI',
    experience: '20 wata empresa kamachiypi',
    proposals: {
      education: 'Musuq tecnología yachaypi',
      health: 'Telemedicina hinallataq digital qhali kay',
      economy: 'Peru tech industriata yanapay',
      security: 'Lisitu qhawana sistema',
      environment: 'Ch\'uya tecnología hinallataq lisitu llaqtakuna',
    },
  },
  12: {
    education: 'Llaqta Yachaq, PUCP',
    experience: '12 wata persona atiypi',
    proposals: {
      education: 'Persona atiy hinallataq llaqta kaq yachay',
      health: 'Llaki yuyay qhali kay ñawpaq kamachiy',
      economy: 'Warmi qullqi ruway hinallataq kutirichiy',
      security: 'Soldado pisichiy hinallataq justicia kutirichiy',
      environment: 'Pacha mama justicia hinallataq warmi-allpa mama',
    },
  },
  13: {
    education: 'Abogado, Universidad Católica',
    experience: '25 wata llaqta kamachiypi',
    proposals: {
      education: 'Meritocracia llaqta yachaypi',
      health: 'Suyu hospitalkuna allin kaqnin',
      economy: 'Huk suyukunawan alianzakuna',
      security: 'Suyu ranti droga ruwaqkunawan lluchiy',
      environment: 'Allpa mama suyu convenios',
    },
  },
  14: {
    education: 'Ex soldado, ESUP',
    experience: '20 wata soldadokunapi',
    proposals: {
      education: 'Yachay wasikunapi orden hinallataq valores',
      health: 'Soldado qhali kay llaqta runakunapaq',
      economy: 'Suyuq natural recursokunata waqaychay',
      security: 'Saywakunapi soldadokuna',
      environment: 'Soldadokunawan natural reservakuna waqaychay',
    },
  },
  15: {
    education: 'Política Yachaq, Universidad de Lima',
    experience: '10 wata política kamachiypi',
    proposals: {
      education: 'Llaqta runakunam yachay kamachiypi yapaykuq',
      health: 'Llaqta runakunam qhali kay kamachiy akllanku',
      economy: 'Qullqi ruway kamachiy referéndumkuna',
      security: 'Llaqta runakunam waqaychanku',
      environment: 'Allpa mama ruwaykunapaq plebiscitokunakuna',
    },
  },
  16: {
    education: 'Yachachiq, Universidad de Puno',
    experience: '18 wata llaqta yachaypi',
    proposals: {
      education: 'Internetwan allin llaqta yachay wasi',
      health: 'Karu llaqtakunapi qhali kay postokuna',
      economy: 'Chakra llamk\'ay allin ruway',
      security: 'Offisialiyasqa llaqta waqaykuna',
      environment: 'Andes yaku waqaychay',
    },
  },
  17: {
    education: 'Qullqi Yachaq, Universidad del Pacífico',
    experience: '22 wata BCRpi',
    proposals: {
      education: 'Ñawpaq yachay wasikunamantam qullqi yachay',
      health: 'BCR yanapaywan qhali kay seguro',
      economy: 'Qullqi tiyachiy hinallataq precio sayachiy',
      security: 'Qullqi sistema waqaychay',
      environment: 'Musuq bonos hinallataq qullqi allin ruway',
    },
  },
  18: {
    education: 'Llaki Yuyay Yachaq, UNMSM',
    experience: '15 wata llaqta qhali kaypi',
    proposals: {
      education: 'Munay yuyay yachay tukuyman',
      health: 'Tukuy runakunapaq mana qullqiwan llaki yuyay qhali kay',
      economy: 'Llamk\'ay allin kay hinallataq salud ocupacional',
      security: 'Llaki yuyay qhali kaywan ch\'aqwa saywa',
      environment: 'Naturalezawan tantanakuy psicología',
    },
  },
  19: {
    education: 'Evangelio Kamachiq, Seminario Teológico',
    experience: '25 wata llaqta llamk\'aypi',
    proposals: {
      education: 'Cristiano valores yachaypi',
      health: 'Mana aborto, kawsaytan',
      economy: 'Allin llamk\'ay hinallataq familia',
      security: 'Ley hinallataq orden moral principiokunawan',
      environment: 'Dios munayninmi kay allpata qamun, waqaychana',
    },
  },
  20: {
    education: 'Allpa Mama Yachaq, PUCP',
    experience: '12 wata waqaychaypi',
    proposals: {
      education: 'Allpa mama yachay tukuy ruwaykunapi',
      health: 'Ñawpaq qhali kay hinallataq allin kawsay',
      economy: 'Musuq qullqi ruway hinallataq allin llamk\'ay',
      security: 'Guardaparques hinallataq allpa mama waqaychay',
      environment: '2040 pachakamam carbono neutral',
    },
  },
  21: {
    education: 'Qhipa Ñawpa Yachaq, UNMSM',
    experience: '30 wata yachaqwasi yachachiypi',
    proposals: {
      education: 'Tukuy allin llaqta yachaqwasi mana qullqiwan',
      health: 'Qhali kay yachay llamk\'ay',
      economy: 'Industrialización hinallataq suyu wiñay',
      security: 'Suyuq munayninpi kawsay',
      environment: 'Natural pachamamantam suyuq munayninmi',
    },
  },
  22: {
    education: 'Kamachiy Yachaq, PUCP',
    experience: '18 wata kamachiy ruwaypi',
    proposals: {
      education: 'Musuq kamachiy qillqapi allin yachay atiy',
      health: 'Qhali kaym kamachiy atiyninmi',
      economy: 'Suyuq munayninpi natural recursokunata churay',
      security: 'Tukuy justicia sistema tikray',
      environment: 'Kamachiypi allpa mama waqaychay',
    },
  },
  23: {
    education: 'Apuq Llamk\'aq, ESAN',
    experience: '24 wata lluqsiypi',
    proposals: {
      education: 'Lluqsiy hinallataq qatiy llamk\'aypaq yachay',
      health: 'Apuq competitivo seguros',
      economy: 'TLC hinallataq qatiy kichariy',
      security: 'Huk suyumanta inversión waqaychay',
      environment: 'Suyu allpa mama certificaciones',
    },
  },
  24: {
    education: 'Willakuq, Universidad de Lima',
    experience: '16 wata ONGpi',
    proposals: {
      education: 'Sut\'iyachiy hinallataq llaqta yapaykuy yachaypi',
      health: 'Llaqta runakunam hospitalpim qhawanku',
      economy: 'Suyu presupuesto yapaykuy',
      security: 'Hatun capacidad barrio juntakuna',
      environment: 'Llaqta runakunam allpa mamata qhawanku',
    },
  },
  25: {
    education: 'Médico Cirujano, UPCH',
    experience: '26 wata llaqta qhali kaypi',
    proposals: {
      education: 'Ñawpaq qhali kay yachay',
      health: 'Qhali kay sistema tukuy tikray',
      economy: 'Hospital infraestructurapi invertiy',
      security: 'Qhali kay kamachiqkuna waqaychay',
      environment: 'Allpa mama qhali kay hinallataq ch\'aqwa saywa',
    },
  },
  26: {
    education: 'Llaqta Llamk\'aq, UNMSM',
    experience: '20 wata llaqta programakunapi',
    proposals: {
      education: 'Ñaqa runakunapaq yachaypi huñuchiy',
      health: 'Llakisqa runakunapaq tukuy qhali kay',
      economy: 'Allin hinallataq sut\'i llaqta programakuna',
      security: 'Familia ch\'aqwa saywa',
      environment: 'Natural recursokunata allin tiyachiy',
    },
  },
  27: {
    education: 'Sistema Ingeniero, UNI',
    experience: '12 wata tech suyupi',
    proposals: {
      education: 'Ñawpaq yachay wasikunamantam programación',
      health: 'Qhali kay tapuy IA',
      economy: 'Suyuq digital tikray',
      security: 'Suyu ciberseguridad',
      environment: 'Big data allpa mama qhawachiypi',
    },
  },
  28: {
    education: 'Qullqi Yachaq, PUCP',
    experience: '17 wata suyu yanapaypi',
    proposals: {
      education: 'Llaqta yachay',
      health: 'Llaqta ñawpaq qhali kay',
      economy: 'Yanapanakuy hinallataq allin qullqi ruway',
      security: 'Llaqtapi kaypi allin kawsay',
      environment: 'Tukuypaq kaypi waqaychay',
    },
  },
  29: {
    education: 'Chakra Llamk\'aq hinallataq Técnico Agropecuario',
    experience: '28 wata chakrapi',
    proposals: {
      education: 'Musuq chakra técnica yachay wasikuna',
      health: 'Natural hinallataq ñawpaq yachay qhali kay',
      economy: 'Suyu mikuy kamachiy',
      security: 'Chakra allpa waqaychay',
      environment: 'Orgánico chakra hinallataq agroecología',
    },
  },
  30: {
    education: 'Llaqta Kamachiq, PUCP',
    experience: '15 wata llaqta kamachiypi',
    proposals: {
      education: 'Ñawpaq yachaypi llaqta kamachiqkuna',
      health: 'Llaqta kamachiy 24/7 qhali kay wasikuna',
      economy: 'Llaqta wiñay qullqi ruway',
      security: 'Hatun serenazgo',
      environment: 'Llaqta kamachiqkunamanta allpa mama',
    },
  },
};

const mockCandidates = [
  {
    id: 1,
    name: 'JUAN CARLOS LÓPEZ RÍOS',
    party: 'PROGRESO PERÚ',
    logo: 'PP',
    color: '#e91e63',
    age: 52,
    education: 'Economista, Universidad Nacional Mayor de San Marcos',
    experience: '15 años en sector público',
    proposals: {
      education: 'Aumentar presupuesto educativo al 6% del PBI para mejorar infraestructura y capacitación docente',
      health: 'Crear 200 nuevos centros de salud en zonas rurales y urbano-marginales',
      economy: 'Reducir impuestos a pequeñas y medianas empresas para fomentar el empleo',
      security: 'Modernizar equipamiento policial y aumentar presencia en zonas críticas',
      environment: 'Protección de áreas naturales y promoción de energías renovables'
    }
  },
  {
    id: 2,
    name: 'MARÍA ISABEL GARCÍA TORRES',
    party: 'ALIANZA PARA EL PROGRESO',
    logo: 'APP',
    color: '#2196f3',
    age: 48,
    education: 'Abogada, Pontificia Universidad Católica del Perú',
    experience: '10 años como congresista',
    proposals: {
      education: 'Capacitación docente continua y evaluación permanente de calidad educativa',
      health: 'Seguro de salud universal con cobertura integral para todos los peruanos',
      economy: 'Impulsar exportaciones regionales y fortalecer cadenas productivas',
      security: 'Cámaras de vigilancia en todas las ciudades y mejora del sistema judicial',
      environment: 'Gestión sostenible de recursos hídricos y reforestación nacional'
    }
  },
  {
    id: 3,
    name: 'CARLOS ALBERTO MENDOZA',
    party: 'ACCIÓN POPULAR',
    logo: 'AP',
    color: '#ff9800',
    age: 55,
    education: 'Ingeniero Civil, Universidad Nacional de Ingeniería',
    experience: '20 años en gestión pública',
    proposals: {
      education: 'Internet gratuito en todas las escuelas públicas y tablets para estudiantes',
      health: 'Construir 3 hospitales especializados en Lima, Arequipa y Trujillo',
      economy: 'Reactivar agricultura familiar con créditos blandos y asistencia técnica',
      security: 'Incrementar sueldos policiales en 30% y mejorar condiciones laborales',
      environment: 'Plan nacional de reciclaje y economía circular'
    }
  },
  {
    id: 4,
    name: 'ANA PATRICIA ROJAS',
    party: 'FUERZA POPULAR',
    logo: 'FP',
    color: '#ff5722',
    age: 45,
    education: 'Administradora, Universidad de Lima',
    experience: '12 años en gestión empresarial',
    proposals: {
      education: 'Becas completas para estudiantes destacados en universidades públicas',
      health: 'Ampliar red de centros de atención primaria en todo el país',
      economy: 'Simplificación tributaria y apoyo a la formalización empresarial',
      security: 'Sistema integrado de seguridad ciudadana con tecnología avanzada',
      environment: 'Incentivos fiscales para empresas con certificación ambiental'
    }
  },
  {
    id: 5,
    name: 'ROBERTO PÉREZ SILVA',
    party: 'PODEMOS PERÚ',
    logo: 'PODE',
    color: '#9c27b0',
    age: 50,
    education: 'Médico Cirujano, Universidad Cayetano Heredia',
    experience: '18 años en salud pública',
    proposals: {
      education: 'Fortalecimiento de la educación técnica y formación para el trabajo',
      health: 'Descentralización del sistema de salud y atención de emergencias 24/7',
      economy: 'Apoyo a startups y empresas tecnológicas peruanas',
      security: 'Reforzamiento de fronteras y lucha contra el narcotráfico',
      environment: 'Protección de la Amazonía y comunidades nativas'
    }
  },
  {
    id: 6,
    name: 'LUCÍA FERNÁNDEZ',
    party: 'PERÚ LIBRE',
    logo: 'PL',
    color: '#f44336',
    age: 43,
    education: 'Educadora, Universidad Nacional del Altiplano',
    experience: '15 años en educación rural',
    proposals: {
      education: 'Gratuidad total de la educación superior universitaria pública',
      health: 'Sistema de salud 100% gratuito financiado por impuestos a grandes empresas',
      economy: 'Nacionalización de recursos naturales estratégicos',
      security: 'Reforma policial y justicia comunitaria',
      environment: 'Agricultura ecológica y soberanía alimentaria'
    }
  },
  {
    id: 7,
    name: 'MIGUEL ÁNGEL TORRES',
    party: 'RENOVACIÓN POPULAR',
    logo: 'RP',
    color: '#00bcd4',
    age: 58,
    education: 'Empresario, Universidad del Pacífico',
    experience: '25 años en sector privado',
    proposals: {
      education: 'Alianzas público-privadas para mejorar infraestructura educativa',
      health: 'Seguro privado subsidiado para sectores vulnerables',
      economy: 'Reducción del Estado y promoción de la inversión privada',
      security: 'Mano dura contra la delincuencia y el crimen organizado',
      environment: 'Desarrollo sostenible con participación empresarial'
    }
  },
  {
    id: 8,
    name: 'CARMEN ROSA VALDEZ',
    party: 'JUNTOS POR EL PERÚ',
    logo: 'JPP',
    color: '#4caf50',
    age: 47,
    education: 'Socióloga, Universidad de San Marcos',
    experience: '14 años en movimientos sociales',
    proposals: {
      education: 'Educación intercultural y bilingüe en zonas rurales',
      health: 'Medicina tradicional integrada al sistema de salud',
      economy: 'Economía solidaria y cooperativas populares',
      security: 'Prevención comunitaria del delito',
      environment: 'Protección de territorios indígenas'
    }
  },
  {
    id: 9,
    name: 'JOSÉ ANTONIO QUISPE',
    party: 'SOMOS PERÚ',
    logo: 'SP',
    color: '#ff6f00',
    age: 51,
    education: 'Contador, Universidad Inca Garcilaso',
    experience: '16 años en auditoría pública',
    proposals: {
      education: 'Transparencia en gestión educativa y rendición de cuentas',
      health: 'Auditorías permanentes a sistema de salud',
      economy: 'Control estricto del gasto público',
      security: 'Lucha frontal contra la corrupción',
      environment: 'Fiscalización ambiental rigurosa'
    }
  },
  {
    id: 10,
    name: 'ELENA MORALES CASTRO',
    party: 'AVANZA PAÍS',
    logo: 'AVAN',
    color: '#3f51b5',
    age: 44,
    education: 'Periodista, Universidad de Lima',
    experience: '18 años en medios de comunicación',
    proposals: {
      education: 'Transparencia informativa en sector educativo',
      health: 'Campañas masivas de prevención y educación sanitaria',
      economy: 'Libertad de prensa y economía de mercado',
      security: 'Investigación periodística contra el crimen',
      environment: 'Información pública sobre contaminación'
    }
  },
  {
    id: 11,
    name: 'RAÚL MENDOZA GARCÍA',
    party: 'PARTIDO MORADO',
    logo: 'PM',
    color: '#673ab7',
    age: 49,
    education: 'Ingeniero Industrial, UNI',
    experience: '20 años en gestión empresarial',
    proposals: {
      education: 'Innovación tecnológica en educación',
      health: 'Telemedicina y salud digital',
      economy: 'Impulso a industria tecnológica nacional',
      security: 'Sistema de vigilancia inteligente',
      environment: 'Tecnología limpia y ciudades inteligentes'
    }
  },
  {
    id: 12,
    name: 'PATRICIA LEÓN FLORES',
    party: 'FRENTE AMPLIO',
    logo: 'FA',
    color: '#e91e63',
    age: 42,
    education: 'Antropóloga, PUCP',
    experience: '12 años en derechos humanos',
    proposals: {
      education: 'Educación en derechos humanos y ciudadanía',
      health: 'Salud mental como prioridad nacional',
      economy: 'Economía feminista y redistribución',
      security: 'Desmilitarización y justicia restaurativa',
      environment: 'Justicia climática y ecofeminismo'
    }
  },
  {
    id: 13,
    name: 'EDUARDO RAMOS SILVA',
    party: 'ALIANZA NACIONAL',
    logo: 'AN',
    color: '#f57c00',
    age: 56,
    education: 'Abogado, Universidad Católica',
    experience: '25 años en administración pública',
    proposals: {
      education: 'Meritocracia en educación pública',
      health: 'Hospitales regionales de primer nivel',
      economy: 'Alianzas estratégicas internacionales',
      security: 'Lucha contra narcotráfico transnacional',
      environment: 'Convenios internacionales ambientales'
    }
  },
  {
    id: 14,
    name: 'SANDRA VARGAS CONDE',
    party: 'PERÚ PATRIA SEGURA',
    logo: 'PPS',
    color: '#455a64',
    age: 48,
    education: 'Ex militar, ESUP',
    experience: '20 años en fuerzas armadas',
    proposals: {
      education: 'Disciplina y valores en escuelas',
      health: 'Sanidad militar para civiles',
      economy: 'Defensa de recursos naturales estratégicos',
      security: 'Militarización de fronteras',
      environment: 'Protección militar de reservas naturales'
    }
  },
  {
    id: 15,
    name: 'MARIO CASTRO DÁVILA',
    party: 'DEMOCRACIA DIRECTA',
    logo: 'DD',
    color: '#00acc1',
    age: 40,
    education: 'Politólogo, Universidad de Lima',
    experience: '10 años en consultoría política',
    proposals: {
      education: 'Participación ciudadana en gestión educativa',
      health: 'Consultas populares sobre políticas de salud',
      economy: 'Referéndums para decisiones económicas',
      security: 'Vigilancia ciudadana organizada',
      environment: 'Plebiscitos sobre proyectos ambientales'
    }
  },
  {
    id: 16,
    name: 'ROSA CHÁVEZ MAMANI',
    party: 'UNIÓN POR EL PERÚ',
    logo: 'UPP',
    color: '#d32f2f',
    age: 46,
    education: 'Educadora, Universidad de Puno',
    experience: '18 años en educación rural',
    proposals: {
      education: 'Escuela rural de calidad con internet',
      health: 'Puestos de salud en comunidades alejadas',
      economy: 'Agricultura familiar sostenible',
      security: 'Rondas campesinas oficializadas',
      environment: 'Conservación de recursos hídricos andinos'
    }
  },
  {
    id: 17,
    name: 'ALBERTO FLORES NÚÑEZ',
    party: 'PERÚ NACIÓN',
    logo: 'PN',
    color: '#1976d2',
    age: 53,
    education: 'Economista, Universidad del Pacífico',
    experience: '22 años en banca central',
    proposals: {
      education: 'Educación financiera desde primaria',
      health: 'Seguro de salud con respaldo del BCR',
      economy: 'Estabilidad monetaria y control inflacionario',
      security: 'Protección de sistema financiero',
      environment: 'Bonos verdes y financiamiento sostenible'
    }
  },
  {
    id: 18,
    name: 'JULIA MENDOZA RÍOS',
    party: 'VAMOS PERÚ',
    logo: 'VP',
    color: '#7b1fa2',
    age: 41,
    education: 'Psicóloga, UNMSM',
    experience: '15 años en salud pública',
    proposals: {
      education: 'Educación socioemocional obligatoria',
      health: 'Salud mental gratuita para todos',
      economy: 'Bienestar laboral y salud ocupacional',
      security: 'Prevención de violencia desde la salud mental',
      environment: 'Ecopsicología y conexión con naturaleza'
    }
  },
  {
    id: 19,
    name: 'FERNANDO GARCÍA SOTO',
    party: 'RESTAURACIÓN NACIONAL',
    logo: 'RN',
    color: '#558b2f',
    age: 54,
    education: 'Pastor evangélico, seminario teológico',
    experience: '25 años en labor social',
    proposals: {
      education: 'Valores cristianos en educación',
      health: 'No al aborto, sí a la vida',
      economy: 'Trabajo digno y familia',
      security: 'Ley y orden con principios morales',
      environment: 'Creación como don de Dios a cuidar'
    }
  },
  {
    id: 20,
    name: 'ANDREA SILVA CAMPOS',
    party: 'PARTIDO VERDE',
    logo: 'PV',
    color: '#388e3c',
    age: 39,
    education: 'Bióloga, PUCP',
    experience: '12 años en conservación',
    proposals: {
      education: 'Educación ambiental transversal',
      health: 'Medicina preventiva y vida saludable',
      economy: 'Economía verde y empleos sostenibles',
      security: 'Guardaparques y protección ambiental',
      environment: 'Carbono neutral para 2040'
    }
  },
  {
    id: 21,
    name: 'RICARDO TORRES PÉREZ',
    party: 'PERÚ LIBRE DEMOCRÁTICO',
    logo: 'PLD',
    color: '#e65100',
    age: 57,
    education: 'Historiador, UNMSM',
    experience: '30 años en docencia universitaria',
    proposals: {
      education: 'Universidad pública gratuita de excelencia',
      health: 'Investigación científica en salud',
      economy: 'Industrialización y desarrollo nacional',
      security: 'Soberanía y autodeterminación',
      environment: 'Patrimonio natural como bien nacional'
    }
  },
  {
    id: 22,
    name: 'MÓNICA HERRERA CASTRO',
    party: 'NUEVA CONSTITUCIÓN',
    logo: 'NC',
    color: '#c2185b',
    age: 45,
    education: 'Constitucionalista, PUCP',
    experience: '18 años en derecho constitucional',
    proposals: {
      education: 'Derecho a educación de calidad en nueva carta magna',
      health: 'Salud como derecho fundamental constitucional',
      economy: 'Recursos naturales en manos del Estado',
      security: 'Reforma total del sistema judicial',
      environment: 'Protección ambiental constitucional'
    }
  },
  {
    id: 23,
    name: 'LUIS PACHECO ROJAS',
    party: 'PERÚ PRIMERO',
    logo: 'PPR',
    color: '#0288d1',
    age: 50,
    education: 'Empresario, ESAN',
    experience: '24 años en exportación',
    proposals: {
      education: 'Formación para exportación y comercio',
      health: 'Seguros privados competitivos',
      economy: 'TLC y apertura comercial',
      security: 'Protección de inversión extranjera',
      environment: 'Certificaciones ambientales internacionales'
    }
  },
  {
    id: 24,
    name: 'ISABEL ROJAS VEGA',
    party: 'FUERZA CIUDADANA',
    logo: 'FC',
    color: '#f06292',
    age: 43,
    education: 'Comunicadora social, Universidad de Lima',
    experience: '16 años en ONG',
    proposals: {
      education: 'Transparencia y participación en educación',
      health: 'Veeduría ciudadana en hospitales',
      economy: 'Presupuesto participativo nacional',
      security: 'Juntas vecinales empoderadas',
      environment: 'Vigilancia ambiental ciudadana'
    }
  },
  {
    id: 25,
    name: 'HERNÁN SALAS DÍAZ',
    party: 'TODOS POR EL PERÚ',
    logo: 'TPP',
    color: '#5c6bc0',
    age: 52,
    education: 'Médico cirujano, UPCH',
    experience: '26 años en salud pública',
    proposals: {
      education: 'Educación en salud preventiva',
      health: 'Reforma integral del sistema de salud',
      economy: 'Inversión en infraestructura hospitalaria',
      security: 'Protección del personal de salud',
      environment: 'Salud ambiental y control de contaminantes'
    }
  },
  {
    id: 26,
    name: 'GLORIA NÚÑEZ PAREDES',
    party: 'PERÚ UNIDO',
    logo: 'PU',
    color: '#ab47bc',
    age: 47,
    education: 'Trabajadora social, UNMSM',
    experience: '20 años en programas sociales',
    proposals: {
      education: 'Inclusión educativa para personas con discapacidad',
      health: 'Atención integral a poblaciones vulnerables',
      economy: 'Programas sociales eficientes y transparentes',
      security: 'Prevención de violencia intrafamiliar',
      environment: 'Acceso equitativo a recursos naturales'
    }
  },
  {
    id: 27,
    name: 'JORGE VELÁSQUEZ ARIAS',
    party: 'CAMBIO RADICAL',
    logo: 'CR',
    color: '#26a69a',
    age: 38,
    education: 'Ingeniero de sistemas, UNI',
    experience: '12 años en sector tech',
    proposals: {
      education: 'Programación desde primaria',
      health: 'Inteligencia artificial en diagnóstico médico',
      economy: 'Transformación digital del Estado',
      security: 'Ciberseguridad nacional',
      environment: 'Big data para monitoreo ambiental'
    }
  },
  {
    id: 28,
    name: 'CECILIA RAMOS TORRES',
    party: 'FRENTE SOCIAL',
    logo: 'FS',
    color: '#ef5350',
    age: 44,
    education: 'Economista social, PUCP',
    experience: '17 años en cooperación internacional',
    proposals: {
      education: 'Educación popular y comunitaria',
      health: 'Atención primaria comunitaria',
      economy: 'Economía de solidaridad y bien común',
      security: 'Construcción de paz desde lo local',
      environment: 'Defensa de bienes comunes'
    }
  },
  {
    id: 29,
    name: 'VÍCTOR PAREDES OCHOA',
    party: 'ALIANZA POPULAR',
    logo: 'APOP',
    color: '#ff7043',
    age: 55,
    education: 'Agricultor y técnico agropecuario',
    experience: '28 años en agricultura',
    proposals: {
      education: 'Escuelas técnicas agrarias modernas',
      health: 'Medicina natural y tradicional',
      economy: 'Soberanía alimentaria nacional',
      security: 'Protección de tierras agrícolas',
      environment: 'Agricultura orgánica y agroecología'
    }
  },
  {
    id: 30,
    name: 'DIANA CAMPOS QUISPE',
    party: 'PERÚ PROGRESA',
    logo: 'PP2',
    color: '#42a5f5',
    age: 41,
    education: 'Administradora pública, PUCP',
    experience: '15 años en gestión municipal',
    proposals: {
      education: 'Municipios a cargo de educación inicial',
      health: 'Centros de salud municipales 24/7',
      economy: 'Desarrollo económico local',
      security: 'Serenazgo fortalecido',
      environment: 'Gestión ambiental desde municipios'
    }
  },
];

interface ComparePageImprovedProps {
  onNavigate: (page: string, candidateId?: number, selectedIds?: number[]) => void;
  preSelectedIds?: number[];
}

export function ComparePageImproved({ onNavigate, preSelectedIds = [] }: ComparePageImprovedProps) {
  const { t, language } = useLanguage();

  // Returns the candidate with fields translated to the current language
  const localize = (c: typeof mockCandidates[0]) => {
    if (language === 'qu') {
      const qu = quTranslations[c.id];
      if (qu) return { ...c, education: qu.education, experience: qu.experience, proposals: qu.proposals };
    }
    return c;
  };
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>(
    preSelectedIds.length >= 2 ? preSelectedIds.slice(0, 2) : [1, 2]
  );
  const [isSelectingCandidate, setIsSelectingCandidate] = useState(false);
  const [slotToReplace, setSlotToReplace] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartyFilter, setSelectedPartyFilter] = useState('');
  const [activeSection, setActiveSection] = useState<'hoja-vida' | 'plan-gobierno'>('hoja-vida');

  useEffect(() => {
    if (preSelectedIds.length >= 2) {
      setSelectedCandidates(preSelectedIds.slice(0, 2));
    }
  }, [preSelectedIds]);

  const selected = mockCandidates.filter(c => selectedCandidates.includes(c.id)).map(localize);
  const availableCandidates = mockCandidates
    .filter(c => !selectedCandidates.includes(c.id))
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.party.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesParty = !selectedPartyFilter || c.party === selectedPartyFilter;
      return matchesSearch && matchesParty;
    })
    .map(localize);

  const uniqueParties = Array.from(new Set(mockCandidates.map(c => c.party))).sort();

  const handleChangeCandidate = (slot: number) => {
    setSlotToReplace(slot);
    setIsSelectingCandidate(true);
    setSearchTerm('');
    setSelectedPartyFilter('');
  };

  const handleSelectNewCandidate = (newCandidateId: number) => {
    if (slotToReplace !== null) {
      const newSelection = [...selectedCandidates];
      newSelection[slotToReplace] = newCandidateId;
      setSelectedCandidates(newSelection);
      setIsSelectingCandidate(false);
      setSlotToReplace(null);
    }
  };

  const handleSwapCandidates = () => {
    setSelectedCandidates([selectedCandidates[1], selectedCandidates[0]]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('presidentes')}
          className="flex items-center gap-2 text-[#c41e3a] font-medium text-lg mb-6 hover:gap-3 transition-all group focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded-lg px-2 py-1"
          aria-label={t('cand_back')}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          {t('cand_back')}
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t('comp_title')}</h1>
          <p className="text-xl text-gray-600">{t('comp_subtitle')}</p>
        </div>

        {/* Candidate Selector Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[0, 1].map((slot) => {
            const candidate = selected[slot];

            return (
              <div
                key={slot}
                className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all"
              >
                {candidate ? (
                  <>
                    {/* Header with number */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#c41e3a] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                          {slot + 1}
                        </div>
                        <span className="font-bold text-gray-700 text-lg">{t('comp_candidate_n')} {slot + 1}</span>
                      </div>
                      <button
                        onClick={() => handleChangeCandidate(slot)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <RefreshCw size={18} aria-hidden="true" />
                        {t('comp_change')}
                      </button>
                    </div>

                    {/* Candidate Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                          style={{ backgroundColor: candidate.color }}
                        >
                          {candidate.logo}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{candidate.name}</h3>
                          <p className="text-sm text-gray-600 font-medium">{candidate.party}</p>
                        </div>
                      </div>

                      <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-500 min-w-[80px]">{t('comp_age')}</span>
                          <span className="text-sm text-gray-700 font-medium">{candidate.age} {t('cand_years')}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-500 min-w-[80px]">{t('comp_education_label')}</span>
                          <span className="text-sm text-gray-700">{candidate.education}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-500 min-w-[80px]">{t('comp_experience_label')}</span>
                          <span className="text-sm text-gray-700">{candidate.experience}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl text-gray-400">?</span>
                    </div>
                    <p className="text-gray-500 mb-4">{t('comp_select_prompt')}</p>
                    <button
                      onClick={() => handleChangeCandidate(slot)}
                      className="bg-[#c41e3a] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#a01729] transition-colors focus:outline-none focus:ring-4 focus:ring-[#c41e3a] focus:ring-offset-2"
                    >
                      {t('comp_select_btn')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Swap Button */}
        {selected.length === 2 && (
          <div className="flex justify-center mb-8">
            
          </div>
        )}

        {/* Section Navigation */}
        {selected.length === 2 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 overflow-hidden">
            <div className="grid grid-cols-2">
              <button
                onClick={() => setActiveSection('hoja-vida')}
                className={`flex items-center justify-center gap-3 px-6 py-5 font-bold text-lg transition-all ${
                  activeSection === 'hoja-vida'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <User size={24} aria-hidden="true" />
                <span>{t('comp_resume')}</span>
              </button>
              <button
                onClick={() => setActiveSection('plan-gobierno')}
                aria-selected={activeSection === 'plan-gobierno'}
                className={`flex items-center justify-center gap-3 px-6 py-5 font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${
                  activeSection === 'plan-gobierno'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText size={24} aria-hidden="true" />
                <span>{t('comp_gov_plan')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Hoja de Vida Section */}
        {selected.length === 2 && activeSection === 'hoja-vida' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <User size={32} aria-hidden="true" />
                <h2 className="text-3xl font-bold">{t('comp_resume')}</h2>
              </div>
              <p className="text-center text-white/90">{t('comp_resume_desc')}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {/* Personal Info Header */}
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                    <td colSpan={3} className="p-5 text-center">
                      <h3 className="text-2xl font-bold text-white">{t('comp_personal_info')}</h3>
                    </td>
                  </tr>

                  {/* Age */}
                  <tr className="border-b-2 border-gray-200">
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-blue-50 rounded-xl p-6 h-full border-l-4 border-blue-500">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">👤</span>
                          <h4 className="font-bold text-gray-700 text-lg">{t('comp_age_label')}</h4>
                        </div>
                        <p className="text-gray-800 text-2xl font-bold">{selected[0].age} {t('cand_years')}</p>
                      </div>
                    </td>
                    <td className="w-12 bg-gradient-to-b from-blue-100 to-transparent"></td>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-blue-50 rounded-xl p-6 h-full border-r-4 border-blue-500">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">👤</span>
                          <h4 className="font-bold text-gray-700 text-lg">{t('comp_age_label')}</h4>
                        </div>
                        <p className="text-gray-800 text-2xl font-bold">{selected[1].age} {t('cand_years')}</p>
                      </div>
                    </td>
                  </tr>

                  {/* Education Header */}
                  <tr className="bg-gradient-to-r from-purple-500 to-purple-600">
                    <td colSpan={3} className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">🎓</span>
                        <h3 className="text-2xl font-bold text-white">{t('comp_edu_header')}</h3>
                      </div>
                    </td>
                  </tr>

                  {/* Education Content */}
                  <tr className="border-b-2 border-gray-200">
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-purple-50 rounded-xl p-6 h-full border-l-4 border-purple-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[0].education}</p>
                      </div>
                    </td>
                    <td className="w-12 bg-gradient-to-b from-purple-100 to-transparent"></td>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-purple-50 rounded-xl p-6 h-full border-r-4 border-purple-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[1].education}</p>
                      </div>
                    </td>
                  </tr>

                  {/* Experience Header */}
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600">
                    <td colSpan={3} className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">💼</span>
                        <h3 className="text-2xl font-bold text-white">{t('comp_exp_header')}</h3>
                      </div>
                    </td>
                  </tr>

                  {/* Experience Content */}
                  <tr>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-orange-50 rounded-xl p-6 h-full border-l-4 border-orange-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[0].experience}</p>
                      </div>
                    </td>
                    <td className="w-12 bg-gradient-to-b from-orange-100 to-transparent"></td>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-orange-50 rounded-xl p-6 h-full border-r-4 border-orange-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[1].experience}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Next Section CTA */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t-2 border-green-200 p-6">
              <button
                onClick={() => setActiveSection('plan-gobierno')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <FileText size={24} aria-hidden="true" />
                {t('comp_see_plan')}
                <span className="text-2xl" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Plan de Gobierno Section */}
        {selected.length === 2 && activeSection === 'plan-gobierno' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <FileText size={32} aria-hidden="true" />
                <h2 className="text-3xl font-bold">{t('comp_gov_plan')}</h2>
              </div>
              <p className="text-center text-white/90">{t('comp_plan_desc')}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Education */}
                <tbody>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600">
                    <td colSpan={3} className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">📚</span>
                        <h3 className="text-2xl font-bold text-white">{t('comp_edu_header')}</h3>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-200">
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-blue-50 rounded-xl p-6 h-full border-l-4 border-blue-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[0].proposals.education}</p>
                      </div>
                    </td>
                    <td className="w-12 bg-gradient-to-b from-blue-100 to-transparent"></td>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-blue-50 rounded-xl p-6 h-full border-r-4 border-blue-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[1].proposals.education}</p>
                      </div>
                    </td>
                  </tr>

                  {/* Health */}
                  <tr className="bg-gradient-to-r from-red-500 to-red-600">
                    <td colSpan={3} className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">🏥</span>
                        <h3 className="text-2xl font-bold text-white">{t('comp_health_header')}</h3>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-200">
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-red-50 rounded-xl p-6 h-full border-l-4 border-red-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[0].proposals.health}</p>
                      </div>
                    </td>
                    <td className="w-12 bg-gradient-to-b from-red-100 to-transparent"></td>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-red-50 rounded-xl p-6 h-full border-r-4 border-red-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[1].proposals.health}</p>
                      </div>
                    </td>
                  </tr>

                  {/* Economy */}
                  <tr className="bg-gradient-to-r from-green-500 to-green-600">
                    <td colSpan={3} className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">💼</span>
                        <h3 className="text-2xl font-bold text-white">{t('comp_economy_header')}</h3>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-200">
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-green-50 rounded-xl p-6 h-full border-l-4 border-green-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[0].proposals.economy}</p>
                      </div>
                    </td>
                    <td className="w-12 bg-gradient-to-b from-green-100 to-transparent"></td>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-green-50 rounded-xl p-6 h-full border-r-4 border-green-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[1].proposals.economy}</p>
                      </div>
                    </td>
                  </tr>

                  {/* Security */}
                  <tr className="bg-gradient-to-r from-purple-500 to-purple-600">
                    <td colSpan={3} className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">🛡️</span>
                        <h3 className="text-2xl font-bold text-white">{t('comp_security_header')}</h3>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b-2 border-gray-200">
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-purple-50 rounded-xl p-6 h-full border-l-4 border-purple-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[0].proposals.security}</p>
                      </div>
                    </td>
                    <td className="w-12 bg-gradient-to-b from-purple-100 to-transparent"></td>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-purple-50 rounded-xl p-6 h-full border-r-4 border-purple-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[1].proposals.security}</p>
                      </div>
                    </td>
                  </tr>

                  {/* Environment */}
                  <tr className="bg-gradient-to-r from-teal-500 to-teal-600">
                    <td colSpan={3} className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">🌱</span>
                        <h3 className="text-2xl font-bold text-white">{t('comp_env_header')}</h3>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-teal-50 rounded-xl p-6 h-full border-l-4 border-teal-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[0].proposals.environment}</p>
                      </div>
                    </td>
                    <td className="w-12 bg-gradient-to-b from-teal-100 to-transparent"></td>
                    <td className="w-1/2 p-8 align-top">
                      <div className="bg-teal-50 rounded-xl p-6 h-full border-r-4 border-teal-500">
                        <p className="text-gray-800 text-lg leading-relaxed">{selected[1].proposals.environment}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Back to Hoja de Vida CTA */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-200 p-6">
              <button
                onClick={() => setActiveSection('hoja-vida')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <span className="text-2xl" aria-hidden="true">←</span>
                <User size={24} aria-hidden="true" />
                {t('comp_back_resume')}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selected.length < 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">⚖️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('comp_empty_title')}</h3>
              <p className="text-lg text-gray-600 mb-6">{t('comp_empty_desc')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Selection Modal */}
      {isSelectingCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in flex flex-col">
            {/* Modal Header - Compact */}
            <div className="bg-gradient-to-r from-[#c41e3a] to-[#a01729] text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                  {(slotToReplace ?? 0) + 1}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t('comp_modal_title')} - {(slotToReplace ?? 0) + 1}</h2>
                  <p className="text-sm text-white/80">{t('comp_select_prompt')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSelectingCandidate(false);
                  setSlotToReplace(null);
                }}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Bar - Fixed at top */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t('comp_modal_search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg text-base focus:border-[#c41e3a] focus:outline-none transition-colors"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Filters - Collapsible */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FilterIcon size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-700 text-sm">{t('comp_modal_party')}</span>
                  {selectedPartyFilter && (
                    <span className="bg-[#c41e3a] text-white px-3 py-1 rounded-full text-xs font-medium">
                      {selectedPartyFilter}
                    </span>
                  )}
                </div>
                {selectedPartyFilter && (
                  <button
                    onClick={() => setSelectedPartyFilter('')}
                    className="text-[#c41e3a] text-sm font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-[#c41e3a] rounded"
                  >
                    {t('cand_filter_clear')}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {uniqueParties.slice(0, 10).map(party => (
                  <button
                    key={party}
                    onClick={() => setSelectedPartyFilter(selectedPartyFilter === party ? '' : party)}
                    className={`px-3 py-1 rounded-full border transition-all text-xs font-medium ${
                      selectedPartyFilter === party
                        ? 'border-[#c41e3a] bg-[#c41e3a] text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {party.length > 20 ? party.slice(0, 20) + '...' : party}
                  </button>
                ))}
                {uniqueParties.length > 10 && (
                  <span className="text-xs text-gray-500 self-center">
                    +{uniqueParties.length - 10} más...
                  </span>
                )}
              </div>
            </div>

            {/* Results Counter - Compact */}
            <div className="bg-blue-50 px-6 py-2 border-b border-blue-100 flex-shrink-0">
              <p className="text-blue-900 text-sm font-medium">
                {availableCandidates.length} candidato{availableCandidates.length !== 1 ? 's' : ''} disponible{availableCandidates.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto flex-1">
              {/* Candidates List - Compact View */}
              <div className="p-4">
                {availableCandidates.length > 0 ? (
                  <div className="space-y-2">
                    {availableCandidates.map((candidate) => (
                      <button
                        key={candidate.id}
                        onClick={() => handleSelectNewCandidate(candidate.id)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:border-[#c41e3a] hover:bg-red-50 hover:shadow-md transition-all text-left group flex items-center gap-4"
                      >
                        {/* Logo */}
                        <div
                          className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: candidate.color }}
                        >
                          {candidate.logo}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">
                            {candidate.name}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium mb-1 line-clamp-1">
                            {candidate.party}
                          </p>
                          <p className="text-xs text-gray-500">
                            {candidate.age} {t('cand_years')} • {candidate.profession}
                          </p>
                        </div>

                        {/* Select Button */}
                        <div className="flex-shrink-0 bg-[#c41e3a] text-white px-4 py-2 rounded-lg font-bold text-sm group-hover:bg-[#a01729] transition-colors flex items-center gap-2">
                          <Check size={16} aria-hidden="true" />
                          <span className="hidden sm:inline">{t('comp_modal_select')}</span>
                        </div>
                      </button>
                    ))}
                  </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {t('cand_no_results')}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('comp_modal_search')}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedPartyFilter('');
                    }}
                    className="bg-[#c41e3a] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#a01729] transition-colors text-sm"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
