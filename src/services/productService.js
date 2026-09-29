import api from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constant';

export const productService = {
    getAllProducts: async () => {
        const response = await api.get(API_ENDPOINTS.PRODUCTS);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
        return response.data;
    },

    getProductsByCategory: async (categoryId) => {
        const response = await api.get(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(categoryId));
        return response.data;
    },

    createProduct: async (product) => {
        const response = await api.post(API_ENDPOINTS.PRODUCTS, product);
        return response.data;
    },

    updateProduct: async (id, product) => {
        const response = await api.put(API_ENDPOINTS.PRODUCT_BY_ID(id), product);
        return response.data;
    },

    deleteProduct: async (id) => {
        await api.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
    },
};
