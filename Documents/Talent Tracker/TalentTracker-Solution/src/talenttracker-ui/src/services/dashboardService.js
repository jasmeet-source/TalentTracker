import api from './api';

const dashboardService = {
    getStats: async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
        const response = await api.get(`/dashboard/stats?userId=${userId}`);
        return response.data;
    }
};

export default dashboardService;
