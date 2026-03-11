import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companyService } from "../../../../services/companyService";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export default function RecruitersBulkPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([{ name: "", email: "", keySkills: "" }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const addRow = () => setEntries([...entries, { name: "", email: "", keySkills: "" }]);
  const removeRow = (i) => setEntries(entries.filter((_, idx) => idx !== i));
  const update = (i, field, value) => {
    const next = [...entries];
    next[i] = { ...next[i], [field]: value };
    setEntries(next);
  };

  const onSubmit = async () => {
    const valid = entries.filter((e) => e.name?.trim() && e.email?.trim());
    if (!valid.length) {
      alert("Add at least one row with name and email");
      return;
    }
    const items = valid.map((e) => ({
      name: e.name.trim(),
      email: e.email.trim(),
      keySkills: e.keySkills?.trim() || "",
    }));
    setLoading(true);
    setResult(null);
    try {
      const res = await companyService.bulkCreateRecruiters({ items });
      setResult(res?.data || res);
      if ((res?.data?.summary?.failed || res?.summary?.failed || 0) === 0) {
        setTimeout(() => navigate("/company/enterprise/recruiters"), 2000);
      }
    } catch (e) {
      setResult({ error: e?.response?.data?.error || "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/company/enterprise/recruiters")} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Bulk Add Recruiters</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <table className="min-w-full text-sm">
          <thead><tr><th className="text-left py-2">Name *</th><th className="text-left py-2">Email *</th><th className="text-left py-2">Key Skills</th><th></th></tr></thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i}>
                <td className="py-2"><input value={e.name} onChange={(ev) => update(i, "name", ev.target.value)} className="w-full border rounded px-2 py-1" placeholder="Name" /></td>
                <td className="py-2"><input type="email" value={e.email} onChange={(ev) => update(i, "email", ev.target.value)} className="w-full border rounded px-2 py-1" placeholder="email@company.com" /></td>
                <td className="py-2"><input value={e.keySkills} onChange={(ev) => update(i, "keySkills", ev.target.value)} className="w-full border rounded px-2 py-1" placeholder="JS, React" /></td>
                <td><button type="button" onClick={() => removeRow(i)} disabled={entries.length === 1} className="text-red-600"><Trash2 size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-2">
          <button type="button" onClick={addRow} className="text-sm px-3 py-1.5 border rounded-lg flex items-center gap-1"><Plus size={14} /> Add Row</button>
          <button type="button" onClick={onSubmit} disabled={loading} className="text-sm px-4 py-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-50">
            {loading ? "Creating..." : "Create All"}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          {result.error ? <p className="text-red-600">{result.error}</p> : (
            <p className="text-slate-700">
              Created: {result.summary?.successful ?? result.results?.length ?? 0}, Failed: {result.summary?.failed ?? 0}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
