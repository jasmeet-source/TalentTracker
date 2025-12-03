import api from './api';

const applicationService = {
    apply: async (jobId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const applicantId = user?.id;
        const response = await api.post(`/Applications/apply?jobId=${jobId}&applicantId=${applicantId}`);
        return response.data;
    },

    getApplicationsByJob: async (jobId) => {
        const response = await api.get(`/Applications/job/${jobId}`);
        return response.data;
    },

    getApplicationsByUser: async (userId) => {
        const response = await api.get(`/Applications/user/${userId}`);
        return response.data;
    },

    updateStatus: async (id, status, interviewDetails = null) => {
        const response = await api.put(`/Applications/${id}/status`, { status, interview: interviewDetails });
        return response.data;
    }
};

export default applicationService;
