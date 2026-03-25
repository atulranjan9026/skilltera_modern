import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { companyService } from "../../../services/companyService";
import { getCompanyId } from "../../../utils/auth";
import { UserPlus, X, Check, Loader2 } from "lucide-react";

// Simple Modal Component
const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{
        background: "rgba(15,15,20,0.6)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        style={{ animation: "slideUp 0.2s cubic-bezier(.34,1.56,.64,1)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.97) } to { opacity:1; transform:none } }
      `}</style>
    </div>
  );
};

// Simple Input Component
const InputText = React.forwardRef(({ className = "", error, ...props }, ref) => (
  <div>
    <input
      ref={ref}
      className={`w-full px-3 py-2 border ${error ? "border-red-300" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
    {error && (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    )}
  </div>
));
InputText.displayName = 'InputText';

// Simple Button Component
const Button = ({ label, icon: Icon, className = "", children, loading = false, ...props }) => (
  <button
    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${className}`}
    disabled={loading}
    {...props}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
    {label || children}
  </button>
);

export default function CreateInterviewerModal({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    mode: "onChange", // Validate on change
    reValidateMode: "onChange", // Re-validate on change
  });

  // Reset form when modal opens - v2
  useEffect(() => {
    if (open) {
      reset();
      setMessage({ type: "", text: "" });
    }
  }, [open, reset]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await companyService.createInterviewer({
        ...data,
        companyId: getCompanyId(),
      });
      
      showMessage("success", "Interviewer account created successfully!");
      reset();
      
      // Call success callback after a short delay to allow user to see the success message
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to create interviewer account";
      showMessage("error", errorMessage);
      console.error("Interviewer creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      setMessage({ type: "", text: "" });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Interviewer Account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <InputText
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Name must be at least 3 characters" },
              onChange: () => trigger("name"), // Trigger validation on change
            })}
            placeholder="Enter interviewer's full name"
            error={errors.name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <InputText
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Valid email is required",
              },
              onChange: () => trigger("email"), // Trigger validation on change
            })}
            type="email"
            placeholder="interviewer@company.com"
            error={errors.email?.message}
          />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> An account creation email will be sent to the interviewer with login instructions.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            label={loading ? "Creating..." : "Create Account"}
            icon={Check}
            loading={loading}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          />
          <Button
            type="button"
            label="Cancel"
            onClick={handleClose}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={loading}
          />
        </div>
      </form>
    </Modal>
  );
}
