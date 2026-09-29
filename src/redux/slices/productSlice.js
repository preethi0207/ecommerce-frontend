import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

export const fetchProducts = createAsyncThunk(
    'products/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await productService.getAllProducts();
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    'products/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await productService.getProductById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        currentProduct: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.currentProduct = action.payload;
            });
    },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
