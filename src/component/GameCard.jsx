// src/components/GameCard.js
import React from 'react';
import { Card, CardContent, Typography, Avatar, Chip, CardActions, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { BASE_URL } from '../costants';

const GameCard = ({ game, onEdit, onDelete, onView }) => {
    return (
        <Card
            sx={{
                maxWidth: 345,
                margin: 2,
                borderRadius: '16px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transition: '0.3s',
                '&:hover': {
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.02)',
                },
            }}
        >
            <Avatar
                src={`${BASE_URL}/img/game/${game.image}`}
                variant="rounded"
                sx={{
                    width: '100%',
                    height: 160,
                    borderRadius: '16px 16px 0 0',
                    objectFit: 'cover',
                }}
            >
                {game.name[0]}
            </Avatar>
            <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {game.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Start: {game.startDateTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    End: {game.endDateTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Result: {game.resultDateTime}
                </Typography>
                <Box sx={{ marginTop: 1 }}>
                    {game.finalBidNumber ? (
                        <Chip
                            label={game.finalBidNumber}
                            sx={{
                                bgcolor: "#ff1744",
                                color: "white",
                                borderRadius: '12px',
                                fontWeight: 'bold',
                            }}
                        />
                    ) : (
                        <Chip
                            label="Not Declared"
                            color="primary"
                            sx={{
                                borderRadius: '12px',
                                fontWeight: 'bold',
                            }}
                        />
                    )}
                </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between' }}>
                <IconButton color="primary" onClick={() => onEdit(game.id)} sx={{ borderRadius: '8px', '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => onDelete(game.id)} sx={{ borderRadius: '8px', '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <DeleteIcon />
                </IconButton>
                <IconButton color="info" onClick={() => onView(game.id)} sx={{ borderRadius: '8px', '&:hover': { bgcolor: '#f5f5f5' } }}>
                    <SendIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default GameCard;
