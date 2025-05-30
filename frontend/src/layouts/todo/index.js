/**
=========================================================
* Material Dashboard 2 React - Todo Layout with Google Calendar Integration
=========================================================
*/

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// @mui icons
import Icon from "@mui/material/Icon";

// Authentication context
import { useAuth } from "context/AuthContext";

// Google Calendar service
import googleCalendarService from "services/googleCalendar";

function Todo() {
    // Authentication
    const { user } = useAuth();

    // Task state
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [newTask, setNewTask] = useState({
        text: "",
        priority: "medium",
        dueDate: "",
        syncWithGoogle: false
    });

    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Google Calendar state
    const [isGoogleConnected, setIsGoogleConnected] = useState(false);
    const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false);
    const [syncStatus, setSyncStatus] = useState("");
    const [googleCalendarAvailable, setGoogleCalendarAvailable] = useState(false);

    // Load tasks and Google Calendar status on component mount
    useEffect(() => {
        loadTasks();
        checkGoogleCalendarStatus();
    }, [user]);

    // Load tasks from localStorage
    const loadTasks = () => {
        if (user) {
            const savedTasks = localStorage.getItem(`tasks_${user.user_id}`);
            if (savedTasks) {
                setTasks(JSON.parse(savedTasks));
            }
        }
    };

    // Save tasks to localStorage
    const saveTasks = (updatedTasks) => {
        if (user) {
            localStorage.setItem(`tasks_${user.user_id}`, JSON.stringify(updatedTasks));
            setTasks(updatedTasks);
        }
    };

    // Check Google Calendar connection status
    const checkGoogleCalendarStatus = async () => {
        try {
            const available = googleCalendarService.isAvailable();
            setGoogleCalendarAvailable(available);

            if (available) {
                const initialized = await googleCalendarService.initialize();
                setIsGoogleConnected(initialized && googleCalendarService.isGoogleSignedIn());

                // Load sync preference
                const syncPref = localStorage.getItem(`googleSync_${user?.user_id}`);
                setGoogleSyncEnabled(syncPref === 'true');
            } else {
                // Show helpful message for development
                if (window.location.hostname === 'localhost') {
                    setSyncStatus("Google Calendar integration is disabled in development mode due to CORS restrictions. It will work in production.");
                }
            }
        } catch (error) {
            console.error('Error checking Google Calendar status:', error);
            setGoogleCalendarAvailable(false);
        }
    };

    // Connect to Google Calendar
    const connectGoogleCalendar = async () => {
        if (!googleCalendarAvailable) {
            if (window.location.hostname === 'localhost') {
                setSyncStatus("Google Calendar integration is disabled in local development. Deploy to a proper domain to enable this feature.");
            } else {
                setSyncStatus("Google Calendar API not configured. Please add your API keys to the .env file.");
            }
            setTimeout(() => setSyncStatus(""), 5000);
            return;
        }

        try {
            setSyncStatus("Connecting to Google Calendar...");
            const success = await googleCalendarService.signIn();

            if (success) {
                setIsGoogleConnected(true);
                setSyncStatus("Successfully connected to Google Calendar!");
                setTimeout(() => setSyncStatus(""), 3000);
            } else {
                setSyncStatus("Google Calendar connection not available in development mode");
                setTimeout(() => setSyncStatus(""), 3000);
            }
        } catch (error) {
            console.error('Error connecting to Google Calendar:', error);
            setSyncStatus("Error connecting to Google Calendar");
            setTimeout(() => setSyncStatus(""), 3000);
        }
    };

    // Disconnect from Google Calendar
    const disconnectGoogleCalendar = async () => {
        try {
            await googleCalendarService.signOut();
            setIsGoogleConnected(false);
            setGoogleSyncEnabled(false);
            localStorage.removeItem(`googleSync_${user?.user_id}`);
            setSyncStatus("Disconnected from Google Calendar");
            setTimeout(() => setSyncStatus(""), 3000);
        } catch (error) {
            console.error('Error disconnecting from Google Calendar:', error);
        }
    };

    // Toggle Google sync
    const toggleGoogleSync = (enabled) => {
        setGoogleSyncEnabled(enabled);
        localStorage.setItem(`googleSync_${user?.user_id}`, enabled.toString());

        if (enabled) {
            syncExistingTasksToGoogle();
        }
    };

    // Sync existing tasks to Google Calendar
    const syncExistingTasksToGoogle = async () => {
        if (!isGoogleConnected) return;

        try {
            setSyncStatus("Syncing existing tasks to Google Calendar...");

            for (const task of tasks) {
                if (!task.googleEventId && task.dueDate) {
                    const event = await googleCalendarService.createCalendarEvent(task);

                    // Update task with Google event ID
                    const updatedTasks = tasks.map(t =>
                        t.id === task.id ? { ...t, googleEventId: event.id } : t
                    );
                    saveTasks(updatedTasks);
                }
            }

            setSyncStatus("Tasks synced successfully!");
            setTimeout(() => setSyncStatus(""), 3000);
        } catch (error) {
            console.error('Error syncing tasks:', error);
            setSyncStatus("Error syncing tasks");
            setTimeout(() => setSyncStatus(""), 3000);
        }
    };

    // Add new task
    const addTask = async () => {
        if (newTask.text.trim()) {
            const task = {
                id: Date.now(),
                text: newTask.text,
                completed: false,
                date: selectedDate.toDateString(),
                priority: newTask.priority,
                dueDate: newTask.dueDate,
                userId: user.user_id,
                googleEventId: null
            };

            // Add to Google Calendar if sync is enabled
            if (googleSyncEnabled && isGoogleConnected && newTask.dueDate) {
                try {
                    setSyncStatus("Adding task to Google Calendar...");
                    const event = await googleCalendarService.createCalendarEvent(task);
                    task.googleEventId = event.id;
                    setSyncStatus("Task added to Google Calendar!");
                    setTimeout(() => setSyncStatus(""), 3000);
                } catch (error) {
                    console.error('Error adding task to Google Calendar:', error);
                    setSyncStatus("Task added locally, but failed to sync with Google Calendar");
                    setTimeout(() => setSyncStatus(""), 3000);
                }
            }

            const updatedTasks = [...tasks, task];
            saveTasks(updatedTasks);

            setNewTask({ text: "", priority: "medium", dueDate: "", syncWithGoogle: false });
            setShowTaskDialog(false);
        }
    };

    // Toggle task completion
    const toggleTask = async (taskId) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const updatedTask = { ...task, completed: !task.completed };

                // Update Google Calendar if synced
                if (googleSyncEnabled && isGoogleConnected && task.googleEventId) {
                    googleCalendarService.updateCalendarEvent(task.googleEventId, updatedTask)
                        .catch(error => console.error('Error updating Google Calendar:', error));
                }

                return updatedTask;
            }
            return task;
        });

        saveTasks(updatedTasks);
    };

    // Delete task
    const deleteTask = async (taskId) => {
        const taskToDelete = tasks.find(task => task.id === taskId);

        // Delete from Google Calendar if synced
        if (googleSyncEnabled && isGoogleConnected && taskToDelete?.googleEventId) {
            try {
                await googleCalendarService.deleteCalendarEvent(taskToDelete.googleEventId);
            } catch (error) {
                console.error('Error deleting from Google Calendar:', error);
            }
        }

        const updatedTasks = tasks.filter(task => task.id !== taskId);
        saveTasks(updatedTasks);
    };

    // Calendar navigation functions
    const navigateMonth = (direction) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
    };

    const selectDate = (date) => {
        setSelectedDate(date);
        setShowTaskDialog(true);
    };

    // Get tasks for selected date
    const getTasksForDate = (date) => {
        return tasks.filter(task => task.date === date.toDateString());
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            const date = new Date(currentDate);
            const tasksForDay = getTasksForDate(date);
            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();

            days.push({
                date,
                day: date.getDate(),
                isCurrentMonth,
                isToday,
                isSelected,
                taskCount: tasksForDay.length,
                completedTasks: tasksForDay.filter(task => task.completed).length
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Grid container spacing={3}>
                    {/* Google Calendar Integration Panel */}
                    <Grid item xs={12}>
                        <Card>
                            <MDBox p={3}>
                                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <MDTypography variant="h6">Google Calendar Integration</MDTypography>
                                    <MDBox display="flex" alignItems="center" gap={2}>
                                        {window.location.hostname === 'localhost' ? (
                                            <Chip
                                                label="Disabled in Development"
                                                color="warning"
                                                icon={<Icon>info</Icon>}
                                            />
                                        ) : googleCalendarAvailable ? (
                                            <>
                                                {isGoogleConnected ? (
                                                    <>
                                                        <Chip
                                                            label="Connected"
                                                            color="success"
                                                            icon={<Icon>check_circle</Icon>}
                                                        />
                                                        <MDButton
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={disconnectGoogleCalendar}
                                                        >
                                                            Disconnect
                                                        </MDButton>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Chip
                                                            label="Not Connected"
                                                            color="default"
                                                            icon={<Icon>cloud_off</Icon>}
                                                        />
                                                        <MDButton
                                                            variant="gradient"
                                                            color="info"
                                                            size="small"
                                                            onClick={connectGoogleCalendar}
                                                        >
                                                            <Icon sx={{ mr: 1 }}>event</Icon>
                                                            Connect Google Calendar
                                                        </MDButton>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <Chip
                                                label="API Not Configured"
                                                color="warning"
                                                icon={<Icon>warning</Icon>}
                                            />
                                        )}
                                    </MDBox>
                                </MDBox>

                                {syncStatus && (
                                    <Alert
                                        severity={syncStatus.includes('Error') || syncStatus.includes('Failed') ? 'error' : 'info'}
                                        sx={{ mb: 2 }}
                                    >
                                        {syncStatus}
                                    </Alert>
                                )}

                                {window.location.hostname === 'localhost' && (
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        <MDTypography variant="body2">
                                            <strong>Development Mode:</strong> Google Calendar integration is disabled locally due to CORS and CSP restrictions.
                                            <br />
                                            To enable in production:
                                            <br />
                                            1. Deploy your app to a proper domain (not localhost)
                                            <br />
                                            2. Add your domain to Google Cloud Console OAuth settings
                                            <br />
                                            3. The integration will work automatically
                                        </MDTypography>
                                    </Alert>
                                )}

                                {!googleCalendarAvailable && window.location.hostname !== 'localhost' && (
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        <MDTypography variant="body2">
                                            To enable Google Calendar integration:
                                            <br />
                                            1. Get Google Calendar API credentials from Google Cloud Console
                                            <br />
                                            2. Add them to your .env file as REACT_APP_GOOGLE_CLIENT_ID and REACT_APP_GOOGLE_API_KEY
                                            <br />
                                            3. Restart the application
                                        </MDTypography>
                                    </Alert>
                                )}
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Calendar */}
                    <Grid item xs={12} md={8}>
                        <Card>
                            <MDBox p={3}>
                                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                    <MDTypography variant="h5">
                                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                    </MDTypography>
                                    <MDBox>
                                        <IconButton onClick={() => navigateMonth(-1)}>
                                            <Icon>chevron_left</Icon>
                                        </IconButton>
                                        <IconButton onClick={() => navigateMonth(1)}>
                                            <Icon>chevron_right</Icon>
                                        </IconButton>
                                    </MDBox>
                                </MDBox>

                                {/* Calendar Grid */}
                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 2 }}>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <Box key={day} sx={{ p: 1, textAlign: 'center', fontWeight: 'bold' }}>
                                            <MDTypography variant="caption">{day}</MDTypography>
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                                    {calendarDays.map((day, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => selectDate(day.date)}
                                            sx={{
                                                p: 1,
                                                minHeight: 60,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                backgroundColor: day.isSelected ? '#1976d2' :
                                                    day.isToday ? '#e3f2fd' :
                                                        day.isCurrentMonth ? '#fff' : '#f5f5f5',
                                                color: day.isSelected ? '#fff' :
                                                    day.isCurrentMonth ? '#000' : '#999',
                                                '&:hover': {
                                                    backgroundColor: day.isSelected ? '#1565c0' : '#f0f0f0'
                                                }
                                            }}
                                        >
                                            <MDTypography variant="body2" fontWeight={day.isToday ? 'bold' : 'normal'}>
                                                {day.day}
                                            </MDTypography>
                                            {day.taskCount > 0 && (
                                                <Box mt={0.5}>
                                                    <Chip
                                                        label={`${day.completedTasks}/${day.taskCount}`}
                                                        size="small"
                                                        color={day.completedTasks === day.taskCount ? "success" : "primary"}
                                                        sx={{ fontSize: '0.6rem', height: 16 }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Tasks for Selected Date */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <MDBox p={3}>
                                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <MDTypography variant="h6">
                                        Tasks for {selectedDate.toLocaleDateString()}
                                    </MDTypography>
                                    <MDButton
                                        variant="gradient"
                                        color="success"
                                        size="small"
                                        onClick={() => setShowTaskDialog(true)}
                                    >
                                        <Icon sx={{ mr: 1 }}>add</Icon>
                                        Add Task
                                    </MDButton>
                                </MDBox>

                                <List>
                                    {getTasksForDate(selectedDate).map((task) => (
                                        <ListItem key={task.id} divider>
                                            <Checkbox
                                                checked={task.completed}
                                                onChange={() => toggleTask(task.id)}
                                                color="primary"
                                            />
                                            <ListItemText
                                                primary={task.text}
                                                secondary={
                                                    <Box>
                                                        <Chip
                                                            label={task.priority}
                                                            size="small"
                                                            color={
                                                                task.priority === 'high' ? 'error' :
                                                                    task.priority === 'medium' ? 'warning' : 'success'
                                                            }
                                                            sx={{ mr: 1 }}
                                                        />
                                                        {task.dueDate && (
                                                            <MDTypography variant="caption" color="text">
                                                                Due: {new Date(task.dueDate).toLocaleString()}
                                                            </MDTypography>
                                                        )}
                                                        {task.googleEventId && (
                                                            <Icon sx={{ ml: 1, fontSize: 16, color: '#4285f4' }}>event</Icon>
                                                        )}
                                                    </Box>
                                                }
                                                sx={{
                                                    textDecoration: task.completed ? 'line-through' : 'none',
                                                    opacity: task.completed ? 0.6 : 1
                                                }}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => deleteTask(task.id)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>

                                {getTasksForDate(selectedDate).length === 0 && (
                                    <MDTypography variant="body2" color="text" textAlign="center" py={3}>
                                        No tasks for this date. Click "Add Task" to create one!
                                    </MDTypography>
                                )}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>

                {/* Add Task Dialog */}
                <Dialog open={showTaskDialog} onClose={() => setShowTaskDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <MDTypography variant="h5">Add New Task</MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        <MDBox mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Task Description"
                                        value={newTask.text}
                                        onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Priority</InputLabel>
                                        <Select
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                            label="Priority"
                                        >
                                            <MenuItem value="low">Low</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="high">High</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Due Date & Time"
                                        type="datetime-local"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                {isGoogleConnected && (
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={googleSyncEnabled}
                                                    disabled={!newTask.dueDate}
                                                />
                                            }
                                            label={`Sync with Google Calendar ${!newTask.dueDate ? '(requires due date)' : ''}`}
                                        />
                                    </Grid>
                                )}
                            </Grid>
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowTaskDialog(false)}>Cancel</Button>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={addTask}
                            disabled={!newTask.text.trim()}
                        >
                            Add Task
                        </MDButton>
                    </DialogActions>
                </Dialog>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Todo; 