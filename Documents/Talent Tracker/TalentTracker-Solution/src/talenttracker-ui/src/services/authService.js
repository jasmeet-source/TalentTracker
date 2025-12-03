import api from './api';

const authService = {
    login: async (identifier, password, role) => {
        const response = await api.post('/Auth/login', { identifier, password, role });
        if (response.data.token) {
            // Normalize role to lowercase to match frontend expectations
            response.data.role = response.data.role.toLowerCase();
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/Auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    changePassword: async (userId, oldPassword, newPassword) => {
        const response = await api.post('/Auth/change-password', { userId, oldPassword, newPassword });
        return response.data;
    }
};

export default authService;
