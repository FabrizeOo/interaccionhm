import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Mail, Phone, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useLanguage } from '../contexts/LanguageContext';

import nosotros1 from '@/imports/nosotros_1.png';
import nosotros2 from '@/imports/nosotros_2.png';
import nosotros3 from '@/imports/nosotros_3.png';
import iconVotoInformado from '@/imports/icon-voto-informado.png';
import iconPolitico from '@/imports/politico-electoral.png';
import iconCivico from '@/imports/civico-educativo.png';
import mapaDepa from '@/imports/mapa_FIVIS_depa.png';
import mapaProv from '@/imports/mapa_FIVIS_prov.png';
import mapaFron from '@/imports/mapa_FIVIS_fron.png';
import mapaLima from '@/imports/mapa_FIVIS_lima.png';

type FivisTab = 'departamentales' | 'provinciales' | 'frontera' | 'lima';

const content = {
  es: {
    back: 'Volver al inicio',
    pageTitle: 'Nosotros',
    quienesSomos: '¿Quiénes somos?',
    quienesSomosText: 'El Programa Voto Informado, comprometido con una democracia más informada y participativa, desarrolla acciones clave dirigidas a la ciudadanía y a las organizaciones políticas.',
    enfoques: 'Estas acciones responden a dos enfoques estratégicos:',
    politicoTitle: 'Político-electoral',
    politicoDesc: 'Orientado a generar confianza de los ciudadanos en el sistema democrático.',
    civicoTitle: 'Cívico-educativo',
    civicoDesc: 'Encargado de ejecutar actividades de formación, asistencia técnica, información y difusión que promueven una participación ciudadana consciente y responsable.',
    objetivoTitle: 'Objetivo general',
    objetivoText: 'Brindar a la ciudadanía y a las organizaciones políticas los conocimientos y recursos cívico-electorales necesarios para participar de manera informada y responsable en la vida política del país, fortaleciendo así la democracia nacional.',
    logoDesc: 'Voto Informado es un componente estratégico de la Dirección Nacional de Educación, Participación y Formación Cívica Electoral del Jurado Nacional de Elecciones.',
    accionesTitle: 'Nuestras acciones',
    accionesIntro: 'El Programa Voto Informado impulsa diversas iniciativas orientadas a:',
    acciones: [
      'Brindar asistencia técnica en temas cívico-electorales.',
      'Capacitar a las organizaciones políticas para fomentar prácticas democráticas.',
      'Construir espacios de diálogo y debate que promuevan el intercambio de ideas y posiciones.',
      'Promover el uso de herramientas tecnológicas de información electoral a la ciudadanía en el entorno virtual y redes sociales.',
      'Difundir contenidos educativos que faciliten la emisión de un voto informado por parte de la ciudadanía.',
    ],
    accionesField: 'Para implementar estas acciones, en el marco de las Elecciones Generales 2026, se ha',
    accionesFieldBold: 'desplegado personal de campo en todo el país.',
    fivisTitle: 'Nuestros Facilitadores e Implementadores del Voto Informado (FIVIS)',
    tabs: {
      departamentales: 'FIVIS Departamentales',
      provinciales: 'FIVIS Provinciales',
      frontera: 'FIVIS Frontera',
      lima: 'FIVIS Lima Metropolitana',
    },
    fivisDescs: {
      departamentales: 'Facilitadores desplegados en las capitales departamentales de todo el Perú para llevar la información electoral a cada región.',
      provinciales: 'Facilitadores que operan en las provincias del país, asegurando cobertura electoral en zonas rurales y periurbanas.',
      frontera: 'Facilitadores especializados en zonas de frontera para atender a ciudadanos peruanos en el exterior y comunidades limítrofes.',
      lima: 'Equipo de facilitadores que cubre los distritos de Lima Metropolitana, la circunscripción con mayor número de electores.',
    },
    mapaTitles: {
      departamentales: 'Distribución FIVIS por Departamento',
      provinciales: 'Distribución FIVIS por Provincia',
      frontera: 'Distribución FIVIS por Fronteras',
      lima: 'Distribución FIVIS — Lima Metropolitana',
    },
    atencionTitle: 'Atención al público:',
    address: 'Jr. Cusco 653 - Cercado de Lima, Perú',
    hours: 'Lunes a Viernes de 8:00 a 16:00 horas',
    email: 'consultas@jne.gob.pe',
    phone: '0800-00-214',
    sede: 'Sede del JNE — Cercado de Lima',
  },
  qu: {
    back: 'Qallariman kutiy',
    pageTitle: 'Ñuqanchikamanta',
    quienesSomos: '¿Pitaq Kanchis?',
    quienesSomosText: 'Voto Informado Programa, yachaywan hinallataq participación demokrasiapaq llamk\'aq, llaqta runakunapaq hinallataq política organizacionkunapaq allin ruwaykunata kamachin.',
    enfoques: 'Kay ruwaykunaqa iskay kaq munaykunaman kutinku:',
    politicoTitle: 'Política-Akllakuy',
    politicoDesc: 'Llaqta runakunapaq democrático sistema simipi iyaw niy ruwaypaq.',
    civicoTitle: 'Llaqta-Yachay',
    civicoDesc: 'Yachay, técnica yanapay, willakuy hinallataq qhechuy ruwaykunata kamachiq, llaqta runakunapaq yachaysapa hinallataq responsal participaciónta yanapanankupaq.',
    objetivoTitle: 'Hatun Munaynin',
    objetivoText: 'Llaqta runakunapaq hinallataq política organizacionkunapaq llaqta-akllakuy yachaykunata hinallataq recursokunata quy, suyup política kawsayninpi yachaywan hinallataq responsalman yapaykuyta atinankupaq, suyuq demokrasianta hatunman purichiyspa.',
    logoDesc: 'Voto Informado, JNE Dirección Nacional de Educación, Participación y Formación Cívica Electoralpa allin estratégico partinmi.',
    accionesTitle: 'Ñuqanchiq Ruwaynikuna',
    accionesIntro: 'Voto Informado Programaqa kay ruwaykunata kamachin:',
    acciones: [
      'Llaqta-akllakuy temapi técnica yanapay quy.',
      'Política organizacionkunata demokrátiko ruwaykunapaq yachachiy.',
      'Rimanakuy hinallataq debatepaq espaciokunatam ruway, yuyay randinakuyta yanapanampaq.',
      'Akllakuy willakuy tecnológico herramientakunata llaqta runakunapaq virtual hinallataq redes socialespi yanapay.',
      'Llaqta runakunapaq yachaysapa qillqa ruwayta yanapakunan educativo contenidokunata qhechuy.',
    ],
    accionesField: 'Kay ruwaykunata ruwaypaq, Elecciones Generales 2026 hukllawan,',
    accionesFieldBold: 'tukuy suyupi personal de campota churarqanku.',
    fivisTitle: 'Ñuqanchiq Voto Informado Runaykuna (FIVIS)',
    tabs: {
      departamentales: 'FIVIS Suyukuna',
      provinciales: 'FIVIS Provinciakuna',
      frontera: 'FIVIS Saywa',
      lima: 'FIVIS Lima Hatun Llaqta',
    },
    fivisDescs: {
      departamentales: 'Peru tukuy suyukunapi capital departamentalespi runaykuna, akllakuy willakuyta sapa suyuman apanankupaq.',
      provinciales: 'Suyuq provinciasninpi llamk\'aq runaykuna, llaqta hinallataq periurbano lugarkunapi akllakuy coberturanta riqsichinapaq.',
      frontera: 'Saywa lugarkunapi especializasqa runaykuna, hawa Peru runakuna hinallataq saywa kaq comunidadkunapaq.',
      lima: 'Lima Metropolitana districtosninpi llamk\'aq equipo, astawan electoresyuq circunscripcionpi.',
    },
    mapaTitles: {
      departamentales: 'FIVIS Departamentopim Tiyakuy',
      provinciales: 'FIVIS Provinciapim Tiyakuy',
      frontera: 'FIVIS Saywapim Tiyakuy',
      lima: 'FIVIS Lima Hatun Llaqtapim Tiyakuy',
    },
    atencionTitle: 'Llaqta Runakunapaq:',
    address: 'Jr. Cusco 653 - Cercado de Lima, Perú',
    hours: 'Killachaw hinallataq Vierneschawkama, 8:00 - 16:00',
    email: 'consultas@jne.gob.pe',
    phone: '0800-00-214',
    sede: 'JNE Wasin — Cercado de Lima',
  },
};

