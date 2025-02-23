/* eslint-disable react/prop-types */
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { Timeline as TimelineMUI } from '@mui/lab';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Backdrop, Box, Button, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Timeline.css';

const Timeline = ({ openTimeline, handleCloseTimeline }) => {
    const [entries, setEntries] = useState(() => {
        const savedEntries = localStorage.getItem('timetableEntries');
        return savedEntries ? JSON.parse(savedEntries) : [];
    });

    useEffect(() => {
        localStorage.setItem('timetableEntries', JSON.stringify(entries));
    }, [entries]);

    const [newEntry, setNewEntry] = useState({ time: '', name: '', function: '' });
    const [isEditing, setIsEditing] = useState(false);

    const handleAddEntry = (e) => {
        e.preventDefault();
        if (newEntry.time && newEntry.name && newEntry.function) {
            setEntries([{ ...newEntry, id: uuidv4() }, ...entries]);
            setNewEntry({ time: '', name: '', function: '' });
        }
    };

    const handleEditTimetable = () => {
        setIsEditing(!isEditing);
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleExportTimetable = () => {
        if (isExporting) return;

        setIsExporting(true);

        const timetableData = entries
            .map(entry => `Hora: ${entry.time}, Nome: ${entry.name}, Função: ${entry.function}`)
            .join('\n');

        const blob = new Blob([timetableData], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'horarios.txt';

        link.click();

        setTimeout(() => {
            setIsExporting(false);
        }, 180000);
    };

    const handleEntryChange = (id, field, value) => {
        const updatedEntries = entries.map(entry =>
            entry.id === id ? { ...entry, [field]: value } : entry
        );
        setEntries(updatedEntries);
    };

    const handleStartEditing = (id) => {
        const updatedEntries = entries.map(entry =>
            entry.id === id ? { ...entry, isEditing: true, tempTime: entry.time } : entry
        );
        setEntries(updatedEntries);
    };

    const handleCommitChange = (id) => {
        const updatedEntries = entries.map(entry => {
            if (entry.id === id && entry.isEditing) {
                return { ...entry, time: entry.tempTime, tempTime: undefined, isEditing: false };
            }
            return entry;
        });
        setEntries(updatedEntries);
    };

    const handleDeleteTimetable = (id) => {
        setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    };

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: 1 }}
                open={openTimeline}
                onClick={handleCloseTimeline}
            >
                <div onClick={(e) => e.stopPropagation()} className="timeline-content">
                    <Box sx={{ maxWidth: 600, margin: 'auto', position: 'relative' }}>
                        {entries.length > 0 &&
                            <div>
                                <Tooltip title="Exportar">
                                    <IconButton
                                        onClick={handleExportTimetable}
                                        disabled={isExporting}
                                        sx={{
                                            textTransform: 'none',
                                            color: 'gray',
                                            marginTop: 1,
                                            width: '35px',
                                            height: '35px',
                                        }}
                                    >
                                        <FileUploadIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>}
                        <TimelineMUI sx={{ marginTop: entries.length > 0 ? 4 : 0 }} >
                            {entries
                                .slice()
                                .sort((a, b) => b.time.localeCompare(a.time))
                                .map((entry, index) => (
                                    <TimelineItem key={entry.id}>
                                        <TimelineOppositeContent color="text.secondary">
                                            {isEditing ? (
                                                <TextField
                                                    type="time"
                                                    value={entry.tempTime || entry.time}
                                                    size="small"
                                                    sx={{ position: 'relative', bottom: '12px' }}
                                                    onFocus={() => handleStartEditing(entry.id)}
                                                    onChange={(e) => handleEntryChange(entry.id, 'tempTime', e.target.value)}
                                                    onBlur={() => handleCommitChange(entry.id)}
                                                />
                                            ) : (
                                                entry.time
                                            )}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            {isEditing ? (
                                                <TimelineDot
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'red',
                                                        cursor: 'pointer',
                                                        ':hover': {
                                                            backgroundColor: 'darkred',
                                                        },
                                                    }}
                                                    onClick={() => handleDeleteTimetable(entry.id)}
                                                />
                                            ) : <TimelineDot />}
                                            {index !== entries.length - 1 && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent sx={{ py: 0, px: 2, position: 'relative', bottom: '6px' }}>
                                            {isEditing ? (
                                                <>
                                                    <TextField
                                                        label="Nome"
                                                        size="small"
                                                        value={entry.name}
                                                        onChange={(e) => handleEntryChange(entry.id, 'name', e.target.value)}
                                                        sx={{ marginRight: 2, width: '6rem' }}
                                                    />
                                                    <TextField
                                                        label="Função"
                                                        size="small"
                                                        value={entry.function}
                                                        onChange={(e) => handleEntryChange(entry.id, 'function', e.target.value)}
                                                        sx={{ width: '7rem' }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <Typography>{entry.name}</Typography>
                                                    <Typography variant="body2">{entry.function}</Typography>
                                                </>
                                            )}
                                        </TimelineContent>
                                    </TimelineItem>
                                ))}
                        </TimelineMUI>

                        <Box sx={{ textAlign: 'center', marginBottom: 2, display: 'flex', flexDirection: 'row' }}>
                            <form onSubmit={handleAddEntry}>
                                <TextField
                                    label="Horário"
                                    size="small"
                                    type="time"
                                    value={newEntry.time}
                                    onChange={(e) => setNewEntry({ ...newEntry, time: e.target.value })}
                                    sx={{ marginRight: 2 }}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                                <TextField
                                    label="Nome"
                                    size="small"
                                    value={newEntry.name}
                                    onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                                    sx={{ marginRight: 2, width: '6rem' }}
                                    required
                                />
                                <TextField
                                    label="Função"
                                    size="small"
                                    value={newEntry.function}
                                    onChange={(e) => setNewEntry({ ...newEntry, function: e.target.value })}
                                    sx={{ marginRight: 2, width: '7rem' }}
                                    required
                                />
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    type="submit"
                                    color="success"
                                    sx={{
                                        marginRight: 2,
                                        textTransform: 'none',
                                        height: '2.5rem',
                                        opacity: '0.6',
                                        ':hover': {
                                            opacity: 1,
                                        },
                                    }}
                                    startIcon={<MoreTimeIcon />}
                                >
                                    Adicionar
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={handleEditTimetable}
                                    color={'warning'}
                                    sx={{
                                        textTransform: 'none',
                                        height: '2.5rem',
                                        opacity: '0.6',
                                        ':hover': {
                                            opacity: 1,
                                        },
                                    }}
                                    startIcon={<ManageHistoryIcon />}
                                >
                                    Editar
                                </Button>
                            </form>
                        </Box>
                    </Box>
                </div>
            </Backdrop>
        </div>
    );
};

export default Timeline;
