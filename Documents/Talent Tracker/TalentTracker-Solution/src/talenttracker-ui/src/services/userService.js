import api from './api';

const userService = {
    getUserById: async (id) => {
        const response = await api.get(`/Users/${id}`);
        return response.data;
    },

    updateProfile: async (id, profileData) => {
        await api.put(`/Users/${id}`, profileData);
    },

    uploadResume: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/Users/${id}/resume`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getProfileCompleteness: async (id) => {
        const response = await api.get(`/Users/${id}/completeness`);
        return response.data.completeness;
    },

    getEmployers: async () => {
        const response = await api.get('/Users/employers');
        return response.data;
    }
};

export default userService;
