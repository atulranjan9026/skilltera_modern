export function ErrorBanner({ message, onRetry }) {
    return (
        <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs font-medium">
            <span>⚠️</span> {message}
            {onRetry && (
                <button onClick={onRetry} className="ml-auto font-bold underline">
                    Retry
                </button>
            )}
        </div>
    );
}
