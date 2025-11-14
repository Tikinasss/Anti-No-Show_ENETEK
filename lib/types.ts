export type AppointmentStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'RESCHEDULED' 
  | 'NO_SHOW' 
  | 'OPT_OUT';

export interface Appointment {
  id: string;
  prenom: string;
  phone?: string;
  email: string;
  date: string;
  heure: string;
  lieu: string;

  // 👉 AJOUTER ICI
  lieu_lien?: string;

  conseiller: string;
  objet: string;
  statut: string;
  langue: string;
  created_at: string;
  updated_at: string;
}


export interface AppointmentStats {
  total: number;
  confirmed: number;
  rescheduled: number;
  noShow: number;
  pending: number;
}

export interface UserProfile {
  id?: string;
  email: string;
  name?: string;
  full_name?: string; // ← AJOUTÉ
  role?: string;
  phone?: string;
}

interface FormData {
  prenom: string;
  phone: string;
  email: string;
  date?: string;
  heure?: string;
  [key: string]: any; // pour les champs dynamiques si besoin
}