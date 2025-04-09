import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Typography, Button, Grid, Paper, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody,
    Skeleton, Stack, Tooltip, IconButton
} from '@mui/material';
import { DeleteOutline, EditOutlined, VisibilityOutlined } from '@mui/icons-material';
import { createBlog, deleteBlog, getAllBlogs, updateBlog } from '../../features/slices/blogSlice';
import BlogModal from './BlogModal';
import BlogView from './BlogView';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const IMG_BASE_URL = "http://localhost:5000/uploads/blogs";

const BlogList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blogs, loading } = useSelector(state => state.blog);
    const [open, setOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [modalType, setModalType] = useState(null);

    useEffect(() => {
        dispatch(getAllBlogs());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            dispatch(deleteBlog(id));
        }
    };

    const handleOpenModal = (type, blog = null) => {
        setModalType(type);
        setSelectedBlog(blog);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBlog(null);
        setModalType(null);
    };

    const handleSubmit = async (values) => {

        try {
            // Ensure required fields are present
            if (!values.title || !values.description) {
                console.warn("Title and description are required.");
                return;
            }

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);

            // Handle image only if present
            if (values.blogImage) {
                if (values.blogImage instanceof File) {
                    formData.append("blogImage", values.blogImage);
                } else if (typeof values.blogImage === 'string') {
                    formData.append("blogImagePath", values.blogImage);
                }
            }

            if (modalType === 'add') {
                await dispatch(createBlog(formData)).unwrap();
                toast.success("Blog created successfully");
            } else if (modalType === 'edit' && selectedBlog?._id) {
                await dispatch(updateBlog({ id: selectedBlog._id, formData })).unwrap();
                toast.success("Blog updated successfully");
            }

            handleClose();
            navigate('/');
        } catch (error) {
            console.error("Error saving blog:", error);
            toast.error("Failed to save blog");
        }
    };


    const tableHeaders = useMemo(() => ['S.No', 'Image', 'Title', 'Description', 'Actions'], []);

    return (
        <>
            <Paper elevation={0} sx={{ p: 2, mt: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                    <Grid size>
                        <Typography variant="h6">Blogs [{blogs?.length || 0}]</Typography>
                    </Grid>
                    <Grid size>
                        <Button variant="contained" onClick={() => handleOpenModal('add')}>
                            Add Blog
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{
                                backgroundImage: "linear-gradient(to left,#87dbaa,rgba(24, 132, 42, 0.57),#87dbaa)",
                                backgroundColor: "transparent",
                            }}>
                                {tableHeaders.map(header => (
                                    <TableCell key={header} sx={{ color: '#333', fontWeight: 'bold' }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, rowIdx) => (
                                    <TableRow key={rowIdx}>
                                        {Array.from({ length: tableHeaders.length }).map((_, cellIdx) => (
                                            <TableCell key={cellIdx}>
                                                <Skeleton variant="text" height={20} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : blogs.length > 0 ? (
                                blogs.map((item, index) => (
                                    <TableRow key={item._id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Box
                                                component="img"
                                                src={`${IMG_BASE_URL}/${item?.blogImage}?t=${new Date(item.updatedAt).getTime()}`}
                                                alt={item.title}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1,
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>
                                            {item.description}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Tooltip title="View">
                                                    <IconButton size="small" onClick={() => handleOpenModal('view', item)}>
                                                        <VisibilityOutlined sx={{ fontSize: 18, color: "#1a237e" }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => handleOpenModal('edit', item)}>
                                                        <EditOutlined sx={{ fontSize: 18, color: "#2e7d32" }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" onClick={() => handleDelete(item._id)}>
                                                        <DeleteOutline sx={{ fontSize: 18, color: "#d32f2f" }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={tableHeaders.length} align="center">
                                        No blogs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {modalType === 'add' && (
                <BlogModal
                    open={open}
                    handleClose={handleClose}
                    onSubmit={handleSubmit}
                />
            )}

            {modalType === 'edit' && (
                <BlogModal
                    open={open}
                    handleClose={handleClose}
                    initialValues={selectedBlog}
                    onSubmit={handleSubmit}
                />
            )}

            {/* View Modal */}
            {modalType === 'view' && (
                <BlogView
                    open={open}
                    blog={selectedBlog}
                    onClose={handleClose}
                />
            )}
        </>
    );
};

export default BlogList;