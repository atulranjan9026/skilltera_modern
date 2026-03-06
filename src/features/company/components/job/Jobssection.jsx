import { useState } from "react";
import { JobsTab } from "../JobsTab";
import { JobDetailPage } from "./Jobdetailpage";
import { JobEditPage } from "./Jobeditpage";
import { companyService } from "../../../../services/companyService";
import { getCompanyUser, getCompanyId } from "../../../../utils/auth";

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
        console.log("handleEditJob called with job:", job);
        console.log("Job ID in handleEditJob:", job._id || job.jobId);
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
            
            console.log("Company user object:", companyUser);
            console.log("Company ID type:", typeof companyId, companyId);
            
            // Clean the job object - remove conflicting ID fields
            const jobData = { ...updatedJob };
            delete jobData._id; // Remove _id from data being sent
            delete jobData.jobId; // Remove jobId from data being sent
            delete jobData.companyId; // Remove companyId from data being sent
            
            console.log("Updating job with details:");
            console.log("- Company ID:", companyId);
            console.log("- Job ID:", jobId);
            console.log("- Full job object:", updatedJob);
            console.log("- Job data to send:", jobData);
            
            await companyService.updateJob(companyId, jobId, jobData);
            
            // Refresh the jobs list if the refresh function is provided
            if (props.onRetry) {
                props.onRetry();
            }
            
            // Go back to detail view after successful save
            setView("detail");
        } catch (error) {
            console.error("Failed to save job:", error);
            console.error("Error details:", {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
            throw error; // Let the JobEditPage handle the error display
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