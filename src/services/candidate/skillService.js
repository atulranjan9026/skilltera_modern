import { get, post, put, del, clearCache } from '../api';

export const skillService = {
    /**
     * Get all active skills for search
     */
    getAllActiveSkills: async (search) => {
        let endpoint = '/candidates/profile/allActiveSkills';
        if (search) {
            endpoint += `?search=${encodeURIComponent(search)}`;
        }
        const response = await get(endpoint, false, 0);
        return response?.data || [];
    },

    /**
     * Add a skill
     */
    addSkill: async (skillData) => {
        clearCache('GET:/candidates/profile');
        // Backend expects flat object { skillId, experience, rating }
        return post('/candidates/profile/skills', skillData);
    },

    /**
     * Update a skill
     */
    updateSkill: async (skillId, skillData) => {
        clearCache('GET:/candidates/profile');
        // Backend expects flat object { experience, rating }
        return put(`/candidates/profile/skills/${skillId}`, skillData);
    },

    /**
     * Delete a skill
     */
    deleteSkill: async (skillEntryId) => {
        clearCache('GET:/candidates/profile');
        return del(`/candidates/profile/skills/${skillEntryId}`);
    }
};
