import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Grid, Stack, Card, CardMedia, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const IMG_BASE_URL = "http://localhost:5000/uploads/blogs";

const BlogView = ({ open, onClose, blog }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Blog Details<IconButton aria-label="close" onClick={onClose}
                sx={{
                    position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Card sx={{ height: '300px', width: '100%' }}>
                            <CardMedia
                                component="img"
                                src={`${IMG_BASE_URL}/${blog?.blogImage}`}
                                alt="Blog Image"
                                sx={{ width: '350px', height: '100%' }}
                            />
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Stack spacing={2}>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} variant='body1' fontWeight={'bold'}>Title:</Typography> {blog?.title}</Typography>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} variant='body1' fontWeight={'bold'}>Description:</Typography> {blog?.description}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default BlogView;