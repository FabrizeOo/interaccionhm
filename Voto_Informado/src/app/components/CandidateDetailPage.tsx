import { ArrowLeft, Award, Briefcase, GraduationCap, Heart, Building, Shield, Leaf, DollarSign, Users, BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const mockCandidateEs = {
  id: 1,
  name: 'JUAN CARLOS LÓPEZ RÍOS',
  party: 'PROGRESO PERÚ',
  logo: 'PP',
  color: '#e91e63',
  age: 52,
  profession: 'Economista',
  birthplace: 'Lima, Perú',
  education: [
    'Doctorado en Economía - Universidad de Cambridge, Reino Unido',
    'Maestría en Políticas Públicas - Universidad Nacional Mayor de San Marcos',
    'Economista - Universidad Nacional Mayor de San Marcos',
  ],
  experience: [
    'Ministro de Economía y Finanzas (2020-2022)',
    'Viceministro de Hacienda (2018-2020)',
    'Asesor económico del Congreso (2015-2018)',
    'Consultor del Banco Mundial (2010-2015)',
  ],
  vicePresidents: {
    first: 'María Teresa Ramírez Castillo',
    second: 'Jorge Luis Mendoza Torres',
  },
  proposals: {
    education: {
      title: 'Educación de Calidad para Todos',
      items: [
        'Aumentar presupuesto educativo al 6% del PBI',
        'Capacitación continua y evaluación docente',
        'Infraestructura moderna en todas las escuelas',
        'Conectividad a internet gratuita en zonas rurales',
        'Becas para estudiantes de bajos recursos',
      ],
    },
    health: {
      title: 'Salud Universal y Accesible',
      items: [
        'Construcción de 200 nuevos centros de salud',
        'Fortalecimiento del sistema de salud primaria',
        'Seguro de salud gratuito para población vulnerable',
        'Modernización de hospitales regionales',
        'Telemedicina para zonas alejadas',
      ],
    },
    economy: {
      title: 'Reactivación Económica Sostenible',
      items: [
        'Reducción de impuestos para PYMES',
        'Apoyo a emprendedores con créditos blandos',
        'Inversión en infraestructura vial',
        'Promoción de exportaciones regionales',
        'Formalización de pequeñas empresas',
      ],
    },
    security: {
      title: 'Seguridad Ciudadana Integral',
      items: [
        'Modernización del equipamiento policial',
        'Aumento de salarios para fuerzas del orden',
        'Cámaras de seguridad en zonas críticas',
        'Programas de prevención del delito',
        'Fortalecimiento del sistema judicial',
      ],
    },
    environment: {
      title: 'Desarrollo Sostenible',
      items: [
        'Protección de áreas naturales protegidas',
        'Promoción de energías renovables',
        'Plan nacional de gestión de residuos',
        'Reforestación y conservación de bosques',
        'Incentivos para empresas eco-amigables',
      ],
    },
  },
};

const mockCandidateQu = {
  ...mockCandidateEs,
  profession: 'Qullqi Yachaq',
  birthplace: 'Lima, Perú',
  education: [
    'Hatun Yachay Qullqimanta - Universidad de Cambridge, Inglaterramanta',
    'Hatun Yachay Llaqta Kamaypi - Universidad Nacional Mayor de San Marcos',
    'Qullqi Yachaq - Universidad Nacional Mayor de San Marcos',
  ],
  experience: [
    'Qullqi Kamachiq Ministro (2020-2022)',
    'Qullqi Kamachiq Yanapaq (2018-2020)',
    'Kamachiq Suyu Qullqi Yanapaq (2015-2018)',
    'Pacha Mama Banco Yanapaq (2010-2015)',
  ],
  proposals: {
    education: {
      title: 'Tukuypaq Allin Yachay',
      items: [
        'Yachay qullqita PBI-manta 6%-man hatunchiy',
        'Yachachiqkunata yacharichiy hinallataq qhawachiy',
        'Tukuy yachay wasikunapi musuq ruway',
        'Internet mana qullqiwan sapa llaqtapi',
        'Wakcha yachaqkunapaq yanapay',
      ],
    },
    health: {
      title: 'Tukuypaq Qhali Kay',
      items: [
        '200 musuq qhali kay wasikunata ruway',
        'Ñawpaq qhali kay sumayta hatunchiy',
        'Wakcha runakuna mana qullqiwan aseguramiento',
        'Suyu hospitalkuna musuqyachiy',
        'Karu llaqtakunapi telemedicina',
      ],
    },
    economy: {
      title: 'Allin Qullqi Ruway',
      items: [
        'Uchuy llank\'aykunapaq impuestokuna pisichiy',
        'Musuq llank\'aqkunata yanapay',
        'Ñankuna ruwaypaq invertiy',
        'Suyu lluqsiy ruwayta yanapay',
        'Uchuy empresakuna legalyachiy',
      ],
    },
    security: {
      title: 'Llaqta Waqaychay',
      items: [
        'Policia equiponkuna musuqyachiy',
        'Waqaychaq runakuna sueldo hatunchiy',
        'Qhawana camaraskuna chawpi llaqtakunapi',
        'Huchata mañakuy programakuna',
        'Justicia suyu hatunchiy',
      ],
    },
    environment: {
      title: 'Allpa Mamanchis Waqaychay',
      items: [
        'Suyuq pachamamanta waqaychay',
        'Musuq energía yanapay',
        'Suyu qura pallay kamachiy',
        'Sachakunata tarpuy hinallataq waqaychay',
        'Allpa mamanchista munaq empresakunata yanapay',
      ],
    },
  },
};

export function CandidateDetailPage({ onNavigate, candidateId }: { onNavigate: (page: string) => void; candidateId?: number }) {
  const { t, language } = useLanguage();
  const candidate = language === 'qu' ? mockCandidateQu : mockCandidateEs;

  const proposalSections = [
    { key: 'education', icon: <BookOpen className="text-white" size={32} aria-hidden="true" />, color: 'blue', data: candidate.proposals.education },
    { key: 'health', icon: <Heart className="text-white" size={32} aria-hidden="true" />, color: 'red', data: candidate.proposals.health },
    { key: 'economy', icon: <DollarSign className="text-white" size={32} aria-hidden="true" />, color: 'green', data: candidate.proposals.economy },
    { key: 'security', icon: <Shield className="text-white" size={32} aria-hidden="true" />, color: 'purple', data: candidate.proposals.security },
    { key: 'environment', icon: <Leaf className="text-white" size={32} aria-hidden="true" />, color: 'teal', data: candidate.proposals.environment },
  ];

  const colorMap: Record<string, { border: string; bg: string; title: string; check: string; iconBg: string }> = {
    blue:   { border: 'border-blue-500',   bg: 'from-blue-50 to-blue-100',     title: 'text-blue-900',   check: 'text-blue-500',   iconBg: 'bg-blue-500'   },
    red:    { border: 'border-red-500',    bg: 'from-red-50 to-red-100',       title: 'text-red-900',    check: 'text-red-500',    iconBg: 'bg-red-500'    },
    green:  { border: 'border-green-500',  bg: 'from-green-50 to-green-100',   title: 'text-green-900',  check: 'text-green-500',  iconBg: 'bg-green-500'  },
    purple: { border: 'border-purple-500', bg: 'from-purple-50 to-purple-100', title: 'text-purple-900', check: 'text-purple-500', iconBg: 'bg-purple-500' },
    teal:   { border: 'border-teal-500',   bg: 'from-teal-50 to-teal-100',    title: 'text-teal-900',   check: 'text-teal-500',   iconBg: 'bg-teal-500'   },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('presidentes')}
          className="flex items-center gap-2 text-[#c41e3a] font-medium text-lg mb-6 hover:gap-3 transition-all group focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded-lg px-2 py-1"
          aria-label={t('detail_back')}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          {t('detail_back')}
        </button>

        {/* Candidate Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="grid md:grid-cols-3">
            {/* Avatar */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-12 flex items-center justify-center" aria-hidden="true">
              <div className="w-48 h-48 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-gray-600 text-6xl font-bold shadow-2xl">
                {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-2 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{candidate.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                      <Award size={18} className="text-gray-600" aria-hidden="true" />
                      <span className="font-medium text-gray-700">{candidate.age} {t('detail_age')}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                      <Briefcase size={18} className="text-gray-600" aria-hidden="true" />
                      <span className="font-medium text-gray-700">{candidate.profession}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                    style={{ backgroundColor: candidate.color }}
                    aria-label={candidate.party}
                  >
                    {candidate.logo}
                  </div>
                  <button
                    onClick={() => onNavigate('comparar')}
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 group focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-offset-2 whitespace-nowrap"
                  >
                    <Users size={16} aria-hidden="true" />
                    {t('detail_compare_btn')}
                    <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-6">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">{t('detail_party')}</p>
                <p className="text-2xl font-bold text-gray-800">{candidate.party}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-1">{t('detail_first_vp')}</p>
                  <p className="text-lg font-bold text-blue-900">{candidate.vicePresidents.first}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                  <p className="text-sm font-medium text-green-600 uppercase tracking-wide mb-1">{t('detail_second_vp')}</p>
                  <p className="text-lg font-bold text-green-900">{candidate.vicePresidents.second}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education and Experience */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <section aria-labelledby="education-heading" className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl" aria-hidden="true">
                <GraduationCap className="text-purple-600" size={28} />
              </div>
              <h2 id="education-heading" className="text-2xl font-bold text-gray-800">{t('detail_education')}</h2>
            </div>
            <ul className="space-y-4">
              {candidate.education.map((edu, index) => (
                <li key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1" aria-hidden="true">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{edu}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="experience-heading" className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-xl" aria-hidden="true">
                <Briefcase className="text-orange-600" size={28} />
              </div>
              <h2 id="experience-heading" className="text-2xl font-bold text-gray-800">{t('detail_experience')}</h2>
            </div>
            <ul className="space-y-4">
              {candidate.experience.map((exp, index) => (
                <li key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1" aria-hidden="true">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{exp}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Proposals */}
        <section aria-labelledby="proposals-heading" className="mb-8">
          <div className="text-center mb-10">
            <h2 id="proposals-heading" className="text-4xl font-bold text-gray-800 mb-3">{t('detail_proposals')}</h2>
            <p className="text-xl text-gray-600">{t('detail_proposals_period')}</p>
          </div>

          <div className="space-y-6">
            {proposalSections.map(({ key, icon, color, data }) => {
              const c = colorMap[color];
              return (
                <div key={key} className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 ${c.border} hover:shadow-xl transition-all`}>
                  <div className={`bg-gradient-to-r ${c.bg} p-6`}>
                    <div className="flex items-center gap-4">
                      <div className={`${c.iconBg} p-4 rounded-xl shadow-md`} aria-hidden="true">{icon}</div>
                      <h3 className={`text-2xl font-bold ${c.title}`}>{data.title}</h3>
                    </div>
                  </div>
                  <ul className="p-6 space-y-3">
                    {data.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-lg text-gray-700">
                        <span className={`${c.check} font-bold`} aria-hidden="true">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Buttons */}
        <div className="mb-8">
          <button className="bg-white border-2 border-gray-300 text-gray-800 p-6 rounded-2xl font-bold text-xl hover:border-gray-400 hover:shadow-lg transition-all flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-offset-2 w-full">
            <BookOpen size={28} aria-hidden="true" />
            {t('detail_download')}
          </button>
        </div>
      </div>
    </div>
  );
}
