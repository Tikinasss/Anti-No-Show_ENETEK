export type AppointmentStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'RESCHEDULED' 
  | 'NO_SHOW' 
  | 'OPT_OUT';

export interface Appointment {
  id: string;
  prenom: string;
  objet: string;
  date: string;
  heure: string;
  lieu_lien: string;
  status: AppointmentStatus;
  conseiller: string;
  telephone: string;
  updated_at: string;
  created_at: string;
}

export interface AppointmentStats {
  total: number;
  confirmed: number;
  rescheduled: number;
  noShow: number;
  pending: number;
}