import { X, Plus, Check } from 'lucide-react';
import { useState } from 'react';

const mockCandidates = [
  {
    id: 1,
    name: 'JUAN CARLOS LÓPEZ RÍOS',
    party: 'PROGRESO PERÚ',
    logo: 'PP',
    color: '#e91e63',
    education: 'Economista, Universidad Nacional Mayor de San Marcos',
    experience: '15 años en sector público',
    proposals: {
      education: 'Aumentar presupuesto educativo al 6% del PBI',
      health: 'Crear 200 nuevos centros de salud',
      economy: 'Reducir impuestos a pequeñas empresas',
      security: 'Modernizar equipamiento policial'
    }
  },
  {
    id: 2,
    name: 'MARÍA ISABEL GARCÍA TORRES',
    party: 'ALIANZA PARA EL PROGRESO',
    logo: 'APP',
    color: '#2196f3',
    education: 'Abogada, Pontificia Universidad Católica del Perú',
    experience: '10 años como congresista',
    proposals: {
      education: 'Capacitación docente continua',
      health: 'Seguro de salud universal',
      economy: 'Impulsar exportaciones regionales',
      security: 'Cámaras de vigilancia en todas las ciudades'
    }
  },
  {
    id: 3,
    name: 'CARLOS ALBERTO MENDOZA',
    party: 'ACCIÓN POPULAR',
    logo: 'AP',
    color: '#ff9800',
    education: 'Ingeniero Civil, Universidad Nacional de Ingeniería',
    experience: '20 años en gestión pública',
    proposals: {
      education: 'Internet gratuito en todas las escuelas',
      health: 'Construir 3 hospitales especializados',
      economy: 'Reactivar agricultura familiar',
      security: 'Incrementar sueldos policiales'
    }
  },
];

export function ComparePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([1, 2]);

  const toggleCandidate = (id: number) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(selectedCandidates.filter(cid => cid !== id));
    } else if (selectedCandidates.length < 3) {
      setSelectedCandidates([...selectedCandidates, id]);
    }
  };

  const selected = mockCandidates.filter(c => selectedCandidates.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => onNavigate('home')}
        className="text-[#c41e3a] font-medium text-lg mb-4 hover:underline"
      >
        ← Volver al inicio
      </button>

      <h2 className="text-3xl font-bold mb-2 text-gray-800">Comparar Candidatos</h2>
      <p className="text-lg text-gray-600 mb-6">Selecciona hasta 3 candidatos para comparar sus propuestas</p>

      {/* Candidate Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Selecciona candidatos ({selectedCandidates.length}/3)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockCandidates.map(candidate => {
            const isSelected = selectedCandidates.includes(candidate.id);
            const canSelect = selectedCandidates.length < 3 || isSelected;

            return (
              <button
                key={candidate.id}
                onClick={() => canSelect && toggleCandidate(candidate.id)}
                disabled={!canSelect}
                className={`p-4 rounded-lg border-2 transition-all relative ${
                  isSelected
                    ? 'border-[#c41e3a] bg-red-50'
                    : canSelect
                    ? 'border-gray-300 bg-white hover:border-gray-400'
                    : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: candidate.color }}
                >
                  {candidate.logo}
                </div>
                <p className="text-sm font-medium text-gray-800 text-center line-clamp-2">
                  {candidate.name.split(' ').slice(0, 2).join(' ')}
                </p>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-[#c41e3a] rounded-full p-1">
                    <Check className="text-white" size={16} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {selected.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left font-bold text-lg text-gray-800 sticky left-0 bg-gray-100 z-10 min-w-[200px]">
                    Aspecto
                  </th>
                  {selected.map(candidate => (
                    <th key={candidate.id} className="p-4 min-w-[280px]">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: candidate.color }}
                        >
                          {candidate.logo}
                        </div>
                        <p className="text-base font-bold text-gray-800 text-center">
                          {candidate.name}
                        </p>
                        <p className="text-sm text-gray-600">{candidate.party}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-700 sticky left-0 bg-white z-10">
                    Educación
                  </td>
                  {selected.map(candidate => (
                    <td key={candidate.id} className="p-4 text-gray-700">
                      {candidate.education}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-4 font-bold text-gray-700 sticky left-0 bg-gray-50 z-10">
                    Experiencia
                  </td>
                  {selected.map(candidate => (
                    <td key={candidate.id} className="p-4 text-gray-700">
                      {candidate.experience}
                    </td>
                  ))}
                </tr>
                <tr className="bg-blue-50 border-b-2 border-blue-200">
                  <td colSpan={selected.length + 1} className="p-3 font-bold text-blue-900 text-center text-lg">
                    PROPUESTAS DE GOBIERNO
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-700 sticky left-0 bg-white z-10">
                    📚 Educación
                  </td>
                  {selected.map(candidate => (
                    <td key={candidate.id} className="p-4 text-gray-700">
                      {candidate.proposals.education}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-4 font-bold text-gray-700 sticky left-0 bg-gray-50 z-10">
                    🏥 Salud
                  </td>
                  {selected.map(candidate => (
                    <td key={candidate.id} className="p-4 text-gray-700">
                      {candidate.proposals.health}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4 font-bold text-gray-700 sticky left-0 bg-white z-10">
                    💼 Economía
                  </td>
                  {selected.map(candidate => (
                    <td key={candidate.id} className="p-4 text-gray-700">
                      {candidate.proposals.economy}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <td className="p-4 font-bold text-gray-700 sticky left-0 bg-gray-50 z-10">
                    🛡️ Seguridad
                  </td>
                  {selected.map(candidate => (
                    <td key={candidate.id} className="p-4 text-gray-700">
                      {candidate.proposals.security}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Plus size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-600">Selecciona al menos un candidato para comenzar la comparación</p>
        </div>
      )}
    </div>
  );
}
