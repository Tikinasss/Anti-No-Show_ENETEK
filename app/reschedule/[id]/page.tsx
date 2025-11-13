'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Appointment } from '@/lib/types';
import { getAppointmentById } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function ReschedulePage() {
  const params = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [rescheduled, setRescheduled] = useState(false);
  const [availableSlots] = useState([
    { date: dayjs().add(1, 'day').format('YYYY-MM-DD'), time: '09:00' },
    { date: dayjs().add(2, 'day').format('YYYY-MM-DD'), time: '14:00' },
    { date: dayjs().add(3, 'day').format('YYYY-MM-DD'), time: '10:30' },
  ]);

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadAppointment = async () => {
    try {
      const id = params.id as string;
      const apt = await getAppointmentById(id);
      setAppointment(apt);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (date: string, time: string) => {
    try {
      const response = await fetch(
        `/api/reschedule?id=${params.id}&date=${date}&time=${time}`,
        { method: 'POST' }
      );

      if (response.ok) {
        setRescheduled(true);
        toast.success('Rendez-vous reprogrammé !');
      }
    } catch (error) {
      toast.error('Erreur lors de la reprogrammation');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <span className="text-6xl">❌</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Rendez-vous introuvable
          </h1>
        </div>
      </div>
    );
  }

  if (rescheduled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <span className="text-6xl">🔄</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Rendez-vous reprogrammé !
          </h1>
          <p className="text-gray-600 mt-2">
            Vous recevrez une confirmation par SMS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Reprogrammer votre rendez-vous
        </h1>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">Rendez-vous actuel :</p>
          <p className="font-medium">{appointment.objet}</p>
          <p className="text-sm text-gray-600">
            {formatDate(appointment.date)} à {appointment.heure}
          </p>
        </div>

        <p className="text-gray-700 mb-4">
          Choisissez un nouveau créneau parmi les disponibilités suivantes :
        </p>

        <div className="space-y-3">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleReschedule(slot.date, slot.time)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <p className="font-medium">{formatDate(slot.date)}</p>
              <p className="text-sm text-gray-600">à {slot.time}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
