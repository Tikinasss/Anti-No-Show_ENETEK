import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

export function formatDate(date: string): string {
  return dayjs(date).format('DD/MM/YYYY');
}


export type AppointmentStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'RESCHEDULED'
  | 'NO_SHOW'
  | 'OPT_OUT';


export interface AppointmentStats {
  total: number;
  confirmed: number;
  pending: number;
  rescheduled: number;
  noShow: number;
  optOut: number;
}

export interface Appointment {
  date: string;          // ex: '2025-11-14'
  heure: string;         // ex: '14:30'
  objet: string;         // ex: 'Rendez-vous médical'
  lieu_lien: string;     // ex: 'Cabinet médical / lien visioconf'
  conseiller: string;    // ex: 'Dr. Dupont'
  status: AppointmentStatus; // le statut du rendez-vous
}

export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} à ${time}`;
}

export function getStatusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmé',
    RESCHEDULED: 'Reprogrammé',
    NO_SHOW: 'Absent',
    OPT_OUT: 'Désinscrit'
  };
  return labels[status];
}

export function getStatusColor(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    RESCHEDULED: 'bg-blue-100 text-blue-800',
    NO_SHOW: 'bg-red-100 text-red-800',
    OPT_OUT: 'bg-gray-100 text-gray-800'
  };
  return colors[status];
}

export function generateICS(appointment: Appointment): string {
  const start = dayjs(`${appointment.date} ${appointment.heure}`);
  const end = start.add(1, 'hour');
  
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start.format('YYYYMMDDTHHmmss')}
DTEND:${end.format('YYYYMMDDTHHmmss')}
SUMMARY:${appointment.objet}
LOCATION:${appointment.lieu_lien}
DESCRIPTION:Rendez-vous confirmé avec ${appointment.conseiller}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}
