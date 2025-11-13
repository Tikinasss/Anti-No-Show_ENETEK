'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Appointment } from '@/lib/types';
import { getAppointmentById } from '@/lib/supabase';
import CalendarLink from '@/components/CalendarLink';
import { formatDateTime } from '@/lib/utils';

export default function ConfirmPage() {
  const params = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    loadAndConfirm();
  }, []);

  const loadAndConfirm = async () => {
    try {
      const id = params.id as string;
      const apt = await getAppointmentById(id);
      setAppointment(apt);

      // Confirm appointment
      const response = await fetch(`/api/confirm?id=${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        setConfirmed(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
          <p className="text-gray-600 mt-2">
            Ce lien n'est plus valide ou a expiré.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <span className="text-6xl">✅</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Rendez-vous confirmé !
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-gray-700 mb-2">
            Merci <strong>{appointment.prenom}</strong>, votre rendez-vous est
            confirmé :
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Objet :</strong> {appointment.objet}
            </p>
            <p>
              <strong>Date :</strong>{' '}
              {formatDateTime(appointment.date, appointment.heure)}
            </p>
            {appointment.lieu_lien && (
              <p>
                <strong>Lieu :</strong> {appointment.lieu_lien}
              </p>
            )}
            {appointment.conseiller && (
              <p>
                <strong>Avec :</strong> {appointment.conseiller}
              </p>
            )}
          </div>
        </div>

        <CalendarLink appointment={appointment} />

        <p className="text-xs text-gray-500 mt-6">
          Vous recevrez un rappel avant votre rendez-vous.
        </p>
      </div>
    </div>
  );
}