import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';

export const createOrder = createAsyncThunk(
    'orders/create',
    async (createOrderRequest, { rejectWithValue }) => {
        try {
            return await orderService.createOrder(createOrderRequest);
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchOrderHistory = createAsyncThunk(
    'orders/fetchHistory',
    async (_, { rejectWithValue }) => {
        try {
            return await orderService.getOrderHistory();
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async (orderId, { rejectWithValue }) => {
        try {
            return await orderService.cancelOrder(orderId);
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        currentOrder: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderHistory.fulfilled, (state, action) => {
                state.orders = action.payload;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                const updated = action.payload;
                state.orders = state.orders.map((o) =>
                    o.id === updated.id ? updated : o
                );
            });
    },
});

export default orderSlice.reducer;