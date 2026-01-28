import React from 'react';
import { Users, Briefcase, TrendingUp, Clock } from 'lucide-react';

export default function DashboardHome() {
    const stats = [
        { label: 'Total Candidates', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Jobs', value: '45', change: '+3', icon: Briefcase, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Interviews', value: '12', change: '-2', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Placement Rate', value: '68%', change: '+5%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-slate-900 mb-4">Recent Activity</h3>
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                        Chart Component Placeholder
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px]">
                    <h3 className="font-bold text-slate-900 mb-4">Upcoming Interviews</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-900 group-hover:text-primary-500 transition-colors">Candidate Name</h4>
                                    <p className="text-sm text-slate-500">Sr. Frontend Developer • 2:00 PM</p>
                                </div>
                                <button className="text-xs font-medium px-3 py-1 bg-white border border-slate-200 rounded-full hover:bg-slate-50">
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
