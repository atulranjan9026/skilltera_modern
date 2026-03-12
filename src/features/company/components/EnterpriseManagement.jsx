import React, { useState, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { companyService } from "../../../services/companyService";
import { getCompanyId } from "../../../utils/auth";
import { ENTERPRISE_MESSAGES } from "../constants/enterprise";
import { Users, UserPlus, Edit2, Trash2, Plus, X, Check, AlertCircle, Loader2 } from "lucide-react";

// ─── UI Primitives ────────────────────────────────────────────────────────────

const TabView = ({ activeIndex, onTabChange, children }) => (
  <div className="w-full">
    <div className="flex border-b border-gray-200">
      {React.Children.map(children, (child, index) => (
        <button
          key={index}
          onClick={() => onTabChange(index)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeIndex === index
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {child.props.header}
        </button>
      ))}
    </div>
    <div className="mt-4">{children[activeIndex]}</div>
  </div>
);

const TabPanel = ({ children }) => children;

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    <div className="p-6">{children}</div>
  </div>
);

const InputText = forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
));
InputText.displayName = "InputText";

const InputTextarea = forwardRef(({ className = "", rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
    {...props}
  />
));
InputTextarea.displayName = "InputTextarea";

const Btn = ({ label, icon: Icon, className = "", children, ...props }) => (
  <button
    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${className}`}
    {...props}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {label || children}
  </button>
);

const Dropdown = forwardRef(({ options, className = "", ...props }, ref) => (
  <select
    ref={ref}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  >
    {options.map((opt, i) => (
      <option key={i} value={opt.value}>{opt.label}</option>
    ))}
  </select>
));
Dropdown.displayName = "Dropdown";

const DataTable = ({ value, children, emptyMessage = "No data found", loading = false }) => {
  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>;
  if (!value || value.length === 0) return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  return <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200">{children}</table></div>;
};

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

const ConfirmDialog = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ background: "rgba(15,15,20,0.6)", backdropFilter: "blur(4px)", animation: "fadeIn 0.15s ease" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        style={{ animation: "slideUp 0.2s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {/* Header */}
        <div className="p-6" style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>
            Confirm Delete
          </h3>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
          <p className="text-gray-400 text-xs mt-1">This action cannot be undone.</p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              boxShadow: "0 2px 10px rgba(239,68,68,0.3)",
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.97) } to { opacity:1; transform:none } }
      `}</style>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EnterpriseManagement() {
  const [activeTab, setActiveTab] = useState("lob");
  const [loading, setLoading] = useState(false);
  const companyId = getCompanyId();

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: "", resolve: null });

  // LOB State
  const [lobs, setLobs] = useState([]);
  const [editingLOB, setEditingLOB] = useState(null);
  const [bulkModeLOB, setBulkModeLOB] = useState(false);
  const [bulkEntriesLOB, setBulkEntriesLOB] = useState([{ name: "", description: "" }]);

  // Hiring Manager State
  const [hiringManagers, setHiringManagers] = useState([]);
  const [editingHiringManager, setEditingHiringManager] = useState(null);
  const [bulkModeHM, setBulkModeHM] = useState(false);
  const [bulkEntriesHM, setBulkEntriesHM] = useState([{ name: "", email: "" }]);

  // Backup Hiring Manager State
  const [backupHiringManagers, setBackupHiringManagers] = useState([]);
  const [editingBackupHiringManager, setEditingBackupHiringManager] = useState(null);

  // Recruiter State
  const [recruiters, setRecruiters] = useState([]);
  const [editingRecruiter, setEditingRecruiter] = useState(null);
  const [bulkModeRecruiter, setBulkModeRecruiter] = useState(false);
  const [bulkEntriesRecruiter, setBulkEntriesRecruiter] = useState([{ name: "", email: "", keySkills: "" }]);
  const [keySkills, setKeySkills] = useState("");

  // Message State
  const [message, setMessage] = useState({ type: "", text: "" });

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  // ── Forms ──────────────────────────────────────────────────────────────────

  const { register: registerLOB, handleSubmit: handleSubmitLOB, reset: resetLOB, formState: { errors: errorsLOB } } = useForm();
  const { register: registerHM, handleSubmit: handleSubmitHM, reset: resetHM, formState: { errors: errorsHM } } = useForm();
  const { register: registerBHM, handleSubmit: handleSubmitBHM, reset: resetBHM, formState: { errors: errorsBHM } } = useForm();
  const { register: registerRecruiter, handleSubmit: handleSubmitRecruiter, reset: resetRecruiter, formState: { errors: errorsRecruiter } } = useForm();

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (companyId) fetchAllData();
  }, [companyId]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  /** Returns a Promise that resolves true/false based on user action */
  const showConfirmationDialog = (message) =>
    new Promise((resolve) => {
      setConfirmDialog({ open: true, message, resolve });
    });

  const handleDialogConfirm = () => {
    confirmDialog.resolve(true);
    setConfirmDialog({ open: false, message: "", resolve: null });
  };

  const handleDialogCancel = () => {
    confirmDialog.resolve(false);
    setConfirmDialog({ open: false, message: "", resolve: null });
  };

  const resetAllEditing = () => {
    setEditingLOB(null);
    setEditingHiringManager(null);
    setEditingBackupHiringManager(null);
    setEditingRecruiter(null);
    resetLOB();
    resetHM();
    resetBHM();
    resetRecruiter();
    setKeySkills("");
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchLOBs(), fetchHiringManagers(), fetchBackupHiringManagers(), fetchRecruiters()]);
    } catch {
      showMessage("error", "Failed to load enterprise data");
    } finally {
      setLoading(false);
    }
  };

  const fetchLOBs = async () => {
    try { const r = await companyService.getLOBs(); setLobs(r.lobs || []); }
    catch (e) { console.error("Failed to fetch LOBs:", e); }
  };

  const fetchHiringManagers = async () => {
    try { const r = await companyService.getHiringManagers(); setHiringManagers(r.hiringManagers || []); }
    catch (e) { console.error("Failed to fetch hiring managers:", e); }
  };

  const fetchBackupHiringManagers = async () => {
    try { const r = await companyService.getBackupHiringManagers(); setBackupHiringManagers(r.backupHiringManagers || []); }
    catch (e) { console.error("Failed to fetch backup hiring managers:", e); }
  };

  const fetchRecruiters = async () => {
    try { const r = await companyService.getRecruiters(); setRecruiters(r.recruiters || []); }
    catch (e) { console.error("Failed to fetch recruiters:", e); }
  };

  // ── Delete error handler ───────────────────────────────────────────────────

  const handleDeleteError = (error, entity) => {
    if (error.response?.status === 404) showMessage("error", `${entity} not found`);
    else if (error.response?.status === 403) showMessage("error", `Insufficient permissions to delete ${entity}`);
    else showMessage("error", error.response?.data?.error || error.response?.data?.message || `Failed to delete ${entity}`);
    console.error(`${entity} deletion error:`, error);
  };

  // ── LOB Handlers ──────────────────────────────────────────────────────────

  const onSubmitLOB = async (data) => {
    try {
      if (editingLOB) {
        await companyService.updateLOB(editingLOB._id, data);
        showMessage("success", ENTERPRISE_MESSAGES.LOB.UPDATE_SUCCESS);
      } else {
        await companyService.createLOB(data);
        showMessage("success", ENTERPRISE_MESSAGES.LOB.CREATE_SUCCESS);
      }
      resetLOB(); setEditingLOB(null); fetchLOBs();
    } catch (error) {
      showMessage("error", error.response?.data?.error || error.response?.data?.message || "Failed to save LOB");
    }
  };

  const handleEditLOB = (lob) => {
    setEditingLOB(lob);
    resetLOB({ name: lob.name, description: lob.description || "" });
  };

  const handleDeleteLOB = async (lobId) => {
    if (!await showConfirmationDialog("Are you sure you want to delete this LOB?")) return;
    try {
      await companyService.deleteLOB(lobId);
      showMessage("success", ENTERPRISE_MESSAGES.LOB.DELETE_SUCCESS);
      fetchLOBs();
    } catch (error) { handleDeleteError(error, "LOB"); }
  };

  // ── Hiring Manager Handlers ────────────────────────────────────────────────

  const onSubmitHiringManager = async (data) => {
    try {
      if (editingHiringManager) {
        await companyService.updateHiringManager(editingHiringManager._id, data);
        showMessage("success", ENTERPRISE_MESSAGES.HIRING_MANAGER.UPDATE_SUCCESS);
      } else {
        await companyService.createHiringManager(data);
        showMessage("success", ENTERPRISE_MESSAGES.HIRING_MANAGER.CREATE_SUCCESS);
      }
      resetHM(); setEditingHiringManager(null); fetchHiringManagers();
    } catch (error) {
      showMessage("error", error.response?.data?.error || error.response?.data?.message || "Failed to save Hiring Manager");
    }
  };

  const handleEditHiringManager = (hm) => {
    setEditingHiringManager(hm);
    resetHM({ name: hm.name, email: hm.email });
  };

  const handleDeleteHiringManager = async (hmId) => {
    if (!await showConfirmationDialog("Are you sure you want to delete this Hiring Manager?")) return;
    try {
      await companyService.deleteHiringManager(hmId);
      showMessage("success", ENTERPRISE_MESSAGES.HIRING_MANAGER.DELETE_SUCCESS);
      fetchHiringManagers();
    } catch (error) { handleDeleteError(error, "Hiring Manager"); }
  };

  // ── Backup Hiring Manager Handlers ────────────────────────────────────────

  const onSubmitBackupHiringManager = async (data) => {
    try {
      if (editingBackupHiringManager) {
        await companyService.updateBackupHiringManager(editingBackupHiringManager._id, data);
        showMessage("success", ENTERPRISE_MESSAGES.BACKUP_HIRING_MANAGER.UPDATE_SUCCESS);
      } else {
        await companyService.createBackupHiringManager(data);
        showMessage("success", ENTERPRISE_MESSAGES.BACKUP_HIRING_MANAGER.CREATE_SUCCESS);
      }
      resetBHM(); setEditingBackupHiringManager(null); fetchBackupHiringManagers();
    } catch (error) {
      showMessage("error", error.response?.data?.error || error.response?.data?.message || "Failed to save Backup Hiring Manager");
    }
  };

  const handleEditBackupHiringManager = (bhm) => {
    setEditingBackupHiringManager(bhm);
    resetBHM({ name: bhm.name, email: bhm.email, hiringManagerId: bhm.hiringManagerId?._id || bhm.hiringManagerId || "" });
  };

  const handleDeleteBackupHiringManager = async (bhmId) => {
    if (!await showConfirmationDialog("Are you sure you want to delete this Backup Hiring Manager?")) return;
    try {
      await companyService.deleteBackupHiringManager(bhmId);
      showMessage("success", ENTERPRISE_MESSAGES.BACKUP_HIRING_MANAGER.DELETE_SUCCESS);
      fetchBackupHiringManagers();
    } catch (error) { handleDeleteError(error, "Backup Hiring Manager"); }
  };

  // ── Recruiter Handlers ────────────────────────────────────────────────────

  const onSubmitRecruiter = async (data) => {
    const keySkillsArray = keySkills.split(",").map((s) => s.trim()).filter(Boolean);
    try {
      if (editingRecruiter) {
        await companyService.updateRecruiter(editingRecruiter._id, { ...data, keySkills: keySkillsArray });
        showMessage("success", ENTERPRISE_MESSAGES.RECRUITER.UPDATE_SUCCESS);
      } else {
        await companyService.createRecruiter({ ...data, keySkills: keySkillsArray });
        showMessage("success", ENTERPRISE_MESSAGES.RECRUITER.CREATE_SUCCESS);
      }
      resetRecruiter(); setKeySkills(""); setEditingRecruiter(null); fetchRecruiters();
    } catch (error) {
      showMessage("error", error.response?.data?.error || error.response?.data?.message || "Failed to save Recruiter");
    }
  };

  const handleEditRecruiter = (recruiter) => {
    setEditingRecruiter(recruiter);
    resetRecruiter({ name: recruiter.name, email: recruiter.email });
    setKeySkills(recruiter.keySkills?.join(", ") || "");
  };

  const handleDeleteRecruiter = async (recruiterId) => {
    if (!await showConfirmationDialog("Are you sure you want to delete this Recruiter?")) return;
    try {
      await companyService.deleteRecruiter(recruiterId);
      showMessage("success", ENTERPRISE_MESSAGES.RECRUITER.DELETE_SUCCESS);
      fetchRecruiters();
    } catch (error) { handleDeleteError(error, "Recruiter"); }
  };

  // ── Bulk Helpers ──────────────────────────────────────────────────────────

  const addBulkRow = (type) => {
    if (type === "lob") setBulkEntriesLOB([...bulkEntriesLOB, { name: "", description: "" }]);
    else if (type === "hm") setBulkEntriesHM([...bulkEntriesHM, { name: "", email: "" }]);
    else if (type === "recruiter") setBulkEntriesRecruiter([...bulkEntriesRecruiter, { name: "", email: "", keySkills: "" }]);
  };

  const removeBulkRow = (type, index) => {
    const update = (arr, empty) => { const n = arr.filter((_, i) => i !== index); return n.length ? n : [empty]; };
    if (type === "lob") setBulkEntriesLOB(update(bulkEntriesLOB, { name: "", description: "" }));
    else if (type === "hm") setBulkEntriesHM(update(bulkEntriesHM, { name: "", email: "" }));
    else if (type === "recruiter") setBulkEntriesRecruiter(update(bulkEntriesRecruiter, { name: "", email: "", keySkills: "" }));
  };

  const updateBulkEntry = (type, index, field, value) => {
    const update = (arr, setter) => { const n = [...arr]; n[index][field] = value; setter(n); };
    if (type === "lob") update(bulkEntriesLOB, setBulkEntriesLOB);
    else if (type === "hm") update(bulkEntriesHM, setBulkEntriesHM);
    else if (type === "recruiter") update(bulkEntriesRecruiter, setBulkEntriesRecruiter);
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // ── Filtered Data ─────────────────────────────────────────────────────────

  const s = searchTerm.toLowerCase();
  const filteredLobs = lobs.filter(l => l.name.toLowerCase().includes(s) || l.description?.toLowerCase().includes(s));
  const filteredHMs = hiringManagers.filter(h => h.name.toLowerCase().includes(s) || h.email.toLowerCase().includes(s));
  const filteredBHMs = backupHiringManagers.filter(b => b.name.toLowerCase().includes(s) || b.email.toLowerCase().includes(s) || b.hiringManagerId?.name?.toLowerCase().includes(s));
  const filteredRecruiters = recruiters.filter(r => r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || r.keySkills?.some(sk => sk.toLowerCase().includes(s)));

  const tabKeys = ["lob", "hiringManager", "backupHiringManager", "recruiter"];

  // ── Shared table styles ───────────────────────────────────────────────────

  const thClass = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tdClass = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enterprise Management</h1>
          <p className="text-gray-500 mt-1">Manage your company's organizational structure</p>
        </div>
        <div className="relative w-full md:w-64">
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="pl-10"
          />
          <Users className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Toast */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        </div>
      )}

      {/* Tabs */}
      <TabView
        activeIndex={tabKeys.indexOf(activeTab)}
        onTabChange={(i) => { setActiveTab(tabKeys[i]); resetAllEditing(); }}
      >
        {/* ── LOBs Tab ──────────────────────────────────────────────────────── */}
        <TabPanel header="LOBs">
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editingLOB ? "Edit LOB" : bulkModeLOB ? "Bulk Add LOBs" : "Add LOB"}</h3>
                {!editingLOB && (
                  <Btn label={bulkModeLOB ? "Single Mode" : "Bulk Mode"} icon={bulkModeLOB ? Users : Plus}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => { setBulkModeLOB(!bulkModeLOB); if (!bulkModeLOB) setBulkEntriesLOB([{ name: "", description: "" }]); }}
                  />
                )}
              </div>

              {bulkModeLOB ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className={thClass}>LOB Name *</th>
                          <th className={thClass}>Description</th>
                          <th className={thClass}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulkEntriesLOB.map((entry, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4"><InputText value={entry.name} onChange={(e) => updateBulkEntry("lob", i, "name", e.target.value)} placeholder="LOB Name" /></td>
                            <td className="px-6 py-4"><InputText value={entry.description || ""} onChange={(e) => updateBulkEntry("lob", i, "description", e.target.value)} placeholder="Description (Optional)" /></td>
                            <td className="px-6 py-4"><Btn icon={Trash2} className="text-red-600 hover:text-red-800" onClick={() => removeBulkRow("lob", i)} disabled={bulkEntriesLOB.length === 1} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2">
                    <Btn label="Add Row" icon={Plus} className="border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => addBulkRow("lob")} />
                    <Btn label="Create All" icon={Check} className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={async () => {
                        const valid = bulkEntriesLOB.filter(e => e.name?.trim());
                        if (!valid.length) { showMessage("error", "Please add at least one LOB with a name"); return; }
                        try {
                          await companyService.bulkCreateLOBs({ items: valid });
                          showMessage("success", ENTERPRISE_MESSAGES.LOB.BULK_CREATE_SUCCESS);
                          setBulkEntriesLOB([{ name: "", description: "" }]); setBulkModeLOB(false); fetchLOBs();
                        } catch { showMessage("error", "Failed to create LOBs"); }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitLOB(onSubmitLOB)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LOB Name</label>
                    <InputText {...registerLOB("name", { required: "LOB Name is required" })} placeholder="LOB Name" />
                    {errorsLOB.name && <p className="text-red-500 text-xs mt-1">{errorsLOB.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <InputTextarea {...registerLOB("description")} placeholder="Description" rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Btn type="submit" label={editingLOB ? "Update" : "Create"} icon={editingLOB ? Check : Plus} className="bg-blue-600 text-white hover:bg-blue-700" />
                    {editingLOB && <Btn type="button" label="Cancel" icon={X} className="border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => { setEditingLOB(null); resetLOB(); }} />}
                  </div>
                </form>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">LOBs List</h3>
              <DataTable value={filteredLobs} loading={loading} emptyMessage="No LOBs found">
                <thead className="bg-gray-50"><tr><th className={thClass}>ID</th><th className={thClass}>Name</th><th className={thClass}>Description</th><th className={thClass}>Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLobs.map((lob, i) => (
                    <tr key={lob._id}>
                      <td className={tdClass}>{i + 1}</td>
                      <td className={tdClass}>{lob.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{lob.description || "-"}</td>
                      <td className={tdClass}>
                        <div className="flex gap-2">
                          <Btn icon={Edit2} className="text-blue-600 hover:text-blue-800" onClick={() => handleEditLOB(lob)} />
                          <Btn icon={Trash2} className="text-red-600 hover:text-red-800" onClick={() => handleDeleteLOB(lob._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </TabPanel>

        {/* ── Hiring Managers Tab ───────────────────────────────────────────── */}
        <TabPanel header="Hiring Managers">
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editingHiringManager ? "Edit Hiring Manager" : bulkModeHM ? "Bulk Create Hiring Managers" : "Create Hiring Manager"}</h3>
                {!editingHiringManager && (
                  <Btn label={bulkModeHM ? "Single Mode" : "Bulk Mode"} icon={bulkModeHM ? Users : Plus}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => { setBulkModeHM(!bulkModeHM); if (!bulkModeHM) setBulkEntriesHM([{ name: "", email: "" }]); }}
                  />
                )}
              </div>

              {bulkModeHM ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr><th className={thClass}>Name *</th><th className={thClass}>Email *</th><th className={thClass}>Actions</th></tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulkEntriesHM.map((entry, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4"><InputText value={entry.name} onChange={(e) => updateBulkEntry("hm", i, "name", e.target.value)} placeholder="Hiring Manager Name" /></td>
                            <td className="px-6 py-4"><InputText value={entry.email} onChange={(e) => updateBulkEntry("hm", i, "email", e.target.value)} type="email" placeholder="Email" /></td>
                            <td className="px-6 py-4"><Btn icon={Trash2} className="text-red-600 hover:text-red-800" onClick={() => removeBulkRow("hm", i)} disabled={bulkEntriesHM.length === 1} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2">
                    <Btn label="Add Row" icon={Plus} className="border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => addBulkRow("hm")} />
                    <Btn label="Create All" icon={Check} className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={async () => {
                        const valid = bulkEntriesHM.filter(e => e.name && e.email);
                        if (!valid.length) { showMessage("error", "Please add at least one Hiring Manager with name and email"); return; }
                        if (valid.some(e => !emailRegex.test(e.email))) { showMessage("error", "Please ensure all emails are valid"); return; }
                        try {
                          await companyService.bulkCreateHiringManagers({ items: valid });
                          showMessage("success", ENTERPRISE_MESSAGES.HIRING_MANAGER.BULK_CREATE_SUCCESS);
                          setBulkEntriesHM([{ name: "", email: "" }]); setBulkModeHM(false); fetchHiringManagers();
                        } catch { showMessage("error", "Failed to create Hiring Managers"); }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitHM(onSubmitHiringManager)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <InputText {...registerHM("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })} placeholder="Hiring Manager Name" />
                    {errorsHM.name && <p className="text-red-500 text-xs mt-1">{errorsHM.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <InputText {...registerHM("email", { required: "Email is required", pattern: { value: emailRegex, message: "Valid email is required" } })} type="email" placeholder="Email" />
                    {errorsHM.email && <p className="text-red-500 text-xs mt-1">{errorsHM.email.message}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Btn type="submit" label={editingHiringManager ? "Update" : "Create"} icon={editingHiringManager ? Check : Plus} className="bg-blue-600 text-white hover:bg-blue-700" />
                    {editingHiringManager && <Btn type="button" label="Cancel" icon={X} className="border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => { setEditingHiringManager(null); resetHM(); }} />}
                  </div>
                </form>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Hiring Managers List</h3>
              <DataTable value={filteredHMs} loading={loading} emptyMessage="No Hiring Managers found">
                <thead className="bg-gray-50"><tr><th className={thClass}>ID</th><th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHMs.map((hm, i) => (
                    <tr key={hm._id}>
                      <td className={tdClass}>{i + 1}</td>
                      <td className={tdClass}>{hm.name}</td>
                      <td className={tdClass}>{hm.email}</td>
                      <td className={tdClass}>
                        <div className="flex gap-2">
                          <Btn icon={Edit2} className="text-blue-600 hover:text-blue-800" onClick={() => handleEditHiringManager(hm)} />
                          <Btn icon={Trash2} className="text-red-600 hover:text-red-800" onClick={() => handleDeleteHiringManager(hm._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </TabPanel>

        {/* ── Backup Hiring Managers Tab ────────────────────────────────────── */}
        <TabPanel header="Backup HMs">
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">{editingBackupHiringManager ? "Edit Backup Hiring Manager" : "Create Backup Hiring Manager"}</h3>
              <form onSubmit={handleSubmitBHM(onSubmitBackupHiringManager)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <InputText {...registerBHM("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })} placeholder="Backup Hiring Manager Name" />
                  {errorsBHM.name && <p className="text-red-500 text-xs mt-1">{errorsBHM.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <InputText {...registerBHM("email", { required: "Email is required", pattern: { value: emailRegex, message: "Valid email is required" } })} type="email" placeholder="Email" />
                  {errorsBHM.email && <p className="text-red-500 text-xs mt-1">{errorsBHM.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Hiring Manager (Optional)</label>
                  <Dropdown
                    {...registerBHM("hiringManagerId")}
                    options={[{ label: "Select Hiring Manager", value: "" }, ...hiringManagers.map(hm => ({ label: `${hm.name} (${hm.email})`, value: hm._id }))]}
                  />
                </div>
                <div className="flex gap-2">
                  <Btn type="submit" label={editingBackupHiringManager ? "Update" : "Create"} icon={editingBackupHiringManager ? Check : Plus} className="bg-blue-600 text-white hover:bg-blue-700" />
                  {editingBackupHiringManager && <Btn type="button" label="Cancel" icon={X} className="border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => { setEditingBackupHiringManager(null); resetBHM(); }} />}
                </div>
              </form>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Backup Hiring Managers List</h3>
              <DataTable value={filteredBHMs} loading={loading} emptyMessage="No Backup Hiring Managers found">
                <thead className="bg-gray-50"><tr><th className={thClass}>ID</th><th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Primary HM</th><th className={thClass}>Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBHMs.map((bhm, i) => (
                    <tr key={bhm._id}>
                      <td className={tdClass}>{i + 1}</td>
                      <td className={tdClass}>{bhm.name}</td>
                      <td className={tdClass}>{bhm.email}</td>
                      <td className={tdClass}>{bhm.hiringManagerId?.name || "-"}</td>
                      <td className={tdClass}>
                        <div className="flex gap-2">
                          <Btn icon={Edit2} className="text-blue-600 hover:text-blue-800" onClick={() => handleEditBackupHiringManager(bhm)} />
                          <Btn icon={Trash2} className="text-red-600 hover:text-red-800" onClick={() => handleDeleteBackupHiringManager(bhm._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </TabPanel>

        {/* ── Recruiters Tab ────────────────────────────────────────────────── */}
        <TabPanel header="Recruiters">
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{editingRecruiter ? "Edit Recruiter" : bulkModeRecruiter ? "Bulk Create Recruiters" : "Create Recruiter"}</h3>
                {!editingRecruiter && (
                  <Btn label={bulkModeRecruiter ? "Single Mode" : "Bulk Mode"} icon={bulkModeRecruiter ? Users : Plus}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => { setBulkModeRecruiter(!bulkModeRecruiter); if (!bulkModeRecruiter) setBulkEntriesRecruiter([{ name: "", email: "", keySkills: "" }]); }}
                  />
                )}
              </div>

              {bulkModeRecruiter ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr><th className={thClass}>Name *</th><th className={thClass}>Email *</th><th className={thClass}>Key Skills</th><th className={thClass}>Actions</th></tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulkEntriesRecruiter.map((entry, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4"><InputText value={entry.name} onChange={(e) => updateBulkEntry("recruiter", i, "name", e.target.value)} placeholder="Recruiter Name" /></td>
                            <td className="px-6 py-4"><InputText value={entry.email} onChange={(e) => updateBulkEntry("recruiter", i, "email", e.target.value)} type="email" placeholder="Email" /></td>
                            <td className="px-6 py-4"><InputText value={entry.keySkills || ""} onChange={(e) => updateBulkEntry("recruiter", i, "keySkills", e.target.value)} placeholder="e.g., Java, React" /></td>
                            <td className="px-6 py-4"><Btn icon={Trash2} className="text-red-600 hover:text-red-800" onClick={() => removeBulkRow("recruiter", i)} disabled={bulkEntriesRecruiter.length === 1} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2">
                    <Btn label="Add Row" icon={Plus} className="border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => addBulkRow("recruiter")} />
                    <Btn label="Create All" icon={Check} className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={async () => {
                        const valid = bulkEntriesRecruiter.filter(e => e.name && e.email);
                        if (!valid.length) { showMessage("error", "Please add at least one Recruiter with name and email"); return; }
                        if (valid.some(e => !emailRegex.test(e.email))) { showMessage("error", "Please ensure all emails are valid"); return; }
                        try {
                          await companyService.bulkCreateRecruiters({ items: valid });
                          showMessage("success", ENTERPRISE_MESSAGES.RECRUITER.BULK_CREATE_SUCCESS);
                          setBulkEntriesRecruiter([{ name: "", email: "", keySkills: "" }]); setBulkModeRecruiter(false); fetchRecruiters();
                        } catch { showMessage("error", "Failed to create Recruiters"); }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRecruiter(onSubmitRecruiter)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <InputText {...registerRecruiter("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })} placeholder="Recruiter Name" />
                    {errorsRecruiter.name && <p className="text-red-500 text-xs mt-1">{errorsRecruiter.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <InputText {...registerRecruiter("email", { required: "Email is required", pattern: { value: emailRegex, message: "Valid email is required" } })} type="email" placeholder="Email" />
                    {errorsRecruiter.email && <p className="text-red-500 text-xs mt-1">{errorsRecruiter.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (Comma-separated)</label>
                    <InputText value={keySkills} onChange={(e) => setKeySkills(e.target.value)} placeholder="e.g., Java, React, Node.js" />
                  </div>
                  <div className="flex gap-2">
                    <Btn type="submit" label={editingRecruiter ? "Update" : "Create"} icon={editingRecruiter ? Check : Plus} className="bg-blue-600 text-white hover:bg-blue-700" />
                    {editingRecruiter && <Btn type="button" label="Cancel" icon={X} className="border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => { setEditingRecruiter(null); resetRecruiter(); setKeySkills(""); }} />}
                  </div>
                </form>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Recruiters List</h3>
              <DataTable value={filteredRecruiters} loading={loading} emptyMessage="No Recruiters found">
                <thead className="bg-gray-50"><tr><th className={thClass}>ID</th><th className={thClass}>Name</th><th className={thClass}>Email</th><th className={thClass}>Key Skills</th><th className={thClass}>Actions</th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecruiters.map((recruiter, i) => (
                    <tr key={recruiter._id}>
                      <td className={tdClass}>{i + 1}</td>
                      <td className={tdClass}>{recruiter.name}</td>
                      <td className={tdClass}>{recruiter.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{recruiter.keySkills?.join(", ") || "-"}</td>
                      <td className={tdClass}>
                        <div className="flex gap-2">
                          <Btn icon={Edit2} className="text-blue-600 hover:text-blue-800" onClick={() => handleEditRecruiter(recruiter)} />
                          <Btn icon={Trash2} className="text-red-600 hover:text-red-800" onClick={() => handleDeleteRecruiter(recruiter._id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </TabPanel>
      </TabView>

      {/* ── Confirm Dialog (shared across all delete actions) ──────────────── */}
      <ConfirmDialog
        open={confirmDialog.open}
        message={confirmDialog.message}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
    </div>
  );
}