import api from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constant';

export const categoryService = {
    getAllCategories: async () => {
        const response = await api.get(API_ENDPOINTS.CATEGORIES);
        return response.data;
    },

    createCategory: async (category) => {
        const response = await api.post(API_ENDPOINTS.CATEGORIES, category);
        return response.data;
    },

    updateCategory: async (id, category) => {
        const response = await api.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, category);
        return response.data;
    },

    deleteCategory: async (id) => {
        await api.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    },
};