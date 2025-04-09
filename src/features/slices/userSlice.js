import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const loginUser = createAsyncThunk('user/login', async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/users/login', data);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

export const userProfile = createAsyncThunk('user/profile', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/users/profile');
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(loginUser.pending, (state) => { state.loading = true; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Profile
            .addCase(userProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(userProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
