// features/company/pages/CompanyProfile.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Building2, Mail, Globe, Phone, MapPin, Loader2, AlertCircle, CheckCircle, Link } from "lucide-react";
import { companyService } from "../../../services/companyService";
import { getCompanyUser, getCompanyId, saveCompanyUser } from "../../../utils/auth";

export default function CompanyProfile({ companyUser: propCompanyUser, companyId: propCompanyId, onRetry }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const companyId = propCompanyId ?? getCompanyId();
  const companyUser = propCompanyUser ?? getCompanyUser();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const imageLinkValue = watch("imageLink");

  // Live logo preview
  useEffect(() => {
    if (imageLinkValue) setLogoPreview(imageLinkValue);
  }, [imageLinkValue]);

  // FIX: include `reset` in deps array; show stale-data warning on API failure
  useEffect(() => {
    if (!companyId) {
      setError("Company ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await companyService.getProfile(companyId);
        const profile = res?.data || {};
        reset({
          companyName: profile.companyName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          website: profile.website || "",
          location: profile.location || "",
          industry: profile.industry || "",
          description: profile.description || "",
          imageLink: profile.imageLink || "",
        });
        if (profile.imageLink) setLogoPreview(profile.imageLink);
      } catch {
        setError("Could not load profile from server — showing last saved data.");
        reset({
          companyName: companyUser?.companyName || "",
          email: companyUser?.email || "",
          phone: companyUser?.phone || "",
          website: companyUser?.website || "",
          location: companyUser?.location || "",
          industry: companyUser?.industry || "",
          description: companyUser?.description || "",
          imageLink: companyUser?.imageLink || "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [companyId, reset]); // FIX: reset is now in the deps array

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await companyService.updateProfile(companyId, data);
      // FIX: use shared saveCompanyUser helper instead of raw localStorage
      saveCompanyUser(data);
      // Re-sync the form so isDirty resets to false
      reset(data);
      setSuccess(true);
      onRetry?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
        <p className="text-slate-500 mt-1">Manage your company information and settings.</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Profile updated successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 border-b pb-3">Basic Information</h2>

          {/* Logo preview */}
          {logoPreview && (
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="w-16 h-16 object-contain rounded-lg border border-gray-200 bg-white"
                onError={() => setLogoPreview("")}
              />
              <p className="text-xs text-slate-500">Logo preview — make sure the URL is publicly accessible.</p>
            </div>
          )}

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("companyName", { required: "Company name is required" })}
                type="text"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("email", {
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                })}
                type="email"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Phone & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register("phone")}
                  type="tel"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register("website")}
                  type="url"
                  placeholder="https://yourcompany.com"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location & Industry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register("location")}
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
              <input
                {...register("industry")}
                type="text"
                placeholder="e.g. Technology, Healthcare"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register("imageLink")}
                type="url"
                placeholder="https://yourcompany.com/logo.png"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Description</label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Tell candidates about your company, culture, and mission…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !isDirty}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}