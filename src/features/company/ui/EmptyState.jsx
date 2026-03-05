export function EmptyState({ icon = "📭", message = "No data found" }) {
    return (
        <div className="flex flex-col items-center justify-center py-14">
            <span className="text-4xl mb-3">{icon}</span>
            <p className="text-sm font-medium text-slate-500">{message}</p>
        </div>
    );
}
