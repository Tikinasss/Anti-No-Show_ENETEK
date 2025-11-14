'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useParams } from 'next/navigation';

interface FormData {
  id?: string;
  prenom: string;
  phone: string;
  email?: string;
  date: string;
  heure: string;
  lieu?: string;
  conseiller?: string;
  objet: string;
  langue: 'FR' | 'EN';
}

const RescheduleForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id;

  const [formData, setFormData] = useState<FormData>({
    prenom: '',
    phone: '',
    email: '',
    date: '',
    heure: '',
    lieu: '',
    conseiller: '',
    objet: '',
    langue: 'FR'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les infos du rendez-vous
  useEffect(() => {
    if (!appointmentId) return;
    supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single()
      .then(({ data }) => {
        if (data) setFormData(data);
      });
  }, [appointmentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await supabase
        .from('appointments')
        .update({ ...formData, statut: 'RESCHEDULED' })
        .eq('id', appointmentId);

      alert('Rendez-vous reprogrammé avec succès !');
      router.push('/dashboard'); // Retour au dashboard
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la reprogrammation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h1 className="text-2xl font-bold mb-4">Reprogrammer le RDV</h1>

      <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" className="w-full mb-3 p-2 border rounded" />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Téléphone" className="w-full mb-3 p-2 border rounded" />
      <input name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full mb-3 p-2 border rounded" />
      <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
      <input type="time" name="heure" value={formData.heure} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />
      <textarea name="objet" value={formData.objet} onChange={handleChange} placeholder="Objet" className="w-full mb-3 p-2 border rounded" />
      <select name="langue" value={formData.langue} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
        <option value="FR">Français</option>
        <option value="EN">English</option>
      </select>

      <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded">
        {isSubmitting ? 'Envoi...' : 'Reprogrammer'}
      </button>
    </div>
  );
};

export default RescheduleForm;
