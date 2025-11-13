import { NextRequest, NextResponse } from 'next/server';
import { updateAppointmentStatus } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const date = searchParams.get('date');
    const time = searchParams.get('time');

    if (!id || !date || !time) {
      return NextResponse.json(
        { error: 'Paramètres manquants' },
        { status: 400 }
      );
    }

    const appointment = await updateAppointmentStatus(
      id,
      'RESCHEDULED',
      date,
      time
    );

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error('Erreur reprogrammation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la reprogrammation' },
      { status: 500 }
    );
  }
}