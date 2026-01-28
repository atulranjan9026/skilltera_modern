import React from 'react';
import { Briefcase, FileText, TrendingUp, Clock } from 'lucide-react';

export default function CandidateDashboard() {
    const stats = [
        { label: 'Applications', value: '12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Interviews', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Job Matches', value: '45', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Profile Views', value: '128', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Welcome Back!</h1>
                <p className="text-slate-500 mt-1">Here's your job search overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className={`p-3 rounded-lg ${stat.bg} ${stat.color} inline-flex mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Recent Applications</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-900">Senior Frontend Developer</h4>
                                    <p className="text-sm text-slate-500">Tech Company • Applied 2 days ago</p>
                                </div>
                                <span className="text-xs font-medium px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
                                    Pending
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Recommended Jobs</h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-lg bg-primary-50 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">
                                        Full Stack Engineer
                                    </h4>
                                    <p className="text-sm text-slate-500">Startup Inc • Remote</p>
                                </div>
                                <button className="text-xs font-medium px-3 py-1 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                                    Apply
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
