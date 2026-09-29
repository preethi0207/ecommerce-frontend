import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (loginRequest, { rejectWithValue }) => {
        try {
            const response = await authService.login(loginRequest);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (registerRequest, { rejectWithValue }) => {
        try {
            const response = await authService.register(registerRequest);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: (() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
        })(),
        token: localStorage.getItem('jwtToken') || null,
        isAuthenticated: !!localStorage.getItem('jwtToken'),
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = {
                    id: action.payload.id,
                    email: action.payload.email,
                    role: action.payload.role,
                };
                localStorage.setItem('jwtToken', action.payload.token);
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = {
                    id: action.payload.id,
                    email: action.payload.email,
                    role: action.payload.role,
                };
                localStorage.setItem('jwtToken', action.payload.token);
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }, 
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
