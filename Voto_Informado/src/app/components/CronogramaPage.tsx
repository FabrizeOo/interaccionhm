import { ArrowLeft, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Bilingual schedule data
// Quechua month names (Southern Quechua / Runasimi):
// Octubre → Uma Raymi | Noviembre → Ayamarq'a | Diciembre → Kapaq Raymi
// Enero → Qulla Raymi | Febrero → Hatun Pukuy | Marzo → Pawqar Waray
// Abril → Ayriwa | Mayo → Aymuray | Junio → Inti Raymi | Julio → Anta Sitwa

const cronogramaElectoral = [
  {
    fase: {
      es: 'Inscripción y Registro',
      qu: 'Qillqay hinallataq Rejistray',
    },
    eventos: [
      {
        fecha: { es: '15 de octubre de 2025', qu: '15 Uma Raymi 2025-pi' },
        titulo: { es: 'Inicio de inscripción de candidatos', qu: 'Akllakuqkuna qillqay qallariy' },
        tipo: 'completado',
      },
      {
        fecha: { es: '20 de noviembre de 2025', qu: '20 Ayamarq\'a 2025-pi' },
        titulo: { es: 'Cierre de inscripción de candidatos', qu: 'Akllakuqkuna qillqay tukuy' },
        tipo: 'completado',
      },
      {
        fecha: { es: '1 de diciembre de 2025', qu: '1 Kapaq Raymi 2025-pi' },
        titulo: { es: 'Publicación de lista oficial de candidatos', qu: 'Akllakuqkuna lista ofisial kichay' },
        tipo: 'completado',
      },
    ],
  },
  {
    fase: {
      es: 'Campaña Electoral',
      qu: 'Akllakuy Kampanya',
    },
    eventos: [
      {
        fecha: { es: '5 de enero de 2026', qu: '5 Qulla Raymi 2026-pi' },
        titulo: { es: 'Inicio de campaña electoral', qu: 'Akllakuy kampanya qallariy' },
        tipo: 'completado',
      },
      {
        fecha: { es: '15 de marzo de 2026', qu: '15 Pawqar Waray 2026-pi' },
        titulo: { es: 'Debate presidencial — Primera vuelta', qu: 'Hatun Kamachiq rimanakuy — Ñawpaq kutin' },
        tipo: 'completado',
      },
      {
        fecha: { es: '28 de abril de 2026', qu: '28 Ayriwa 2026-pi' },
        titulo: { es: 'Fin de campaña electoral — Primera vuelta', qu: 'Akllakuy kampanya tukuy — Ñawpaq kutin' },
        tipo: 'proximo',
      },
    ],
  },
  {
    fase: {
      es: 'Elecciones Generales — Primera Vuelta',
      qu: 'Tukuy Llaqtaq Akllakuynin — Ñawpaq Kutin',
    },
    eventos: [
      {
        fecha: { es: '29 de abril de 2026', qu: '29 Ayriwa 2026-pi' },
        titulo: { es: 'Inicio de veda electoral', qu: 'Akllakuy veda qallariy' },
        tipo: 'proximo',
      },
      {
        fecha: { es: '2 de mayo de 2026', qu: '2 Aymuray 2026-pi' },
        titulo: { es: 'DÍA DE ELECCIONES — PRIMERA VUELTA', qu: 'AKLLAKUY P\'UNCHAY — ÑAWPAQ KUTIN' },
        tipo: 'importante',
        destacado: true,
      },
      {
        fecha: { es: '3 de mayo de 2026', qu: '3 Aymuray 2026-pi' },
        titulo: { es: 'Inicio del conteo oficial de votos', qu: 'Ofisial qillqa qillpay qallariy' },
        tipo: 'proximo',
      },
      {
        fecha: { es: '10 de mayo de 2026', qu: '10 Aymuray 2026-pi' },
        titulo: { es: 'Proclamación de resultados oficiales', qu: 'Ofisial resultadokuna willakuy' },
        tipo: 'proximo',
      },
    ],
  },
  {
    fase: {
      es: 'Segunda Vuelta (si es necesaria)',
      qu: 'Iskay Kutis Akllakuy (Munasqaqa)',
    },
    eventos: [
      {
        fecha: { es: '15 de mayo de 2026', qu: '15 Aymuray 2026-pi' },
        titulo: { es: 'Inicio de campaña — Segunda vuelta', qu: 'Kampanya qallariy — Iskay kutin' },
        tipo: 'pendiente',
      },
      {
        fecha: { es: '5 de junio de 2026', qu: '5 Inti Raymi 2026-pi' },
        titulo: { es: 'Debate presidencial — Segunda vuelta', qu: 'Hatun Kamachiq rimanakuy — Iskay kutin' },
        tipo: 'pendiente',
      },
      {
        fecha: { es: '19 de junio de 2026', qu: '19 Inti Raymi 2026-pi' },
        titulo: { es: 'Fin de campaña — Segunda vuelta', qu: 'Kampanya tukuy — Iskay kutin' },
        tipo: 'pendiente',
      },
      {
        fecha: { es: '20 de junio de 2026', qu: '20 Inti Raymi 2026-pi' },
        titulo: { es: 'Veda electoral — Segunda vuelta', qu: 'Akllakuy veda — Iskay kutin' },
        tipo: 'pendiente',
      },
      {
        fecha: { es: '21 de junio de 2026', qu: '21 Inti Raymi 2026-pi' },
        titulo: { es: 'Elecciones — Segunda vuelta', qu: 'Akllakuy — Iskay kutin' },
        tipo: 'pendiente',
      },
      {
        fecha: { es: '28 de junio de 2026', qu: '28 Inti Raymi 2026-pi' },
        titulo: { es: 'Proclamación de resultados finales', qu: 'Qhipa resultadokuna willakuy' },
        tipo: 'pendiente',
      },
    ],
  },
  {
    fase: {
      es: 'Asunción al Cargo',
      qu: 'Kamachiqman Yaykuy',
    },
    eventos: [
      {
        fecha: { es: '28 de julio de 2026', qu: '28 Anta Sitwa 2026-pi' },
        titulo: { es: 'Asunción del nuevo presidente de la República', qu: 'Musuq Hatun Kamachiq kamachiman yaykuy' },
        tipo: 'pendiente',
      },
    ],
  },
];

type Tipo = 'completado' | 'proximo' | 'importante' | 'pendiente';

export function CronogramaPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { t, language } = useLanguage();

  const getTipoColor = (tipo: Tipo) => {
    switch (tipo) {
      case 'completado': return 'bg-green-100 border-green-500 text-green-800';
      case 'proximo':    return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'importante': return 'bg-red-100 border-red-500 text-red-800';
      default:           return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  const getTipoIcon = (tipo: Tipo) => {
    switch (tipo) {
      case 'completado': return <CheckCircle2 size={20} className="text-green-600" aria-hidden="true" />;
      case 'proximo':    return <Clock size={20} className="text-blue-600" aria-hidden="true" />;
      case 'importante': return <AlertCircle size={20} className="text-red-600" aria-hidden="true" />;
      default:           return <Calendar size={20} className="text-gray-600" aria-hidden="true" />;
    }
  };

  const keyDateLabel = language === 'qu' ? '¡ALLIN P\'UNCHAY!' : '¡FECHA CLAVE!';

  const infoTitle = language === 'qu' ? 'Allin Willakuy' : 'Información Importante';
  const infoItems = language === 'qu' ? [
    'Voto ruwayqa tukuy 18–70 watayuq Peru runakunapaq munasqa.',
    'Veda pachapi encuesta hinallataq propaganda publicayta prohíbisqa.',
    'Pacha hapiy JNE kamachiywan tikrarikuspa puriyta atinmi.',
    'Iskay kutis akllakuyqa mana pipis 50%-manta aswan qillqata chaskiykuqtiymi ruwakunqa.',
  ] : [
    'El voto es obligatorio para todos los ciudadanos peruanos entre 18 y 70 años.',
    'Durante la veda electoral está prohibida la publicación de encuestas y propaganda política.',
    'Las fechas pueden estar sujetas a modificaciones según disposiciones del JNE.',
    'La segunda vuelta solo se realizará si ningún candidato obtiene más del 50% de votos válidos.',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-[#c41e3a] font-medium text-lg mb-6 hover:gap-3 transition-all group focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded-lg px-2 py-1"
          aria-label={t('sched_back')}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          {t('sched_back')}
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-[#c41e3a] p-4 rounded-2xl" aria-hidden="true">
              <Calendar className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t('sched_title_full')}</h1>
          <p className="text-xl text-gray-600">{t('sched_subtitle')}</p>
        </div>

        {/* Leyenda */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('sched_legend')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border-l-4 border-green-500">
              <CheckCircle2 size={24} className="text-green-600" aria-hidden="true" />
              <span className="font-medium text-green-800">{t('sched_completed')}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <Clock size={24} className="text-blue-600" aria-hidden="true" />
              <span className="font-medium text-blue-800">{t('sched_upcoming')}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border-l-4 border-red-500">
              <AlertCircle size={24} className="text-red-600" aria-hidden="true" />
              <span className="font-medium text-red-800">{t('sched_important')}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border-l-4 border-gray-400">
              <Calendar size={24} className="text-gray-600" aria-hidden="true" />
              <span className="font-medium text-gray-700">{t('sched_pending')}</span>
            </div>
          </div>
        </div>

        {/* Cronograma por Fases */}
        <div className="space-y-8">
          {cronogramaElectoral.map((fase, faseIndex) => (
            <div key={faseIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Fase Header */}
              <div className="bg-gradient-to-r from-[#c41e3a] to-[#a01729] p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {fase.fase[language]}
                </h2>
              </div>

              {/* Eventos */}
              <div className="p-6">
                <div className="space-y-4">
                  {fase.eventos.map((evento, eventoIndex) => (
                    <div
                      key={eventoIndex}
                      {...(evento.destacado ? { 'data-destacado': 'true' } : {})}
                      className={`p-5 rounded-xl border-l-4 transition-all hover:shadow-md ${
                        evento.destacado
                          ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-600 shadow-lg'
                          : getTipoColor(evento.tipo as Tipo)
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getTipoIcon(evento.tipo as Tipo)}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div>
                              <p className={`text-lg font-bold ${evento.destacado ? 'text-red-900 text-xl' : ''}`}>
                                {evento.titulo[language]}
                              </p>
                              <p className={`text-sm font-medium ${evento.destacado ? 'text-red-700' : 'text-gray-600'}`}>
                                {evento.fecha[language]}
                              </p>
                            </div>
                            {evento.destacado && (
                              <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                                {keyDateLabel}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 p-3 rounded-xl" aria-hidden="true">
              <AlertCircle className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-[#ffffff]">{infoTitle}</h3>
              <ul className="space-y-2 text-gray-700">
                {infoItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#e0c4c400]">
                    <span className="text-blue-600 font-bold mt-1" aria-hidden="true">•</span>
                    <span className="text-[#dadbde] text-[#d9dbde] text-[#d6d9de] text-[#f0f5fd] text-[#f5f9ff] text-[#f9fbff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff] text-[#ffffff]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
