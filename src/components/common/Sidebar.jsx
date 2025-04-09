import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Avatar, Box, Collapse, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AdjustOutlined, FiberManualRecordOutlined } from '@mui/icons-material';

import { menuData } from './menuData';

const drawerWidth = 220;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    })
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    ...theme.mixins.toolbar,
}));

const Sidebar = ({ open, handleDrawerClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState({});
    const [activeItem, setActiveItem] = useState(null);

    const handleToggle = (menuName, level) => {
        setOpenMenus((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach((key) => {
                if (key.startsWith(`${level}-`) && key !== `${level}-${menuName}`) {
                    newState[key] = false;
                }
            });

            newState[`${level}-${menuName}`] = !newState[`${level}-${menuName}`];
            return newState;
        });

        setActiveItem(menuName);
    };

    const getIcon = (level) => {
        if (level === 0) return <DashboardIcon sx={{ fontSize: '24px', }} />;
        if (level === 1) return <AdjustOutlined sx={{ fontSize: '20px' }} />;
        return <FiberManualRecordOutlined sx={{ fontSize: '15px' }} />;
    };

    const renderMenuItems = (items, level = 0) => {
        return items.map((item) => {
            const isOpen = openMenus[`${level}-${item.name}`];
            const isActive = activeItem === item.name;

            return (
                <React.Fragment key={item.name}>
                    <ListItem disablePadding sx={{ display: 'flex', gap: 0.5, pl: level * 2 }}>
                        {/* Left border indicator */}
                        <Box
                            sx={{
                                background: isOpen ? '#18842A' : '#18842A',
                                borderRadius: '50px',
                                height: '32px',
                                width: '5px',
                            }}
                        />

                        <Box
                            sx={{
                                background: isActive ? '#E8F9EF' : '#E8F9EF',
                                borderRadius: '5px',
                                width: '100%',
                            }}
                        >
                            <ListItemButton
                                sx={{
                                    justifyContent: open ? 'initial' : 'center',
                                    p: 2,
                                    color: isActive ? '#18842A' : '#18842A',
                                }}
                                onClick={() => {
                                    if (item.route) {
                                        navigate(item.route);
                                        setActiveItem(item.name);
                                    }
                                    if (item.subMenu || item.nestedSubMenu) {
                                        handleToggle(item.name, level);
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ justifyContent: 'center', minWidth: 0, mr: open ? 3 : 'auto' }}>
                                    {getIcon(level)}
                                </ListItemIcon>
                                {/* Hide text when sidebar is closed */}
                                <ListItemText
                                    primary={item.name}
                                    sx={{
                                        opacity: open ? 1 : 0,
                                        display: open ? 'block' : 'none',
                                    }}
                                />
                                {(item.subMenu || item.nestedSubMenu) &&
                                    open &&
                                    (isOpen ? <ExpandMore /> : <ChevronRight />)}
                            </ListItemButton>
                        </Box>
                    </ListItem>

                </React.Fragment>
            );
        });
    };

    return (
        <Drawer variant="permanent" open={open}>
            <DrawerHeader open={open}>
                <Typography textAlign={'center'} sx={{ p: 1.5 }} variant="h6" noWrap component="div">
                    Dashboard
                </Typography>
                <IconButton variant="none" onClick={handleDrawerClose} sx={{ '&:hover': { background: 'none' }, color: '#18842A' }}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <Box sx={{ m: 1 }}>
                <List>
                    {menuData.map((section) => (
                        <React.Fragment key={section.label}>
                            {open && <ListItemText sx={{ fontWeight: 'normal', textTransform: 'uppercase' }}>{section.label}</ListItemText>}
                            {renderMenuItems(section.items)}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
