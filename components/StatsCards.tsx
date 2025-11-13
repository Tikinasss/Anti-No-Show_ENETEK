'use client';

import { AppointmentStats, calculatePercentage } from '@/lib/utils';

interface StatsCardsProps {
  stats: AppointmentStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const confirmRate = calculatePercentage(stats.confirmed, stats.total);
  const noShowRate = calculatePercentage(stats.noShow, stats.total);
  const rescheduleRate = calculatePercentage(stats.rescheduled, stats.total);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total rendez-vous"
        value={stats.total}
        icon="📅"
        color="bg-blue-50 border-blue-200"
      />
      <StatCard
        title="Taux de confirmation"
        value={`${confirmRate}%`}
        subtitle={`${stats.confirmed} confirmés`}
        icon="✅"
        color="bg-green-50 border-green-200"
      />
      <StatCard
        title="Taux de no-show"
        value={`${noShowRate}%`}
        subtitle={`${stats.noShow} absents`}
        icon="❌"
        color="bg-red-50 border-red-200"
      />
      <StatCard
        title="Reprogrammations"
        value={`${rescheduleRate}%`}
        subtitle={`${stats.rescheduled} reprogrammés`}
        icon="🔄"
        color="bg-purple-50 border-purple-200"
      />
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: any) {
  return (
    <div className={`${color} border rounded-lg p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
