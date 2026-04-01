// ─────────────────────────────────────────────────────────────────────────────
// utils/normalizeJob.js
// Single source of truth for job field normalisation.
// Previously duplicated (with drift) in JobsTab.jsx and JobDetailPage.jsx.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalise a raw job object from the API into a consistent shape
 * regardless of which schema version the backend stored it in.
 *
 * @param {Object} job - Raw job object from API
 * @returns {Object} Normalised job object
 */
export function normalizeJob(job) {
    if (!job) return null;

    const loc = job?.location ?? {};

    return {
        ...job,

        // Title — two possible field names
        jobTitle: job?.jobTitle ?? job?.title ?? '—',

        // Description
        jobDescription: job?.jobDescription ?? '',

        // Location — top-level fields take precedence over nested location obj
        city:    job?.city    ?? loc.city    ?? '',
        state:   job?.state   ?? loc.state   ?? '',
        country: job?.country ?? loc.country ?? '',
        isRemote:   job?.isRemote   ?? loc.isRemote   ?? false,
        remoteType: job?.remoteType ?? loc.remoteType ?? 'onsite',

        // Dates
        postedOn: job?.postedOn ?? job?.postedDate ?? null,
        lastDate: job?.lastDate ?? job?.applicationDeadline ?? null,

        // Active state
        active: job?.active ?? job?.isActive ?? false,

        // Experience — prefer workExperience (normalised by backend), fall back to minExperience
        workExperience:
            job?.workExperience != null
                ? job.workExperience
                : (typeof job?.minExperience === 'number' ? job.minExperience : 0),

        minExperience: job?.minExperience ?? 0,
        maxExperience: job?.maxExperience ?? null,

        // Skills
        requiredSkills: job?.requiredSkills ?? [],

        // Counts
        applicationsCount: job?.applicationsCount ?? 0,
        openings:          job?.openings          ?? 1,

        // Match scores (may be undefined for non-ranked views)
        matchScore:          job?.matchScore          ?? null,
        matchPercentage:     job?.matchPercentage     ?? null,
        skillMatchCount:     job?.skillMatchCount     ?? null,
        totalRequiredSkills: job?.totalRequiredSkills ?? null,
        experienceMatch:     job?.experienceMatch     ?? null,

        // Meta
        jobType:        job?.jobType        ?? '',
        status:         job?.status         ?? '',
        experienceLevel: job?.experienceLevel ?? '',
        category:        job?.category        ?? '',
        isFeatured:      job?.isFeatured      ?? false,
        salary:          job?.salary          ?? null,
        companyName:     job?.companyName     ?? 'Unknown Company',
        companyLogo:     job?.companyLogo     ?? null,
        companyWebsite:  job?.companyWebsite  ?? null,
        industry:        job?.industry        ?? null,
    };
}

/**
 * Calculate how many days are left until a deadline date.
 * Returns null if no date provided, negative values if expired.
 *
 * @param {string|Date|null} dateVal
 * @returns {number|null}
 */
export function daysLeft(dateVal) {
    if (!dateVal) return null;
    const diff = new Date(dateVal) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format a date to a short human-readable string.
 *
 * @param {string|Date|null} dateVal
 * @returns {string}
 */
export function fmtShort(dateVal) {
    if (!dateVal) return '—';
    return new Date(dateVal).toLocaleDateString('en-US', {
        month: 'short',
        day:   'numeric',
        year:  'numeric',
    });
}