'use client';

import { AppointmentStatus } from '@/lib/types';

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  conseillers: string[];
}

export interface FilterState {
  status?: AppointmentStatus;
  date?: string;
  conseiller?: string;
  search?: string;
}

export default function Filters({ onFilterChange, conseillers }: FiltersProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ [key]: value || undefined });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recherche */}
        <input
          type="text"
          placeholder="Rechercher (prénom, objet...)"
          onChange={(e) => handleChange('search', e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Statut */}
        <select
          onChange={(e) => handleChange('status', e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="CONFIRMED">Confirmé</option>
          <option value="RESCHEDULED">Reprogrammé</option>
          <option value="NO_SHOW">Absent</option>
          <option value="OPT_OUT">Désinscrit</option>
        </select>

        {/* Date */}
        <input
          type="date"
          onChange={(e) => handleChange('date', e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* Conseiller */}
        <select
          onChange={(e) => handleChange('conseiller', e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tous les conseillers</option>
          {conseillers.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
