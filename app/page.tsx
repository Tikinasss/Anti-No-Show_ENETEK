// 'use client';

// import { useEffect, useState } from 'react';
// import { Appointment, AppointmentStats } from '@/lib/types';
// import { getAppointments, getStats } from '@/lib/supabase';
// import StatsCards from '@/components/StatsCards';
// import Filters, { FilterState } from '@/components/Filters';
// import AppointmentTable from '@/components/AppointmentTable';
// import ExportButton from '@/components/ExportButton';
// import toast from 'react-hot-toast';

// export default function DashboardPage() {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
//   const [stats, setStats] = useState<AppointmentStats>({
//     total: 0,
//     confirmed: 0,
//     rescheduled: 0,
//     noShow: 0,
//     pending: 0,
//   });
//   const [conseillers, setConseillers] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       const [appointmentsData, statsData] = await Promise.all([
//         getAppointments(),
//         getStats(),
//       ]);

//       setAppointments(appointmentsData);
//       setFilteredAppointments(appointmentsData);
//       setStats(statsData);

//       // Extract unique conseillers
//       const uniqueConseillers = [
//         ...new Set(appointmentsData.map((a) => a.conseiller).filter(Boolean)),
//       ];
//       setConseillers(uniqueConseillers);
//     } catch (error) {
//       toast.error('Erreur lors du chargement des données');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (filters: FilterState) => {
//     let filtered = [...appointments];

//     if (filters.status) {
//       filtered = filtered.filter((a) => a.status === filters.status);
//     }

//     if (filters.date) {
//       filtered = filtered.filter((a) => a.date === filters.date);
//     }

//     if (filters.conseiller) {
//       filtered = filtered.filter((a) => a.conseiller === filters.conseiller);
//     }

//     if (filters.search) {
//       const search = filters.search.toLowerCase();
//       filtered = filtered.filter(
//         (a) =>
//           a.prenom.toLowerCase().includes(search) ||
//           a.objet.toLowerCase().includes(search)
//       );
//     }

//     setFilteredAppointments(filtered);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Dashboard Anti-No-Show
//             </h1>
//             <p className="text-gray-600 mt-1">
//               Gestion et suivi des rendez-vous
//             </p>
//           </div>
//           <ExportButton />
//         </div>

//         {/* Stats Cards */}
//         <StatsCards stats={stats} />

//         {/* Filters */}
//         <Filters
//           onFilterChange={handleFilterChange}
//           conseillers={conseillers}
//         />

//         {/* Appointments Table */}
//         <AppointmentTable appointments={filteredAppointments} />
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { signUp, signIn } from '@/lib/supabase-auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Nom complet requis';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast.success('Connexion réussie !');
        router.push('/formulaire');
      } else {
        // Ici : remplace ton signUp existant par celui-ci
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: { data: { full_name: formData.fullName } }
        });
        toast.success('Compte créé ! Vérifiez votre email.');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Lock className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-2">
              {isLogin ? 'Bon retour !' : 'Créer un compte'}
            </h2>
            <p className="text-center text-indigo-100">
              {isLogin ? 'Connectez-vous pour continuer' : 'Rejoignez-nous aujourd\'hui'}
            </p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* Full Name */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Jean Dupont"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="vous@exemple.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Forgot Password */}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/reset-password')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span>{isLogin ? 'Se connecter' : 'Créer un compte'}</span>
                </>
              )}
            </button>

            {/* Toggle */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="ml-2 text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  {isLogin ? 'Créer un compte' : 'Se connecter'}
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-white/90 text-sm">
          🔒 Vos données sont sécurisées et cryptées
        </p>
      </div>
    </div>
  );
}
