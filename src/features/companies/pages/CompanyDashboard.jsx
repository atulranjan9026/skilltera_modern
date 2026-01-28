import React from 'react';
import { Briefcase, Users, TrendingUp, MessageSquare } from 'lucide-react';

/**
 * Company Dashboard - Main dashboard for company/client users
 */
export default function CompanyDashboard() {
  const stats = [
    { label: 'Active Jobs', value: '8', change: '+2', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Applications', value: '124', change: '+15', icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Shortlisted', value: '18', change: '+4', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Messages', value: '7', change: '+3', icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Company Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your job postings and applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`${stat.bg} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-emerald-600 mt-2">{stat.change}</p>
                </div>
                <Icon className={`${stat.color} w-8 h-8`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Applications</h2>
        <p className="text-slate-500">Recent applications for your jobs will appear here.</p>
      </div>
    </div>
  );
}
