# 🚀 Anti-No-Show Dashboard

Dashboard Next.js 14 pour la gestion des rendez-vous et la réduction des no-shows.

## 📦 Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd anti-no-show-dashboard

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos credentials Supabase
```

## 🔐 Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Créer la table `appointments` avec le schéma SQL fourni
3. Copier l'URL et la clé anonyme dans `.env.local`

### Schéma SQL

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prenom VARCHAR(100) NOT NULL,
  objet VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  heure TIME NOT NULL,
  lieu_lien TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  conseiller VARCHAR(100),
  telephone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(date);
```

## 🏃‍♂️ Lancement

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## 📱 URLs du projet

- **Dashboard**: `http://localhost:3000`
- **Confirmation**: `http://localhost:3000/confirm/[id]`
- **Reprogrammation**: `http://localhost:3000/reschedule/[id]`
- **Désinscription**: `http://localhost:3000/optout/[id]`

## 🔗 Intégration SMS

Les liens à inclure dans vos SMS :
- Confirmation: `https://votredomaine.com/confirm/[ID_RDV]`
- Reprogrammation: `https://votredomaine.com/reschedule/[ID_RDV]`
- STOP: `https://votredomaine.com/optout/[ID_RDV]`

## 🌐 Déploiement

### Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement sur vercel.com
```

### Autres plateformes
- **Netlify**: Compatible avec Next.js
- **Railway**: Support natif de Next.js
- **VPS**: Utiliser PM2 pour la production

## 📊 Features

✅ Dashboard temps réel  
✅ Filtres avancés  
✅ Export CSV  
✅ Pages de confirmation/reprogrammation  
✅ Gestion des opt-outs  
✅ Responsive design  
✅ KPI en temps réel  

## 🔧 Technologies

- Next.js 14 (App Router)
- Supabase (PostgreSQL)
- TailwindCSS
- TypeScript
- Day.js
- React Hot Toast

## 📝 License

MIT
