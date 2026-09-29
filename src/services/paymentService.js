import api from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constant';

export const paymentService = {
    createPaymentOrder: async (orderId) => {
        const response = await api.post(API_ENDPOINTS.CREATE_PAYMENT_ORDER, { orderId });
        return response.data;
    },

    verifyPayment: async (verifyPaymentRequest) => {
        const response = await api.post(API_ENDPOINTS.VERIFY_PAYMENT, verifyPaymentRequest);
        return response.data;
    },
};