import api from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constant';

export const authService = {
    register: async (registerRequest) => {
        const response = await api.post(API_ENDPOINTS.REGISTER, registerRequest);
        return response.data;
    },

login: async (loginRequest) => {
        const response = await api.post(API_ENDPOINTS.LOGIN, loginRequest);
        return response.data;
    },

logout: () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
    },
};
