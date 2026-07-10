import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

const mockCandidates = [
  { id: 1, name: 'JUAN CARLOS LÓPEZ RÍOS', party: 'PROGRESO PERÚ', logo: 'PP', color: '#e91e63' },
  { id: 2, name: 'MARÍA ISABEL GARCÍA TORRES', party: 'ALIANZA PARA EL PROGRESO', logo: 'APP', color: '#2196f3' },
  { id: 3, name: 'CARLOS ALBERTO MENDOZA', party: 'ACCIÓN POPULAR', logo: 'AP', color: '#ff9800' },
  { id: 4, name: 'ANA PATRICIA ROJAS', party: 'FUERZA POPULAR', logo: 'FP', color: '#ff5722' },
  { id: 5, name: 'ROBERTO PÉREZ SILVA', party: 'PODEMOS PERÚ', logo: 'PODE', color: '#9c27b0' },
  { id: 6, name: 'LUCÍA FERNÁNDEZ', party: 'PERÚ LIBRE', logo: 'PL', color: '#f44336' },
  { id: 7, name: 'MIGUEL ÁNGEL TORRES', party: 'RENOVACIÓN POPULAR', logo: 'RP', color: '#00bcd4' },
  { id: 8, name: 'CARMEN ROSA VALDEZ', party: 'JUNTOS POR EL PERÚ', logo: 'JPP', color: '#4caf50' },
  { id: 9, name: 'JOSÉ ANTONIO QUISPE', party: 'SOMOS PERÚ', logo: 'SP', color: '#ff9800' },
  { id: 10, name: 'ELENA MORALES CASTRO', party: 'AVANZA PAÍS', logo: 'AVAN', color: '#3f51b5' },
];

export function CandidatesPage({ onNavigate }: { onNavigate: (page: string, candidateId?: number) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedParty, setSelectedParty] = useState('');

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.party.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = !selectedParty || candidate.party === selectedParty;
    return matchesSearch && matchesParty;
  });

  const uniqueParties = Array.from(new Set(mockCandidates.map(c => c.party)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('home')}
        className="text-[#c41e3a] font-medium text-lg mb-4 hover:underline"
      >
        ← Volver al inicio
      </button>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">Candidatos Presidenciales 2026</h2>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Buscar por nombre o partido político..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-[#c41e3a] focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 px-6 py-3 rounded-lg font-medium text-lg hover:bg-gray-200 transition-colors flex items-center gap-2 justify-center"
          >
            <Filter size={20} />
            Filtros {selectedParty && '(1)'}
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-lg text-gray-800">Filtrar por partido:</h4>
              {selectedParty && (
                <button
                  onClick={() => setSelectedParty('')}
                  className="text-[#c41e3a] font-medium hover:underline flex items-center gap-1"
                >
                  <X size={16} />
                  Limpiar filtros
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {uniqueParties.map(party => (
                <button
                  key={party}
                  onClick={() => setSelectedParty(selectedParty === party ? '' : party)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                    selectedParty === party
                      ? 'border-[#c41e3a] bg-[#c41e3a] text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {party}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-lg text-gray-600 mb-6">
        Mostrando <strong>{filteredCandidates.length}</strong> de {mockCandidates.length} candidatos
      </p>

      {/* Candidates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map(candidate => (
          <div
            key={candidate.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-[#c41e3a] overflow-hidden cursor-pointer"
            onClick={() => onNavigate('candidato-detalle', candidate.id)}
          >
            <div className="bg-gray-100 h-48 flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-4xl font-bold">
                {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{candidate.name}</h3>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: candidate.color }}
                >
                  {candidate.logo}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Partido Político:</p>
                  <p className="text-base font-bold text-gray-800">{candidate.party}</p>
                </div>
              </div>
              <button className="w-full bg-[#c41e3a] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#a01729] transition-colors">
                Ver Propuestas
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No se encontraron candidatos con los criterios seleccionados</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedParty('');
            }}
            className="mt-4 text-[#c41e3a] font-bold hover:underline"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}
    </div>
  );
}
