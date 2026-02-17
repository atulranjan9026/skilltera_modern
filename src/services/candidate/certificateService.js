import { post, put, del, clearCache } from '../api';

export const certificateService = {
    /**
     * Add certificate
     */
    addCertificate: async (certificateData) => {
        clearCache('GET:/candidates/profile');
        return post('/candidates/profile/certificates', certificateData);
    },

    /**
     * Update certificate
     */
    updateCertificate: async (certificateId, certificateData) => {
        clearCache('GET:/candidates/profile');
        return put(`/candidates/profile/certificates/${certificateId}`, certificateData);
    },

    /**
     * Delete certificate
     */
    deleteCertificate: async (certificateId) => {
        clearCache('GET:/candidates/profile');
        return del(`/candidates/profile/certificates/${certificateId}`);
    }
};
