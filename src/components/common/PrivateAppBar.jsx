/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import {
    AppBar as MuiAppBar, Box, Toolbar, CssBaseline, Typography, IconButton,
    Menu, MenuItem, Avatar, Button, Divider, Paper, Stack, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import Sidebar from './Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { logout, userProfile } from '../../features/slices/userSlice';

const IMG_BASE_URL = "http://localhost:5000/uploads/profile";

const drawerWidth = 220;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    }),
}));

export default function PrivateAppBar({ children }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state?.user);
    const isLaptop = useMediaQuery('(min-width:1024px)');
    const [open, setOpen] = useState(isLaptop);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setOpen(isLaptop);
    }, [isLaptop]);
    useEffect(() => {
        dispatch(userProfile());
    }, [dispatch]);
    const handleDrawerToggle = () => setOpen((prev) => !prev);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        dispatch(logout());
        handleMenuClose();
    };

    const renderMenu = useMemo(() => (
        <Menu
            sx={{ mt: 1 }}
            elevation={0}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
            <Paper elevation={0} sx={{ width: 260, mt: 1, textAlign: 'center', p: 2 }} >
                <Stack alignItems="center" >
                    <Tooltip title="Profile">
                        <Avatar
                            sx={{ height: 70, width: 70, border: '3px solid #dd5' }}
                            alt="profile"
                            src={`${IMG_BASE_URL}/${user?.profileImage}`}
                        />
                    </Tooltip>
                    <Typography variant="body1" mt={1}>{user?.email}</Typography>
                    <Divider sx={{ mt: 1, mb: 1, background: '#999', width: '100%' }} />
                    <Button onClick={handleLogout} fullWidth color="error" variant="outlined">
                        Logout
                    </Button>
                </Stack>
            </Paper>
        </Menu>
    ), [anchorEl, user?.profileImage, user?.email]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar elevation={0}
                position="fixed"
                open={open}
                sx={{
                    backgroundImage: "linear-gradient(to left,#87dbaa,rgba(24, 132, 42, 0.57),#87dbaa)",
                    backgroundColor: "transparent",
                }}
            >
                <Toolbar>
                    <IconButton
                        size="small"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{
                            marginRight: 2,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Stack direction="row" alignItems="center">
                        <IconButton size="small" color="inherit" onClick={handleMenuOpen}>
                            <Avatar
                                alt={'profile'}
                                src={`${IMG_BASE_URL}/${user?.profileImage}`}
                            />
                        </IconButton>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 'bold', }}>
                            Hello, {user?.email}
                        </Typography>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Sidebar open={open} handleDrawerClose={handleDrawerToggle} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                    overflowX: 'hidden',
                    backgroundImage: "linear-gradient(to left,rgb(246, 246, 246), rgba(187, 226, 202, 0.86),rgb(246, 246, 246))",
                    backgroundColor: "transparent",
                    width: open ? `calc(100vw - ${drawerWidth}px)` : "95vw",
                    height: "99vh",
                }}
            >
                <Toolbar />
                {children}
            </Box>
            {renderMenu}
        </Box>
    );
}
