import api from './api';

const notificationService = {
    getNotifications: async (userId) => {
        const response = await api.get(`/Notifications/user/${userId}`);
        return response.data;
    },
    markAsRead: async (id) => {
        const response = await api.post(`/Notifications/mark-read/${id}`);
        return response.data;
    }
};

export default notificationService;
