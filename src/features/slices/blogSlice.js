import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";


// Create Blog
export const createBlog = createAsyncThunk("/blog/create", async (formData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('blogs/create', formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

// Get All Blogs
export const getAllBlogs = createAsyncThunk("blog/getAll", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('blogs/all', { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

// Get Single Blog
export const getSingleBlog = createAsyncThunk("blog/getSingle", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`blogs/${id}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

// Update Blog
export const updateBlog = createAsyncThunk("blog/update", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.put(`blogs/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

// Delete Blog
export const deleteBlog = createAsyncThunk("blog/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete(`blogs/${id}`, { withCredentials: true });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

const blogSlice = createSlice({
    name: "blog",
    initialState: {
        blogs: [],
        blog: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearBlogState: (state) => {
            state.blog = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // createBlog
            .addCase(createBlog.pending, (state) => { state.loading = true; })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs.push(action.payload);
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getAllBlogs
            .addCase(getAllBlogs.pending, (state) => { state.loading = true; })
            .addCase(getAllBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload.data;
            })
            .addCase(getAllBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // getSingleBlog
            .addCase(getSingleBlog.pending, (state) => { state.loading = true; })
            .addCase(getSingleBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.blog = action.payload.data;
            })
            .addCase(getSingleBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateBlog
            .addCase(updateBlog.pending, (state) => { state.loading = true; })
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = state.blogs.map((b) => (b._id === action.payload?._id ? action.payload : b));
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deleteBlog
            .addCase(deleteBlog.pending, (state) => { state.loading = true; })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = state.blogs.filter((b) => b._id !== action.payload._id);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBlogState } = blogSlice.actions;
export default blogSlice.reducer;
