import { NextResponse } from 'next/server';
import { getStats } from '@/lib/supabase';

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des stats' },
      { status: 500 }
    );
  }
}

// Réactive la route toutes les 60 secondes
export const revalidate = 60;