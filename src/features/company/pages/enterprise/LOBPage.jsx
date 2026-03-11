import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { companyService } from "../../../../services/companyService";
import { ENTERPRISE_MESSAGES } from "../../constants/enterprise";
import { Edit2, Trash2, Plus, Check, X, Loader2 } from "lucide-react";

export default function LOBPage() {
  const [lobs, setLobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLOB, setEditingLOB] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkEntries, setBulkEntries] = useState([{ name: "", description: "" }]);
  const [message, setMessage] = useState({ text: "", type: "" });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchLOBs = async () => {
    setLoading(true);
    try {
      const res = await companyService.getLOBs();
      setLobs(res?.data?.lobs || res?.lobs || []);
    } catch {
      setMessage({ text: "Failed to load LOBs", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLOBs(); }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const onSubmit = async (data) => {
    try {
      if (editingLOB) {
        await companyService.updateLOB(editingLOB._id, data);
        showMessage("success", ENTERPRISE_MESSAGES.LOB.UPDATE_SUCCESS);
      } else {
        await companyService.createLOB(data);
        showMessage("success", ENTERPRISE_MESSAGES.LOB.CREATE_SUCCESS);
      }
      reset();
      setEditingLOB(null);
      fetchLOBs();
    } catch {
      showMessage("error", "Failed to save LOB");
    }
  };

  const handleEdit = (lob) => {
    setEditingLOB(lob);
    setValue("name", lob.name);
    setValue("description", lob.description || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this LOB?")) return;
    try {
      await companyService.deleteLOB(id);
      showMessage("success", ENTERPRISE_MESSAGES.LOB.DELETE_SUCCESS);
      fetchLOBs();
    } catch {
      showMessage("error", "Failed to delete LOB");
    }
  };

  const addBulkRow = () => setBulkEntries([...bulkEntries, { name: "", description: "" }]);
  const removeBulkRow = (i) => {
    const next = bulkEntries.filter((_, idx) => idx !== i);
    setBulkEntries(next.length ? next : [{ name: "", description: "" }]);
  };
  const updateBulk = (i, field, value) => {
    const next = [...bulkEntries];
    next[i] = { ...next[i], [field]: value };
    setBulkEntries(next);
  };

  const onBulkSubmit = async () => {
    const valid = bulkEntries.filter((e) => e.name?.trim());
    if (!valid.length) {
      showMessage("error", "Add at least one LOB with a name");
      return;
    }
    try {
      await companyService.bulkCreateLOBs({ items: valid });
      showMessage("success", ENTERPRISE_MESSAGES.LOB.BULK_CREATE_SUCCESS);
      setBulkEntries([{ name: "", description: "" }]);
      setBulkMode(false);
      fetchLOBs();
    } catch {
      showMessage("error", "Failed to create LOBs");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">LOBs</h2>

      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">{editingLOB ? "Edit LOB" : bulkMode ? "Bulk Add" : "Add LOB"}</h3>
          {!editingLOB && (
            <button
              type="button"
              onClick={() => { setBulkMode(!bulkMode); if (!bulkMode) setBulkEntries([{ name: "", description: "" }]); }}
              className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              {bulkMode ? "Single" : "Bulk"}
            </button>
          )}
        </div>

        {bulkMode ? (
          <div className="space-y-4">
            <table className="min-w-full text-sm">
              <thead><tr><th className="text-left py-2">Name *</th><th className="text-left py-2">Description</th><th></th></tr></thead>
              <tbody>
                {bulkEntries.map((e, i) => (
                  <tr key={i}>
                    <td className="py-2"><input value={e.name} onChange={(ev) => updateBulk(i, "name", ev.target.value)} className="w-full border rounded px-2 py-1" placeholder="LOB Name" /></td>
                    <td className="py-2"><input value={e.description || ""} onChange={(ev) => updateBulk(i, "description", ev.target.value)} className="w-full border rounded px-2 py-1" placeholder="Description" /></td>
                    <td><button type="button" onClick={() => removeBulkRow(i)} disabled={bulkEntries.length === 1} className="text-red-600"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2">
              <button type="button" onClick={addBulkRow} className="text-sm px-3 py-1.5 border rounded-lg">Add Row</button>
              <button type="button" onClick={onBulkSubmit} className="text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-lg">Create All</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">LOB Name</label>
              <input {...register("name", { required: "Required" })} className="w-full border rounded-lg px-3 py-2" placeholder="LOB Name" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea {...register("description")} rows={2} className="w-full border rounded-lg px-3 py-2" placeholder="Description" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">{editingLOB ? "Update" : "Create"}</button>
              {editingLOB && <button type="button" onClick={() => { setEditingLOB(null); reset(); }} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>}
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold mb-4">LOBs List</h3>
        {loading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50"><tr><th className="text-left px-4 py-2">#</th><th className="text-left px-4 py-2">Name</th><th className="text-left px-4 py-2">Description</th><th className="text-left px-4 py-2">Actions</th></tr></thead>
              <tbody>
                {lobs.length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-slate-500 text-center">No LOBs yet</td></tr> : lobs.map((lob, i) => (
                  <tr key={lob._id} className="border-t">
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">{lob.name}</td>
                    <td className="px-4 py-3">{lob.description || "-"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleEdit(lob)} className="text-indigo-600 mr-2"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(lob._id)} className="text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
