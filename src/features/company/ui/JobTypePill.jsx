export function JobTypePill({ type }) {
    const map = {
        "Full Time": "bg-sky-50 text-sky-700",
        "Part Time": "bg-purple-50 text-purple-700",
        Contract: "bg-orange-50 text-orange-700",
        Internship: "bg-teal-50 text-teal-700",
    };
    return (
        <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${map[type] || "bg-slate-100 text-slate-600"}`}>
            {type}
        </span>
    );
}
