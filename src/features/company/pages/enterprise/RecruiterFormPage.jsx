import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { companyService } from "../../../../services/companyService";
import { ArrowLeft } from "lucide-react";

export default function RecruiterFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit && id) {
      companyService.getRecruiters().then((res) => {
        const list = res?.data?.recruiters || res?.recruiters || [];
        const item = list.find((r) => r._id === id);
        if (item) {
          setValue("name", item.name);
          setValue("email", item.email);
          setValue("keySkills", Array.isArray(item.keySkills) ? item.keySkills.join(", ") : item.keySkills || "");
        }
      });
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        keySkills: data.keySkills ? data.keySkills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      if (isEdit) {
        await companyService.updateRecruiter(id, payload);
      } else {
        await companyService.createRecruiter(payload);
      }
      navigate("/company/enterprise/recruiters");
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <button onClick={() => navigate("/company/enterprise/recruiters")} className="flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-6">
        <ArrowLeft size={16} /> Back
      </button>
      <h2 className="text-xl font-semibold text-slate-900 mb-6">{isEdit ? "Edit Recruiter" : "Add Recruiter"}</h2>

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
          <label className="block text-sm font-medium text-slate-700 mb-1">Key Skills (comma-separated)</label>
          <input {...register("keySkills")} className="w-full border rounded-lg px-3 py-2" placeholder="JavaScript, React, Node.js" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
          <button type="button" onClick={() => navigate("/company/enterprise/recruiters")} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
