export function PaginationBar({ currentPage, totalPages, totalItems, itemLabel = "items", onPrev, onNext, loading, onPageClick }) {
    if (totalPages <= 1 && !loading) return null;

    const btnBase = "px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all";
    const btnActive = "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700";
    const btnDisabled = "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed";
    const btnPage = "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all";
    const btnPageActive = "bg-indigo-600 border-indigo-600 text-white";
    const btnPageNormal = "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600";

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Show max 5 page numbers
        
        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show pages around current page
            const half = Math.floor(maxVisible / 2);
            let start = Math.max(1, currentPage - half);
            let end = Math.min(totalPages, start + maxVisible - 1);
            
            // Adjust if we're near the end
            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

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
                
                {/* Page number buttons */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => onPageClick?.(pageNum)}
                            disabled={loading}
                            className={`${btnPage} ${
                                pageNum === currentPage 
                                    ? btnPageActive 
                                    : btnPageNormal
                            } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>
                
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
