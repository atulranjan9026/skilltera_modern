import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { companyService } from "../../../../services/companyService";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function BackupHMFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [hiringManagers, setHiringManagers] = useState([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    companyService.getHiringManagers().then((res) => {
      const list = res?.data?.hiringManagers || res?.hiringManagers || [];
      setHiringManagers(list);
    });
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      companyService.getBackupHiringManagers().then((res) => {
        const list = res?.data?.backupHiringManagers || res?.backupHiringManagers || [];
        const item = list.find((b) => b._id === id);
        if (item) {
          setValue("name", item.name);
          setValue("email", item.email);
          setValue("hiringManagerId", item.hiringManagerId?._id || "");
        }
      });
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, hiringManagerId: data.hiringManagerId || undefined };
      if (isEdit) {
        await companyService.updateBackupHiringManager(id, payload);
      } else {
        await companyService.createBackupHiringManager(payload);
      }
      navigate("/company/enterprise/backup-hms");
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <button onClick={() => navigate("/company/enterprise/backup-hms")} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <h2 className="text-xl font-semibold text-slate-900 mb-6">{isEdit ? "Edit Backup Hiring Manager" : "Add Backup Hiring Manager"}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white rounded-xl border border-slate-200 p-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
          <input {...register("name", { required: "Required", minLength: { value: 3, message: "Min 3 characters" } })} className="w-full border rounded-lg px-3 py-2" placeholder="Full name" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
          <input type="email" {...register("email", { required: "Required" })} className="w-full border rounded-lg px-3 py-2" placeholder="email@company.com" disabled={isEdit} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Primary Hiring Manager</label>
          <select {...register("hiringManagerId")} className="w-full border rounded-lg px-3 py-2">
            <option value="">— None —</option>
            {hiringManagers.map((hm) => (
              <option key={hm._id} value={hm._id}>{hm.name} ({hm.email})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? "Update" : "Create"}
          </button>
          <button type="button" onClick={() => navigate("/company/enterprise/backup-hms")} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