export function SobreNosotrosPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<FivisTab>('departamentales');
  const c = content[language];

  const tabs: { key: FivisTab }[] = [
    { key: 'departamentales' },
    { key: 'provinciales' },
    { key: 'frontera' },
    { key: 'lima' },
  ];

  const fivisMapSrc = {
    departamentales: mapaDepa,
    provinciales: mapaProv,
    frontera: mapaFron,
    lima: mapaLima,
  }[activeTab];

  return (
    <div className="min-h-screen bg-white">

      {/* ── BACK BUTTON — same style as all other pages ──────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-[#c41e3a] font-medium text-lg mb-6 hover:gap-3 transition-all group focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded-lg px-2 py-1"
          aria-label={c.back}
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          {c.back}
        </button>
      </div>

      {/* ── QUIÉNES SOMOS ──────────────────────────────────────────────────── */}
      <section aria-labelledby="quienes-heading" className="max-w-7xl mx-auto px-4 pb-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text column */}
          <div>
            <h2 id="quienes-heading" className="text-4xl font-black mb-6 text-[#005288]">{c.quienesSomos.split('somos')[0]}<span className="text-[#c41e3a]">{language === 'es' ? 'somos?' : c.quienesSomos.replace('¿Pitaq Kanchis?','')}</span>{language === 'qu' && <span className="text-[#c41e3a]">Kanchis?</span>}</h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">{c.quienesSomosText}</p>

            <p className="text-gray-800 font-semibold mb-5">{c.enfoques}</p>

            {/* Enfoques */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 bg-red-50 rounded-2xl border border-red-100">
                <ImageWithFallback src={iconPolitico} alt="Ícono político-electoral"
                  className="w-14 h-14 object-contain flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#c41e3a] text-lg mb-1">{c.politicoTitle}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{c.politicoDesc}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-orange-50 rounded-2xl border border-orange-100">
                <ImageWithFallback src={iconCivico} alt="Ícono cívico-educativo"
                  className="w-14 h-14 object-contain flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1 text-[#005288]">{c.civicoTitle}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{c.civicoDesc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo column */}
          <div className="relative">
            <ImageWithFallback
              src={nosotros1}
              alt="JNE en comunidad andina durante actividad de Voto Informado"
              className="w-full h-80 lg:h-[480px] object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-4 -left-4 bg-[#c41e3a] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold">
              {language === 'es' ? 'Presencia en todo el Perú' : 'Tukuy Perúpi kachkanchis'}
            </div>
          </div>
        </div>
      </section>

      {/* ── OBJETIVO GENERAL ───────────────────────────────────────────────── */}
      <section aria-labelledby="objetivo-heading" className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 id="objetivo-heading" className="text-4xl font-black mb-8 text-[#005288]">Objetivo General{c.objetivoTitle.split(' ')[0]}</h2>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <p className="lg:col-span-2 text-gray-700 text-lg leading-relaxed">{c.objetivoText}</p>

            {/* Logo + description card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col items-center text-center gap-4">
              <ImageWithFallback src={iconVotoInformado} alt="Voto Informado JNE logo"
                className="w-36 h-auto object-contain" />
              <p className="text-gray-600 text-sm leading-relaxed">{c.logoDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NUESTRAS ACCIONES ──────────────────────────────────────────────── */}
      <section aria-labelledby="acciones-heading" className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Actions list */}
            <div>
              <h2 id="acciones-heading" className="text-4xl font-black mb-2 text-[#005288]">
                {language === 'es' ? (
                  <>Nuestras <span className="text-[#c41e3a]">acciones</span></>
                ) : (
                  <>Ñuqanchiq <span className="text-[#c41e3a]">Ruwaynikuna</span></>
                )}
              </h2>
              <p className="text-gray-600 mb-6">{c.accionesIntro}</p>

              <ul className="space-y-3 mb-6">
                {c.acciones.map((accion, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#c41e3a] flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                      <ChevronRight size={12} className="text-white" />
                    </div>
                    <span className="text-gray-700">{accion}</span>
                  </li>
                ))}
              </ul>

              <p className="text-gray-700 bg-red-50 border-l-4 border-[#c41e3a] pl-4 py-2 rounded-r-xl text-sm">
                {c.accionesField} <strong className="text-[#c41e3a]">{c.accionesFieldBold}</strong>
              </p>
            </div>

            {/* Photo */}
            <div>
              <ImageWithFallback
                src={nosotros2}
                alt="Facilitador del JNE asistiendo a ciudadana andina con información electoral"
                className="w-full h-80 lg:h-[420px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── FIVIS ──────────────────────────────────────────────────────────── */}
      <section aria-labelledby="fivis-heading" className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 id="fivis-heading" className="text-3xl font-black mb-8 text-center text-[#005288]">
            {c.fivisTitle}
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist">
            {tabs.map(({ key }) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:ring-offset-2 ${
                  activeTab === key
                    ? 'bg-[#c41e3a] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#c41e3a] hover:text-[#c41e3a]'
                }`}
              >
                {c.tabs[key]}
              </button>
            ))}
          </div>

          {/* Tab description */}
          <div role="tabpanel" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 text-center">
            <p className="text-gray-700 text-lg">{c.fivisDescs[activeTab]}</p>
          </div>

          {/* Map — updates with the active tab */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{c.mapaTitles[activeTab]}</h3>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-4">
              <ImageWithFallback
                key={activeTab}
                src={fivisMapSrc}
                alt={`Mapa FIVIS — ${c.tabs[activeTab]}`}
                className="w-full h-auto object-contain max-h-[700px] mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ATENCIÓN AL PÚBLICO ────────────────────────────────────────────── */}
      <section aria-labelledby="atencion-heading" className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Contact info */}
            <div>
              <h2 id="atencion-heading" className="text-3xl font-black mb-8 text-[#005288]">
                {language === 'es' ? (
                  <>Atención <span className="text-[#c41e3a]">al público:</span></>
                ) : (
                  <>Llaqta Runakunapaq <span className="text-[#c41e3a]">Yanapay:</span></>
                )}
              </h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-[#c41e3a] p-3 rounded-xl flex-shrink-0">
                    <MapPin className="text-white" size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{c.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#c41e3a] p-3 rounded-xl flex-shrink-0">
                    <Clock className="text-white" size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{c.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#c41e3a] p-3 rounded-xl flex-shrink-0">
                    <Mail className="text-white" size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <a href={`mailto:${c.email}`}
                      className="font-semibold text-[#c41e3a] hover:underline focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded">
                      {c.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#c41e3a] p-3 rounded-xl flex-shrink-0">
                    <Phone className="text-white" size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <a href={`tel:${c.phone}`}
                      className="font-semibold text-gray-800 hover:text-[#c41e3a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c41e3a] rounded">
                      {c.phone}
                    </a>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {language === 'es' ? 'Línea gratuita' : 'Mana qullqiwan llamkiy'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Building photo */}
            <div className="relative">
              <ImageWithFallback
                src={nosotros3}
                alt="Sede del Jurado Nacional de Elecciones en Cercado de Lima"
                className="w-full h-72 lg:h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-sm font-semibold">
                {c.sede}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
