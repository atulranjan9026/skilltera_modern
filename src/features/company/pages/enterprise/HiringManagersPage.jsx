import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { companyService } from "../../../../services/companyService";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";

export default function HiringManagersPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await companyService.getHiringManagers();
      setList(res?.data?.hiringManagers || res?.hiringManagers || []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Hiring Manager?")) return;
    try {
      await companyService.deleteHiringManager(id);
      fetchData();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Hiring Managers</h2>
        <div className="flex gap-2">
          <Link to="/company/enterprise/hiring-managers/new" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
            <Plus size={16} /> Add
          </Link>
          <Link to="/company/enterprise/hiring-managers/bulk" className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
            Bulk Upload
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="text-left px-4 py-3">Name</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Actions</th></tr></thead>
            <tbody>
              {list.length === 0 ? <tr><td colSpan={3} className="px-4 py-12 text-slate-500 text-center">No hiring managers yet</td></tr> : list.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">
                    <Link to={`/company/enterprise/hiring-managers/${item._id}/edit`} className="text-indigo-600 mr-3 inline-flex items-center gap-1"><Edit2 size={14} /> Edit</Link>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 inline-flex items-center gap-1"><Trash2 size={14} /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
