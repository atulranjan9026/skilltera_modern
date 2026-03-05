export function StatCard({ icon, label, value, sub, color }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>
                {icon}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
                <p className="text-sm font-medium text-slate-500 mt-0.5">{label}</p>
                {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
            </div>
        </div>
    );
}
