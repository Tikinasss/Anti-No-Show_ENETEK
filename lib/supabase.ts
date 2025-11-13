import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions
export async function getAppointments(filters?: {
  status?: AppointmentStatus;
  date?: string;
  conseiller?: string;
}) {
  let query = supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.date) {
    query = query.eq('date', filters.date);
  }
  if (filters?.conseiller) {
    query = query.eq('conseiller', filters.conseiller);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data as Appointment[];
}

export async function getAppointmentById(id: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Appointment;
}

export async function updateAppointmentStatus(
  id: string, 
  status: AppointmentStatus,
  newDate?: string,
  newHeure?: string
) {
  const updateData: any = { 
    status, 
    updated_at: new Date().toISOString() 
  };

  if (newDate) updateData.date = newDate;
  if (newHeure) updateData.heure = newHeure;

  const { data, error } = await supabase
    .from('appointments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getStats(): Promise<AppointmentStats> {
  const { data, error } = await supabase
    .from('appointments')
    .select('status');

  if (error) throw error;

  const total = data.length;
  const confirmed = data.filter(a => a.status === 'CONFIRMED').length;
  const rescheduled = data.filter(a => a.status === 'RESCHEDULED').length;
  const noShow = data.filter(a => a.status === 'NO_SHOW').length;
  const pending = data.filter(a => a.status === 'PENDING').length;

  return { total, confirmed, rescheduled, noShow, pending };
}
