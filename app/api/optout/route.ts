import { NextRequest, NextResponse } from 'next/server';
import { updateAppointmentStatus } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    const appointment = await updateAppointmentStatus(id, 'OPT_OUT');

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Erreur opt-out:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la désinscription' },
      { status: 500 }
    );
  }
}