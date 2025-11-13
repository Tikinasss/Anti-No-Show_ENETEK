import { NextResponse } from 'next/server';
import { getAppointments } from '@/lib/supabase';
import { formatDate, getStatusLabel } from '@/lib/utils';

export async function GET() {
  try {
    const appointments = await getAppointments();

    // Generate CSV
    const headers = [
      'ID',
      'Prénom',
      'Objet',
      'Date',
      'Heure',
      'Lieu/Lien',
      'Statut',
      'Conseiller',
      'Téléphone',
      'Créé le',
      'Dernière MAJ',
    ];

    const rows = appointments.map((apt) => [
      apt.id,
      apt.prenom,
      apt.objet,
      formatDate(apt.date),
      apt.heure,
      apt.lieu_lien || '',
      getStatusLabel(apt.status),
      apt.conseiller || '',
      apt.telephone || '',
      formatDate(apt.created_at),
      formatDate(apt.updated_at),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Add BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    return new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="appointments_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Erreur export:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'export' },
      { status: 500 }
    );
  }
}
