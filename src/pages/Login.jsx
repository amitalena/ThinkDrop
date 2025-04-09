import React, { useState, useMemo } from 'react';
import {
    Box, Button, Card, CardContent, InputAdornment, IconButton,
    Grid, TextField, Typography, useTheme,
    Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { EmailOutlined, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../features/slices/userSlice';

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(prev => !prev);

    const fieldStyles = useMemo(() => ({
        borderRadius: '5px',
        border: '1px solid #eee',
        fontWeight: 100
    }), []);

    // Form validation and submission
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await dispatch(loginUser(values)).then(unwrapResult);
                if (response) {
                    toast.success('User login successful!');
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Login error:', error);
                toast.error('Invalid Credentials');
            }
        }
    });

    const renderTextField = (label, name, type = 'text', showPasswordToggle = false) => (
        <>
            <Typography variant="body2" sx={{ my: 1 }}>{label}:</Typography>
            <TextField
                {...formik.getFieldProps(name)}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                helperText={formik.touched[name] && formik.errors[name]}
                fullWidth
                placeholder={label.toLowerCase()}
                autoComplete="off"
                InputProps={{
                    sx: fieldStyles,
                    startAdornment: (
                        <InputAdornment position="start">
                            {name === 'email' ? <EmailOutlined sx={{ fontSize: '15px', color: theme.palette.primary.main }} /> :
                                <LockOutlined sx={{ fontSize: '15px', color: theme.palette.primary.main }} />}
                        </InputAdornment>
                    ),
                    ...(showPasswordToggle && {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <Visibility sx={{ color: theme.palette.primary.main }} /> :
                                        <VisibilityOff sx={{ color: theme.palette.primary.main }} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }),
                }}
                type={showPasswordToggle && name === 'password' ? (showPassword ? 'text' : 'password') : type}
            />
        </>
    );

    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} pauseOnFocusLoss draggable />
            <Box sx={{ height: { md: '100vh', xs: '95vh' }, backgroundImage: "linear-gradient(to left,#87dbaa,#18842A,#87dbaa)", width: "100vw", position: 'relative', backgroundAttachment: 'fixed' }}>
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid container size={{ md: 9 }} >
                        <Grid sizes={{ xs: 12, lg: 4 }} sx={{ margin: 'auto' }}>
                            <Card elevation={1} sx={{ borderRadius: 2, m: 1, backdropFilter: 'blur(10px)', background: 'rgba(252,252,255,0.2)' }}>
                                <CardContent>
                                    <Typography textAlign={'center'} variant='h4'>Login</Typography>
                                    <Divider />
                                    <Box component="form" onSubmit={formik.handleSubmit} sx={{ px: 2, color: '#e1eec3', mt: 2 }}>
                                        {renderTextField('Email', 'email')}
                                        {renderTextField('Password', 'password', 'password', true)}
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            fullWidth
                                            sx={{ mt: 2 }}
                                        >
                                            {loading ? 'Logging in...' : 'Login'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default Login;
