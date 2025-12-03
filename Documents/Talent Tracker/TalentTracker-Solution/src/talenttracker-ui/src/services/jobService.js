import api from './api';

const jobService = {
    getAllJobs: async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        let url = '/Jobs';
        if (userId) {
            url += `?userId=${userId}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    getJobById: async (id) => {
        const response = await api.get(`/Jobs/${id}`);
        return response.data;
    },

    getJobsByCompany: async (companyId) => {
        const response = await api.get(`/Jobs/company/${companyId}`);
        return response.data;
    },

    getJobsByConsultant: async (consultantId) => {
        const response = await api.get(`/Jobs/consultant/${consultantId}`);
        return response.data;
    },

    postJob: async (jobData) => {
        // jobData should match CreateJobRequest DTO
        // userId and companyId are passed as query params in the current controller implementation
        // In a real app, these would be extracted from the token
        // For now, we'll assume the user object is in local storage or context and pass it
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        const companyId = user?.companyId;

        let url = `/Jobs?userId=${userId}`;
        if (companyId) {
            url += `&companyId=${companyId}`;
        }

        const response = await api.post(url, jobData);
        return response.data;
    },

    getRecommendedJobs: async (userId) => {
        const response = await api.get(`/Jobs/recommended/${userId}`);
        return response.data;
    },

    closeJob: async (jobId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        const response = await api.post(`/Jobs/${jobId}/close?userId=${userId}`);
        return response.data;
    }
};

export default jobService;
