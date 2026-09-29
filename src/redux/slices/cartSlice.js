import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';

export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await cartService.getCart();
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/add',
    async (addToCartRequest, { rejectWithValue }) => {
        try {
            return await cartService.addToCart(addToCartRequest);
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/update',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            return await cartService.updateCartItem(itemId, quantity);
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/remove',
    async (itemId, { rejectWithValue }) => {
        try {
            return await cartService.removeFromCart(itemId);
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalAmount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items || [];
                state.totalAmount = action.payload.totalAmount || 0;
            });
    },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
