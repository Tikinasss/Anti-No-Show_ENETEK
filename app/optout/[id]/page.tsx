'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function OptOutPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    handleOptOut();
  }, []);

  const handleOptOut = async () => {
    try {
      const response = await fetch(`/api/optout?id=${params.id}`, {
        method: 'POST',
      });

      if (response.ok) {
        setSuccess(true);
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <span className="text-6xl">🔕</span>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">
          {success ? 'Désinscription confirmée' : 'Erreur'}
        </h1>
        <p className="text-gray-600 mt-2">
          {success
            ? 'Vous avez été retiré de la liste des rappels. Merci.'
            : 'Une erreur est survenue. Veuillez réessayer.'}
        </p>
      </div>
    </div>
  );
}