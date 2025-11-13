'use client';

import { useEffect, useState } from 'react';
import { Appointment, AppointmentStats } from '@/lib/types';
import { getAppointments, getStats } from '@/lib/supabase';
import StatsCards from '@/components/StatsCards';
import Filters, { FilterState } from '@/components/Filters';
import AppointmentTable from '@/components/AppointmentTable';
import ExportButton from '@/components/ExportButton';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    confirmed: 0,
    rescheduled: 0,
    noShow: 0,
    pending: 0,
  });
  const [conseillers, setConseillers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, statsData] = await Promise.all([
        getAppointments(),
        getStats(),
      ]);

      setAppointments(appointmentsData);
      setFilteredAppointments(appointmentsData);
      setStats(statsData);

      // Extract unique conseillers
      const uniqueConseillers = [
        ...new Set(appointmentsData.map((a) => a.conseiller).filter(Boolean)),
      ];
      setConseillers(uniqueConseillers);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...appointments];

    if (filters.status) {
      filtered = filtered.filter((a) => a.status === filters.status);
    }

    if (filters.date) {
      filtered = filtered.filter((a) => a.date === filters.date);
    }

    if (filters.conseiller) {
      filtered = filtered.filter((a) => a.conseiller === filters.conseiller);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.prenom.toLowerCase().includes(search) ||
          a.objet.toLowerCase().includes(search)
      );
    }

    setFilteredAppointments(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Anti-No-Show
            </h1>
            <p className="text-gray-600 mt-1">
              Gestion et suivi des rendez-vous
            </p>
          </div>
          <ExportButton />
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Filters */}
        <Filters
          onFilterChange={handleFilterChange}
          conseillers={conseillers}
        />

        {/* Appointments Table */}
        <AppointmentTable appointments={filteredAppointments} />
      </div>
    </div>
  );
}
