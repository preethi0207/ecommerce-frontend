import api from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constant';

export const orderService = {
    createOrder: async (createOrderRequest) => {
        const response = await api.post(API_ENDPOINTS.CREATE_ORDER, createOrderRequest);
        return response.data;
    },

verifyPayment: async (verifyPaymentRequest) => {
        const response = await api.post(API_ENDPOINTS.VERIFY_PAYMENT, verifyPaymentRequest);
        return response.data;
    },

getOrderHistory: async () => {
        const response = await api.get(API_ENDPOINTS.ORDER_HISTORY);
        return response.data;
    },

getOrderById: async (orderId) => {
        const response = await api.get(API_ENDPOINTS.ORDER_BY_ID(orderId));
        return response.data;
    },

cancelOrder: async (orderId) => {
        const response = await api.put(API_ENDPOINTS.CANCEL_ORDER(orderId));
        return response.data;
    },
};