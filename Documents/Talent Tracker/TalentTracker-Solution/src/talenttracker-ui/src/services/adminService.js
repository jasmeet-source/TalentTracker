import api from './api';

const adminService = {
    getAllCompanies: async () => {
        const response = await api.get('/Admin/companies');
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/Admin/users');
        return response.data;
    },

    updateCompanyStatus: async (id, status) => {
        await api.put(`/Admin/companies/${id}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    updateUserStatus: async (id, status) => {
        await api.put(`/Admin/users/${id}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    deleteCompany: async (id) => {
        await api.delete(`/Admin/companies/${id}`);
    },

    deleteUser: async (id) => {
        await api.delete(`/Admin/users/${id}`);
    },

    getPlatformStats: async () => {
        const response = await api.get('/Admin/reports/stats');
        return response.data;
    }
};

export default adminService;
