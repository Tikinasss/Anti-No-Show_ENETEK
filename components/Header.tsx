'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Erreur récupération user:', error);
        return;
      }

      if (data.user) {
        setUserEmail(data.user.email || null);
        // full_name est dans user_metadata si défini lors de l'inscription
        setUserName((data.user.user_metadata as any)?.full_name || null);
      }
    };

    fetchUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth'); // redirection après déconnexion
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Dashboard Anti-No-Show</h1>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium">{userName || userEmail || 'Utilisateur'}</div>
          {userName && userEmail && (
            <div className="text-sm opacity-80">{userEmail}</div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </header>
  );
}
