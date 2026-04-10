import { useState } from "react";
import { JobsTab } from "../JobsTab";
import { JobDetailPage } from "./Jobdetailpage";
import { JobEditPage } from "./Jobeditpage";
import { companyService } from "../../../../services/companyService";
import { getCompanyUser } from "../../../../utils/auth";
import { toast } from "../../../../utils/toast";

// ── Default filter state (mirrors JobsTab's internal DEFAULT_FILTERS) ────────
const DEFAULT_FILTERS = {
    jobType:         [],
    status:          [],
    experience:      '',
    deadlineWithin:  '',
    hiringManagerId: '',
    lobId:           '',
    backupHiringManagerId: '',
    recruiterIds:    [],
};

/**
 * JobsSection
 * - Owns filter state so filter changes can be forwarded to the parent's
 *   fetchJobs via onFiltersChange.
 * - Manages which sub-view is rendered: list / detail / edit.
 */
export function JobsSection(props) {
    const {
        // fetchJobs trigger exposed by CompanyDashboard
        onFiltersChange,
        // everything else is forwarded to JobsTab / Detail / Edit
        ...rest
    } = props;

    const [view, setView]             = useState("list"); // "list" | "detail" | "edit"
    const [selectedJob, setSelectedJob] = useState(null);
    const [filters, setFilters]         = useState(DEFAULT_FILTERS);

    // ── Intercept filter changes → notify parent to re-fetch ─────────────────
    function handleSetFilters(updater) {
        setFilters(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            // Reset to page 1 and re-fetch with new filters
            onFiltersChange?.(next);
            return next;
        });
    }

    /* ── view handlers ── */
    function handleViewJob(job) {
        setSelectedJob(job);
        setView("detail");
    }

    function handleEditJob(job) {
        setSelectedJob(job);
        setView("edit");
    }

    async function handleDeleteJob(job) {
        try {
            const companyUser = getCompanyUser();
            const companyId = companyUser._id || companyUser.id;

            if (!companyId) throw new Error("Company ID is required for delete");

            await companyService.deleteJob(companyId, job._id || job.jobId);
            toast.success(`Job "${job.jobTitle}" deleted successfully!`);

            if (props.onRetry) props.onRetry();

            setView("list");
            setSelectedJob(null);
        } catch (error) {
            console.error("Failed to delete job:", error);
            const errMsg = error.response?.data?.message || error.message || "Failed to delete job.";
            toast.error(errMsg);
        }
    }

    function handleBack() {
        setView("list");
        setSelectedJob(null);
    }

    async function handleSave(updatedJob) {
        try {
            const companyUser = getCompanyUser();
            const companyId = companyUser._id || companyUser.id;
            const jobId = updatedJob._id || updatedJob.jobId;

            if (!jobId)     throw new Error("Job ID is required for update");
            if (!companyId) throw new Error("Company ID is required for update");

            const jobData = { ...updatedJob };
            delete jobData._id;
            delete jobData.jobId;
            delete jobData.companyId;

            await companyService.updateJob(companyId, jobId, jobData);

            setSelectedJob(updatedJob);
            toast.success("Job updated successfully!");

            if (props.onRetry) props.onRetry();

            setView("detail");
        } catch (error) {
            console.error("Failed to save job:", error);
            const errMsg = error.response?.data?.message || error.message || "Failed to update job.";
            toast.error(errMsg);
            throw error;
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
                    selectedJob ? setView("detail") : handleBack();
                }}
                onSave={handleSave}
            />
        );
    }

    // Default: list
    return (
        <JobsTab
            {...rest}
            filters={filters}
            setFilters={handleSetFilters}
            onViewJob={handleViewJob}
            onEditJob={handleEditJob}
            onDeleteJob={handleDeleteJob}
        />
    );
}