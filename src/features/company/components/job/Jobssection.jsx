import { useState } from "react";
import { JobsTab } from "../JobsTab";
import { JobDetailPage } from "./Jobdetailpage";
import { JobEditPage } from "./Jobeditpage";
import { companyService } from "../../../../services/companyService";
import { getCompanyUser } from "../../../../utils/auth";
import { toast } from "../../../../utils/toast";

/**
 * Example parent that manages which "page" is shown.
 * Paste this logic into your existing dashboard/parent component.
 *
 * view:  "list"   → JobsTab
 *        "detail" → JobDetailPage
 *        "edit"   → JobEditPage
 */
export function JobsSection(props) {
    const [view, setView] = useState("list");          // "list" | "detail" | "edit"
    const [selectedJob, setSelectedJob] = useState(null);

    /* ── handlers ── */
    function handleViewJob(job) {
        setSelectedJob(job);
        setView("detail");
    }

    function handleEditJob(job) {
        setSelectedJob(job);
        setView("edit");
    }

    function handleBack() {
        setView("list");
        setSelectedJob(null);
    }

    async function handleSave(updatedJob) {
        try {
            // Use companyService to update the job with correct parameters
            const companyUser = getCompanyUser();
            const companyId = companyUser._id || companyUser.id;
            const jobId = updatedJob._id || updatedJob.jobId;
            
            if (!jobId) {
                throw new Error("Job ID is required for update");
            }
            
            if (!companyId) {
                throw new Error("Company ID is required for update");
            }
            
            // Clean the job object - remove conflicting ID fields
            const jobData = { ...updatedJob };
            delete jobData._id; // Remove _id from data being sent
            delete jobData.jobId; // Remove jobId from data being sent
            delete jobData.companyId; // Remove companyId from data being sent
            
            await companyService.updateJob(companyId, jobId, jobData);
            
            // ── Update local state immediately so Detail view reflects changes ──
            setSelectedJob(updatedJob);
            
            // Show success notification
            toast.success("Job updated successfully!");
            
            // Refresh the jobs list if the refresh function is provided
            if (props.onRetry) {
                props.onRetry();
            }
            
            // Go back to detail view after successful save
            setView("detail");
        } catch (error) {
            console.error("Failed to save job:", error);
            const errMsg = error.response?.data?.message || error.message || "Failed to update job.";
            toast.error(errMsg);
            throw error; // Let the JobEditPage handle its local error state too
        }
    }

    /* ── render ── */
    if (view === "detail") {
        return (
            <JobDetailPage
                job={selectedJob}
                onBack={handleBack}
                onEdit={handleEditJob}
            />
        );
    }

    if (view === "edit") {
        return (
            <JobEditPage
                job={selectedJob}
                onBack={() => {
                    // Go back to detail if we came from there, or list
                    selectedJob ? setView("detail") : handleBack();
                }}
                onSave={handleSave}
            />
        );
    }

    // Default: list
    return (
        <JobsTab
            {...props}                  // pass through all your existing props
            onViewJob={handleViewJob}   // NEW
            onEditJob={handleEditJob}   // NEW
        />
    );
}