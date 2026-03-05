export function PaginationBar({ currentPage, totalPages, totalItems, itemLabel = "items", onPrev, onNext, loading }) {
    if (totalPages <= 1 && !loading) return null;

    const btnBase = "px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all";
    const btnActive = "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700";
    const btnDisabled = "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed";

    return (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
            <p className="text-xs text-slate-500">
                Page <span className="font-semibold text-slate-700">{currentPage}</span> of{" "}
                <span className="font-semibold text-slate-700">{Math.max(totalPages, 1)}</span>
                {totalItems > 0 && (
                    <span className="ml-1.5 text-slate-400">· {totalItems} total {itemLabel}</span>
                )}
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={onPrev}
                    disabled={currentPage <= 1 || loading}
                    className={`${btnBase} ${currentPage > 1 && !loading ? btnActive : btnDisabled}`}
                >
                    ← Prev
                </button>
                <button
                    onClick={onNext}
                    disabled={currentPage >= totalPages || loading}
                    className={`${btnBase} ${currentPage < totalPages && !loading ? btnActive : btnDisabled}`}
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
