// lib/supabase-auth.ts

// ─────────────────────────────────────────────
// 🔐 AUTH BASIQUE (mockées comme ton signIn/signUp)
// ─────────────────────────────────────────────

export const signIn = async (email: string, password: string) => {
  console.log('Connexion', email, password);
  return { user: { email } };
};

export const signUp = async (email: string, password: string) => {
  console.log('Inscription', email, password);
  return { user: { email } };
};

// ─────────────────────────────────────────────
// ✔️ FONCTIONS MANQUANTES (mockées aussi)
// ─────────────────────────────────────────────

// Récupère l'utilisateur actuel
export const getCurrentUser = async () => {
  return { id: "mock-id", email: "mock_user@example.com" };
};
// Récupère le profil utilisateur
export const getUserProfile = async (email: string) => {
  console.log('Récupération du profil pour', email);

  return {
    email,
    role: "user",
    name: "Mock User",
  };
};

// Déconnexion
export const signOut = async () => {
  console.log("Déconnexion utilisateur");
  return { success: true };
};

// Reset password
export const resetPassword = async (email: string) => {
  console.log("Reset password demandé pour", email);
  return { email };
};
