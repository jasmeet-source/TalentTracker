import api from './api';

const consultantService = {
    searchConsultants: async (query) => {
        const response = await api.get(`/Consultants/search?query=${query || ''}`);
        return response.data;
    },
    requestAccess: async (employerId, consultantId, note = '') => {
        const response = await api.post(`/Consultants/request?employerId=${employerId}&consultantId=${consultantId}&note=${encodeURIComponent(note)}`);
        return response.data;
    },
    grantAccess: async (employerId, consultantId, note = '') => {
        const response = await api.post(`/Consultants/grant?employerId=${employerId}&consultantId=${consultantId}&note=${encodeURIComponent(note)}`);
        return response.data;
    },
    approveRequest: async (requestId) => {
        const response = await api.post(`/Consultants/approve/${requestId}`);
        return response.data;
    },
    rejectRequest: async (requestId) => {
        const response = await api.post(`/Consultants/reject/${requestId}`);
        return response.data;
    },
    removeConsultant: async (employerId, consultantId) => {
        const response = await api.delete(`/Consultants/remove?employerId=${employerId}&consultantId=${consultantId}`);
        return response.data;
    },
    getEmployerConsultants: async (employerId) => {
        const response = await api.get(`/Consultants/employer/${employerId}`);
        return response.data;
    },
    getConsultantClients: async (consultantId) => {
        const response = await api.get(`/Consultants/consultant/${consultantId}`);
        return response.data;
    }
};

export default consultantService;
