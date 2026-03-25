import React, { useState, useEffect, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { companyService } from "../../../services/companyService";
import { getCompanyId } from "../../../utils/auth";
import { ENTERPRISE_MESSAGES } from "../constants/enterprise";
import { Building2, Users, UserPlus, Mail, Phone, Edit2, Trash2, Plus, X, Check, AlertCircle, Loader2, Briefcase } from "lucide-react";
import { CreateJobForm } from "./CreateJobForm";

// Simple Tab Component
const TabView = ({ activeIndex, onTabChange, children }) => {
  return (
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
      <div className="mt-4">
        {children[activeIndex]}
      </div>
    </div>
  );
};

const TabPanel = ({ children }) => children;

// Simple Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    <div className="p-6">{children}</div>
  </div>
);

// Simple Input Components
const InputText = forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
));
InputText.displayName = 'InputText';

const InputTextarea = forwardRef(({ className = "", rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
    {...props}
  />
));
InputTextarea.displayName = 'InputTextarea';

const Button = ({ label, icon: Icon, className = "", children, ...props }) => (
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
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
));
Dropdown.displayName = 'Dropdown';

// Simple DataTable Component
const DataTable = ({ value, children, emptyMessage = "No data found", loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!value || value.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
};

// ─── Confirm Dialog Component ─────────────────────────────────────────────────
const ConfirmDialog = ({ open, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{
        background: "rgba(15,15,20,0.6)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        style={{ animation: "slideUp 0.2s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {/* Header */}
        <div
          className="p-6"
          style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <Trash2 className="w-6 h-6 text-white" />
          </div>
          <h3
            className="text-white font-bold text-lg"
            style={{ fontFamily: "Georgia, serif" }}
          >
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

export default function EnterpriseManagement() {
  const [activeTab, setActiveTab] = useState("lob");
  const [loading, setLoading] = useState(false);
  const companyId = getCompanyId();

  // ── Confirm Dialog State ───────────────────────────────────────────────────
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


  // Message State
  const [message, setMessage] = useState({ type: "", text: "" });

  // Search State
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (companyId) {
      fetchAllData();
    }
  }, [companyId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchLOBs(),
        fetchHiringManagers(),
        fetchBackupHiringManagers(),
        fetchRecruiters(),
      ]);
    } catch (error) {
      showMessage("error", "Failed to load enterprise data");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ── Confirm Dialog Helpers ─────────────────────────────────────────────────
  /** Returns a Promise that resolves true (confirm) or false (cancel) */
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

  // API Functions
  const fetchLOBs = async () => {
    try {
      const response = await companyService.getLOBs();
      setLobs(response.lobs || []);
    } catch (error) {
      console.error("Failed to fetch LOBs:", error);
    }
  };

  const fetchHiringManagers = async () => {
    try {
      const response = await companyService.getHiringManagers();
      setHiringManagers(response.hiringManagers || []);
    } catch (error) {
      console.error("Failed to fetch hiring managers:", error);
    }
  };

  const fetchBackupHiringManagers = async () => {
    try {
      const response = await companyService.getBackupHiringManagers();
      setBackupHiringManagers(response.backupHiringManagers || []);
    } catch (error) {
      console.error("Failed to fetch backup hiring managers:", error);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await companyService.getRecruiters();
      setRecruiters(response.recruiters || []);
    } catch (error) {
      console.error("Failed to fetch recruiters:", error);
    }
  };


  // LOB Functions
  const {
    register: registerLOB,
    handleSubmit: handleSubmitLOB,
    reset: resetLOB,
    control: controlLOB,
    formState: { errors: errorsLOB },
  } = useForm();

  const onSubmitLOB = async (data) => {
    try {
      if (editingLOB) {
        await companyService.updateLOB(editingLOB._id, data);
        showMessage("success", ENTERPRISE_MESSAGES.LOB.UPDATE_SUCCESS);
      } else {
        await companyService.createLOB(data);
        showMessage("success", ENTERPRISE_MESSAGES.LOB.CREATE_SUCCESS);
      }
      resetLOB();
      setEditingLOB(null);
      fetchLOBs();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to save LOB";
      showMessage("error", errorMessage);
      console.error("LOB creation error:", error);
    }
  };

  const handleEditLOB = (lob) => {
    setEditingLOB(lob);
    resetLOB({
      name: lob.name,
      description: lob.description || "",
    });
  };

  const handleDeleteLOB = async (lobId) => {
    const isConfirmed = await showConfirmationDialog("Are you sure you want to delete this LOB?");

    if (isConfirmed) {
      try {
        await companyService.deleteLOB(lobId);
        showMessage("success", ENTERPRISE_MESSAGES.LOB.DELETE_SUCCESS);
        fetchLOBs();
      } catch (error) {
        if (error.response?.status === 404) {
          showMessage("error", "LOB not found");
        } else if (error.response?.status === 403) {
          showMessage("error", "Insufficient permissions to delete LOB");
        } else {
          const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to delete LOB";
          showMessage("error", errorMessage);
          console.error("LOB deletion error:", error);
        }
      }
    }
  };

  // Hiring Manager Functions
  const {
    register: registerHM,
    handleSubmit: handleSubmitHM,
    reset: resetHM,
    control: controlHM,
    formState: { errors: errorsHM },
  } = useForm();

  const onSubmitHiringManager = async (data) => {
    try {
      if (editingHiringManager) {
        await companyService.updateHiringManager(editingHiringManager._id, data);
        showMessage("success", ENTERPRISE_MESSAGES.HIRING_MANAGER.UPDATE_SUCCESS);
      } else {
        await companyService.createHiringManager(data);
        showMessage("success", ENTERPRISE_MESSAGES.HIRING_MANAGER.CREATE_SUCCESS);
      }
      resetHM();
      setEditingHiringManager(null);
      fetchHiringManagers();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to save Hiring Manager";
      showMessage("error", errorMessage);
      console.error("Hiring manager creation error:", error);
    }
  };

  const handleEditHiringManager = (hm) => {
    setEditingHiringManager(hm);
    resetHM({
      name: hm.name,
      email: hm.email,
    });
  };

  const handleDeleteHiringManager = async (hmId) => {
    const isConfirmed = await showConfirmationDialog("Are you sure you want to delete this Hiring Manager?");

    if (isConfirmed) {
      try {
        await companyService.deleteHiringManager(hmId);
        showMessage("success", ENTERPRISE_MESSAGES.HIRING_MANAGER.DELETE_SUCCESS);
        fetchHiringManagers();
      } catch (error) {
        if (error.response?.status === 404) {
          showMessage("error", "Hiring Manager not found");
        } else if (error.response?.status === 403) {
          showMessage("error", "Insufficient permissions to delete Hiring Manager");
        } else {
          const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to delete Hiring Manager";
          showMessage("error", errorMessage);
          console.error("Hiring manager deletion error:", error);
        }
      }
    }
  };

  // Backup Hiring Manager Functions
  const {
    register: registerBHM,
    handleSubmit: handleSubmitBHM,
    reset: resetBHM,
    control: controlBHM,
    formState: { errors: errorsBHM },
  } = useForm();

  const onSubmitBackupHiringManager = async (data) => {
    try {
      if (editingBackupHiringManager) {
        await companyService.updateBackupHiringManager(editingBackupHiringManager._id, data);
        showMessage("success", ENTERPRISE_MESSAGES.BACKUP_HIRING_MANAGER.UPDATE_SUCCESS);
      } else {
        await companyService.createBackupHiringManager(data);
        showMessage("success", ENTERPRISE_MESSAGES.BACKUP_HIRING_MANAGER.CREATE_SUCCESS);
      }
      resetBHM();
      setEditingBackupHiringManager(null);
      fetchBackupHiringManagers();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to save Backup Hiring Manager";
      showMessage("error", errorMessage);
      console.error("Backup hiring manager creation error:", error);
    }
  };

  const handleEditBackupHiringManager = (bhm) => {
    setEditingBackupHiringManager(bhm);
    resetBHM({
      name: bhm.name,
      email: bhm.email,
      hiringManagerId: bhm.hiringManagerId?._id || bhm.hiringManagerId || "",
    });
  };

  const handleDeleteBackupHiringManager = async (bhmId) => {
    const isConfirmed = await showConfirmationDialog("Are you sure you want to delete this Backup Hiring Manager?");

    if (isConfirmed) {
      try {
        await companyService.deleteBackupHiringManager(bhmId);
        showMessage("success", ENTERPRISE_MESSAGES.BACKUP_HIRING_MANAGER.DELETE_SUCCESS);
        fetchBackupHiringManagers();
      } catch (error) {
        if (error.response?.status === 404) {
          showMessage("error", "Backup Hiring Manager not found");
        } else if (error.response?.status === 403) {
          showMessage("error", "Insufficient permissions to delete Backup Hiring Manager");
        } else {
          const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to delete Backup Hiring Manager";
          showMessage("error", errorMessage);
        }
        console.error("Backup hiring manager deletion error:", error);
      }
    }
  };

  // Recruiter Functions
  const {
    register: registerRecruiter,
    handleSubmit: handleSubmitRecruiter,
    reset: resetRecruiter,
    control: controlRecruiter,
    formState: { errors: errorsRecruiter },
  } = useForm();

  const [keySkills, setKeySkills] = useState("");

  const onSubmitRecruiter = async (data) => {
    const keySkillsArray = keySkills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    try {
      if (editingRecruiter) {
        await companyService.updateRecruiter(editingRecruiter._id, {
          ...data,
          keySkills: keySkillsArray,
        });
        showMessage("success", ENTERPRISE_MESSAGES.RECRUITER.UPDATE_SUCCESS);
      } else {
        await companyService.createRecruiter({
          ...data,
          keySkills: keySkillsArray,
        });
        showMessage("success", ENTERPRISE_MESSAGES.RECRUITER.CREATE_SUCCESS);
      }
      resetRecruiter();
      setKeySkills("");
      setEditingRecruiter(null);
      fetchRecruiters();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to save Recruiter";
      showMessage("error", errorMessage);
      console.error("Recruiter creation error:", error);
    }
  };

  const handleEditRecruiter = (recruiter) => {
    setEditingRecruiter(recruiter);
    resetRecruiter({
      name: recruiter.name,
      email: recruiter.email,
    });
    setKeySkills(recruiter.keySkills ? recruiter.keySkills.join(", ") : "");
  };

  const handleDeleteRecruiter = async (recruiterId) => {
    const isConfirmed = await showConfirmationDialog("Are you sure you want to delete this Recruiter?");

    if (isConfirmed) {
      try {
        await companyService.deleteRecruiter(recruiterId);
        showMessage("success", ENTERPRISE_MESSAGES.RECRUITER.DELETE_SUCCESS);
        fetchRecruiters();
      } catch (error) {
        if (error.response?.status === 404) {
          showMessage("error", "Recruiter not found");
        } else if (error.response?.status === 403) {
          showMessage("error", "Insufficient permissions to delete Recruiter");
        } else {
          const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to delete Recruiter";
          showMessage("error", errorMessage);
          console.error("Recruiter deletion error:", error);
        }
      }
    }
  };


  // Helper functions for bulk entry management
  const addBulkRow = (type) => {
    if (type === "lob") {
      setBulkEntriesLOB([...bulkEntriesLOB, { name: "", description: "" }]);
    } else if (type === "hm") {
      setBulkEntriesHM([...bulkEntriesHM, { name: "", email: "" }]);
    } else if (type === "recruiter") {
      setBulkEntriesRecruiter([...bulkEntriesRecruiter, { name: "", email: "", keySkills: "" }]);
    }
  };

  const removeBulkRow = (type, index) => {
    if (type === "lob") {
      const newEntries = bulkEntriesLOB.filter((_, i) => i !== index);
      setBulkEntriesLOB(newEntries.length > 0 ? newEntries : [{ name: "", description: "" }]);
    } else if (type === "hm") {
      const newEntries = bulkEntriesHM.filter((_, i) => i !== index);
      setBulkEntriesHM(newEntries.length > 0 ? newEntries : [{ name: "", email: "" }]);
    } else if (type === "recruiter") {
      const newEntries = bulkEntriesRecruiter.filter((_, i) => i !== index);
      setBulkEntriesRecruiter(newEntries.length > 0 ? newEntries : [{ name: "", email: "", keySkills: "" }]);
    }
  };

  const updateBulkEntry = (type, index, field, value) => {
    if (type === "lob") {
      const newEntries = [...bulkEntriesLOB];
      newEntries[index][field] = value;
      setBulkEntriesLOB(newEntries);
    } else if (type === "hm") {
      const newEntries = [...bulkEntriesHM];
      newEntries[index][field] = value;
      setBulkEntriesHM(newEntries);
    } else if (type === "recruiter") {
      const newEntries = [...bulkEntriesRecruiter];
      newEntries[index][field] = value;
      setBulkEntriesRecruiter(newEntries);
    }
  };

  // Filtered Data
  const filteredLobs = lobs.filter(lob =>
    lob.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lob.description && lob.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredHMs = hiringManagers.filter(hm =>
    hm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hm.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBHMs = backupHiringManagers.filter(bhm =>
    bhm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bhm.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bhm.hiringManagerId?.name && bhm.hiringManagerId.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRecruiters = recruiters.filter(recruiter =>
    recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recruiter.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recruiter.keySkills && recruiter.keySkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
  );


  const tabHeaders = ["LOBs", "Hiring Managers", "Backup HMs", "Recruiters", "Job Posting"];
  const tabKeys = ["lob", "hiringManager", "backupHiringManager", "recruiter", "jobPosting"];

  return (
    <div className="space-y-6">
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

      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
        </div>
      )}

      <TabView
        activeIndex={tabKeys.indexOf(activeTab)}
        onTabChange={(index) => {
          setActiveTab(tabKeys[index]);
          // Reset editing states when switching tabs
          setEditingLOB(null);
          setEditingHiringManager(null);
          setEditingBackupHiringManager(null);
          setEditingRecruiter(null);
          resetLOB();
          resetHM();
          resetBHM();
          resetRecruiter();
          setKeySkills("");
        }}
      >
        {/* LOB Tab */}
        <TabPanel header="LOBs">
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingLOB ? "Edit LOB" : bulkModeLOB ? "Bulk Add LOBs" : "Add LOB"}
                </h3>
                {!editingLOB && (
                  <Button
                    label={bulkModeLOB ? "Single Mode" : "Bulk Mode"}
                    icon={bulkModeLOB ? Users : Plus}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setBulkModeLOB(!bulkModeLOB);
                      if (!bulkModeLOB) {
                        setBulkEntriesLOB([{ name: "", description: "" }]);
                      }
                    }}
                  />
                )}
              </div>

              {bulkModeLOB ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            LOB Name *
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulkEntriesLOB.map((entry, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4">
                              <InputText
                                value={entry.name}
                                onChange={(e) => updateBulkEntry("lob", index, "name", e.target.value)}
                                placeholder="LOB Name"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <InputText
                                value={entry.description || ""}
                                onChange={(e) => updateBulkEntry("lob", index, "description", e.target.value)}
                                placeholder="Description (Optional)"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                icon={Trash2}
                                className="text-red-600 hover:text-red-800"
                                onClick={() => removeBulkRow("lob", index)}
                                disabled={bulkEntriesLOB.length === 1}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      label="Add Row"
                      icon={Plus}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => addBulkRow("lob")}
                    />
                    <Button
                      label="Create All"
                      icon={Check}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={async () => {
                        const validEntries = bulkEntriesLOB.filter(entry => entry.name && entry.name.trim());
                        if (validEntries.length === 0) {
                          showMessage("error", "Please add at least one LOB with a name");
                          return;
                        }
                        try {
                          await companyService.bulkCreateLOBs({ items: validEntries });
                          showMessage("success", ENTERPRISE_MESSAGES.LOB.BULK_CREATE_SUCCESS);
                          setBulkEntriesLOB([{ name: "", description: "" }]);
                          setBulkModeLOB(false);
                          fetchLOBs();
                        } catch (error) {
                          showMessage("error", "Failed to create LOBs");
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitLOB(onSubmitLOB)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LOB Name</label>
                    <InputText
                      {...registerLOB("name", { required: "LOB Name is required" })}
                      placeholder="LOB Name"
                    />
                    {errorsLOB.name && (
                      <p className="text-red-500 text-xs mt-1">{errorsLOB.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <InputTextarea
                      {...registerLOB("description")}
                      placeholder="Description"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      label={editingLOB ? "Update" : "Create"}
                      icon={editingLOB ? Check : Plus}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    />
                    {editingLOB && (
                      <Button
                        type="button"
                        label="Cancel"
                        icon={X}
                        className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setEditingLOB(null);
                          resetLOB();
                        }}
                      />
                    )}
                  </div>
                </form>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">LOBs List</h3>
              <DataTable value={filteredLobs} loading={loading}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLobs.map((lob, index) => (
                    <tr key={lob._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lob.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {lob.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            icon={Edit2}
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditLOB(lob)}
                          />
                          <Button
                            icon={Trash2}
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteLOB(lob._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </TabPanel>

        {/* Hiring Managers Tab */}
        <TabPanel header="Hiring Managers">
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingHiringManager ? "Edit Hiring Manager" : bulkModeHM ? "Bulk Create Hiring Managers" : "Create Hiring Manager"}
                </h3>
                {!editingHiringManager && (
                  <Button
                    label={bulkModeHM ? "Single Mode" : "Bulk Mode"}
                    icon={bulkModeHM ? Users : Plus}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setBulkModeHM(!bulkModeHM);
                      if (!bulkModeHM) {
                        setBulkEntriesHM([{ name: "", email: "" }]);
                      }
                    }}
                  />
                )}
              </div>

              {bulkModeHM ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name *
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email *
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulkEntriesHM.map((entry, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4">
                              <InputText
                                value={entry.name}
                                onChange={(e) => updateBulkEntry("hm", index, "name", e.target.value)}
                                placeholder="Hiring Manager Name"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <InputText
                                value={entry.email}
                                onChange={(e) => updateBulkEntry("hm", index, "email", e.target.value)}
                                type="email"
                                placeholder="Email"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                icon={Trash2}
                                className="text-red-600 hover:text-red-800"
                                onClick={() => removeBulkRow("hm", index)}
                                disabled={bulkEntriesHM.length === 1}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      label="Add Row"
                      icon={Plus}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => addBulkRow("hm")}
                    />
                    <Button
                      label="Create All"
                      icon={Check}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={async () => {
                        const validEntries = bulkEntriesHM.filter(entry => entry.name && entry.email);
                        if (validEntries.length === 0) {
                          showMessage("error", "Please add at least one Hiring Manager with name and email");
                          return;
                        }
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        const invalidEmails = validEntries.filter(entry => !emailRegex.test(entry.email));
                        if (invalidEmails.length > 0) {
                          showMessage("error", "Please ensure all emails are valid");
                          return;
                        }
                        try {
                          await companyService.bulkCreateHiringManagers({ items: validEntries });
                          showMessage("success", ENTERPRISE_MESSAGES.HIRING_MANAGER.BULK_CREATE_SUCCESS);
                          setBulkEntriesHM([{ name: "", email: "" }]);
                          setBulkModeHM(false);
                          fetchHiringManagers();
                        } catch (error) {
                          showMessage("error", "Failed to create Hiring Managers");
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitHM(onSubmitHiringManager)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <InputText
                      {...registerHM("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
                      placeholder="Hiring Manager Name"
                    />
                    {errorsHM.name && (
                      <p className="text-red-500 text-xs mt-1">{errorsHM.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <InputText
                      {...registerHM("email", {
                        required: "Email is required",
                        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Valid email is required" }
                      })}
                      type="email"
                      placeholder="Email"
                    />
                    {errorsHM.email && (
                      <p className="text-red-500 text-xs mt-1">{errorsHM.email.message}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      label={editingHiringManager ? "Update" : "Create"}
                      icon={editingHiringManager ? Check : Plus}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    />
                    {editingHiringManager && (
                      <Button
                        type="button"
                        label="Cancel"
                        icon={X}
                        className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setEditingHiringManager(null);
                          resetHM();
                        }}
                      />
                    )}
                  </div>
                </form>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Hiring Managers List</h3>
              <DataTable value={filteredHMs} loading={loading}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHMs.map((hm, index) => (
                    <tr key={hm._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hm.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {hm.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            icon={Edit2}
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditHiringManager(hm)}
                          />
                          <Button
                            icon={Trash2}
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteHiringManager(hm._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </TabPanel>

        {/* Backup Hiring Managers Tab */}
        <TabPanel header="Backup HMs">
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                {editingBackupHiringManager ? "Edit Backup Hiring Manager" : "Create Backup Hiring Manager"}
              </h3>
              <form onSubmit={handleSubmitBHM(onSubmitBackupHiringManager)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <InputText
                    {...registerBHM("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
                    placeholder="Backup Hiring Manager Name"
                  />
                  {errorsBHM.name && (
                    <p className="text-red-500 text-xs mt-1">{errorsBHM.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <InputText
                    {...registerBHM("email", {
                      required: "Email is required",
                      pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Valid email is required" }
                    })}
                    type="email"
                    placeholder="Email"
                  />
                  {errorsBHM.email && (
                    <p className="text-red-500 text-xs mt-1">{errorsBHM.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Hiring Manager (Optional)</label>
                  <Dropdown
                    {...registerBHM("hiringManagerId")}
                    options={[
                      { label: "Select Hiring Manager", value: "" },
                      ...hiringManagers.map((hm) => ({
                        label: `${hm.name} (${hm.email})`,
                        value: hm._id,
                      })),
                    ]}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    label={editingBackupHiringManager ? "Update" : "Create"}
                    icon={editingBackupHiringManager ? Check : Plus}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  />
                  {editingBackupHiringManager && (
                    <Button
                      type="button"
                      label="Cancel"
                      icon={X}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setEditingBackupHiringManager(null);
                        resetBHM();
                      }}
                    />
                  )}
                </div>
              </form>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Backup Hiring Managers List</h3>
              <DataTable value={filteredBHMs} loading={loading}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Primary HM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBHMs.map((bhm, index) => (
                    <tr key={bhm._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bhm.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bhm.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bhm.hiringManagerId?.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            icon={Edit2}
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditBackupHiringManager(bhm)}
                          />
                          <Button
                            icon={Trash2}
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteBackupHiringManager(bhm._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </TabPanel>

        {/* Recruiters Tab */}
        <TabPanel header="Recruiters">
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingRecruiter ? "Edit Recruiter" : bulkModeRecruiter ? "Bulk Create Recruiters" : "Create Recruiter"}
                </h3>
                {!editingRecruiter && (
                  <Button
                    label={bulkModeRecruiter ? "Single Mode" : "Bulk Mode"}
                    icon={bulkModeRecruiter ? Users : Plus}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setBulkModeRecruiter(!bulkModeRecruiter);
                      if (!bulkModeRecruiter) {
                        setBulkEntriesRecruiter([{ name: "", email: "", keySkills: "" }]);
                      }
                    }}
                  />
                )}
              </div>

              {bulkModeRecruiter ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name *
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email *
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key Skills
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bulkEntriesRecruiter.map((entry, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4">
                              <InputText
                                value={entry.name}
                                onChange={(e) => updateBulkEntry("recruiter", index, "name", e.target.value)}
                                placeholder="Recruiter Name"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <InputText
                                value={entry.email}
                                onChange={(e) => updateBulkEntry("recruiter", index, "email", e.target.value)}
                                type="email"
                                placeholder="Email"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <InputText
                                value={entry.keySkills || ""}
                                onChange={(e) => updateBulkEntry("recruiter", index, "keySkills", e.target.value)}
                                placeholder="e.g., Java, React"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                icon={Trash2}
                                className="text-red-600 hover:text-red-800"
                                onClick={() => removeBulkRow("recruiter", index)}
                                disabled={bulkEntriesRecruiter.length === 1}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      label="Add Row"
                      icon={Plus}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => addBulkRow("recruiter")}
                    />
                    <Button
                      label="Create All"
                      icon={Check}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={async () => {
                        const validEntries = bulkEntriesRecruiter.filter(entry => entry.name && entry.email);
                        if (validEntries.length === 0) {
                          showMessage("error", "Please add at least one Recruiter with name and email");
                          return;
                        }
                        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                        const invalidEmails = validEntries.filter(entry => !emailRegex.test(entry.email));
                        if (invalidEmails.length > 0) {
                          showMessage("error", "Please ensure all emails are valid");
                          return;
                        }
                        try {
                          await companyService.bulkCreateRecruiters({ items: validEntries });
                          showMessage("success", ENTERPRISE_MESSAGES.RECRUITER.BULK_CREATE_SUCCESS);
                          setBulkEntriesRecruiter([{ name: "", email: "", keySkills: "" }]);
                          setBulkModeRecruiter(false);
                          fetchRecruiters();
                        } catch (error) {
                          showMessage("error", "Failed to create Recruiters");
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRecruiter(onSubmitRecruiter)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <InputText
                      {...registerRecruiter("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
                      placeholder="Recruiter Name"
                    />
                    {errorsRecruiter.name && (
                      <p className="text-red-500 text-xs mt-1">{errorsRecruiter.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <InputText
                      {...registerRecruiter("email", {
                        required: "Email is required",
                        pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Valid email is required" }
                      })}
                      type="email"
                      placeholder="Email"
                    />
                    {errorsRecruiter.email && (
                      <p className="text-red-500 text-xs mt-1">{errorsRecruiter.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills (Comma-separated)</label>
                    <InputText
                      value={keySkills}
                      onChange={(e) => setKeySkills(e.target.value)}
                      placeholder="e.g., Java, React, Node.js"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      label={editingRecruiter ? "Update" : "Create"}
                      icon={editingRecruiter ? Check : Plus}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    />
                    {editingRecruiter && (
                      <Button
                        type="button"
                        label="Cancel"
                        icon={X}
                        className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          setEditingRecruiter(null);
                          resetRecruiter();
                          setKeySkills("");
                        }}
                      />
                    )}
                  </div>
                </form>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Recruiters List</h3>
              <DataTable value={filteredRecruiters} loading={loading}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecruiters.map((recruiter, index) => (
                    <tr key={recruiter._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {recruiter.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {recruiter.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {recruiter.keySkills?.join(", ") || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            icon={Edit2}
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditRecruiter(recruiter)}
                          />
                          <Button
                            icon={Trash2}
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteRecruiter(recruiter._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </Card>
          </div>
        </TabPanel>


        {/* Job Posting Tab */}
        <TabPanel header="Job Posting">
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Create New Job Posting
                </h3>
              </div>
              <CreateJobForm 
                companyId={getCompanyId()}
                onSuccess={() => showMessage("success", "Job created successfully!")}
                onCancel={() => showMessage("info", "Job creation cancelled")}
              />
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