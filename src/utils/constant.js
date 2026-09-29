export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    
    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    PRODUCTS_BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
    
    // Categories
    CATEGORIES: '/categories',
    
    // Cart
    CART: '/cart',
    ADD_TO_CART: '/cart/add',
    UPDATE_CART_ITEM: (itemId) => `/cart/item/${itemId}`,
    REMOVE_CART_ITEM: (itemId) => `/cart/remove/${itemId}`,

    CLEAR_CART: '/cart/clear',
    
    // Orders
    CREATE_ORDER: '/orders/checkout',
    ORDER_HISTORY: '/orders/history',
    ORDER_BY_ID: (orderId) => `/orders/${orderId}`,
    CANCEL_ORDER: (id) => `/orders/${id}/cancel`,
    
    // Payment
    // Payment
    CREATE_PAYMENT_ORDER: '/payments/create-order',
    VERIFY_PAYMENT: '/payments/verify',
};

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
};

export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
};
