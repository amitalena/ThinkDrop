import userReducer from '../../features/slices/userSlice';
import blogReducer from '../../features/slices/blogSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        user: userReducer,
        blog: blogReducer,
    },
});
