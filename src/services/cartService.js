import api from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constant';

export const cartService = {
    getCart: async () => {
        const response = await api.get(API_ENDPOINTS.CART);
        return response.data;
    },

addToCart: async (addToCartRequest) => {
        const response = await api.post(API_ENDPOINTS.ADD_TO_CART, addToCartRequest);
        return response.data;
    },

updateCartItem: async (itemId, quantity) => {
        const response = await api.put(API_ENDPOINTS.UPDATE_CART_ITEM(itemId), { quantity });
        return response.data;
    },

removeFromCart: async (itemId) => {
        const response = await api.delete(API_ENDPOINTS.REMOVE_CART_ITEM(itemId));
        return response.data;
    },
};
