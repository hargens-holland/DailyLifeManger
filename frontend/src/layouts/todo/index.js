/**
=========================================================
* Material Dashboard 2 React - Todo Layout
=========================================================
*/

import { useState } from "react";

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
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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

function Todo() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState({});
    const [newTask, setNewTask] = useState("");
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Format date to use as key
    const formatDateKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Get tasks for selected date
    const getTasksForDate = (date) => {
        const dateKey = formatDateKey(date);
        return tasks[dateKey] || [];
    };

    // Add new task
    const addTask = () => {
        if (newTask.trim()) {
            const dateKey = formatDateKey(selectedDate);
            const currentTasks = tasks[dateKey] || [];
            const newTaskObj = {
                id: Date.now(),
                text: newTask.trim(),
                completed: false,
                createdAt: new Date()
            };

            setTasks({
                ...tasks,
                [dateKey]: [...currentTasks, newTaskObj]
            });

            setNewTask("");
        }
    };

    // Toggle task completion
    const toggleTask = (taskId) => {
        const dateKey = formatDateKey(selectedDate);
        const currentTasks = tasks[dateKey] || [];
        const updatedTasks = currentTasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        setTasks({
            ...tasks,
            [dateKey]: updatedTasks
        });
    };

    // Delete task
    const deleteTask = (taskId) => {
        const dateKey = formatDateKey(selectedDate);
        const currentTasks = tasks[dateKey] || [];
        const updatedTasks = currentTasks.filter(task => task.id !== taskId);

        setTasks({
            ...tasks,
            [dateKey]: updatedTasks
        });
    };

    // Handle date selection
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowTaskDialog(true);
    };

    // Calendar helper functions
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const navigateMonth = (direction) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + direction);
        setCurrentMonth(newMonth);
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateKey = formatDateKey(date);
            const hasTask = tasks[dateKey] && tasks[dateKey].length > 0;
            const isToday = formatDateKey(date) === formatDateKey(new Date());
            const isSelected = formatDateKey(date) === formatDateKey(selectedDate);

            days.push({
                day,
                date,
                hasTask,
                isToday,
                isSelected
            });
        }

        return days;
    };

    const currentTasks = getTasksForDate(selectedDate);
    const calendarDays = generateCalendarDays();

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    {/* Calendar Section */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <MDTypography variant="h6" color="white">
                                    Calendar
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                {/* Calendar Header */}
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <IconButton onClick={() => navigateMonth(-1)}>
                                        <Icon>chevron_left</Icon>
                                    </IconButton>
                                    <Typography variant="h6">
                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </Typography>
                                    <IconButton onClick={() => navigateMonth(1)}>
                                        <Icon>chevron_right</Icon>
                                    </IconButton>
                                </Box>

                                {/* Days of week header */}
                                <Grid container spacing={0}>
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <Grid item xs key={day} style={{ width: '14.28%' }}>
                                            <Box textAlign="center" py={1}>
                                                <Typography variant="caption" fontWeight="bold">
                                                    {day}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Calendar Grid */}
                                <Grid container spacing={0}>
                                    {calendarDays.map((dayObj, index) => (
                                        <Grid item key={index} style={{ width: '14.28%' }}>
                                            <Box
                                                height={40}
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    cursor: dayObj ? 'pointer' : 'default',
                                                    backgroundColor: dayObj?.isSelected ? 'primary.main' :
                                                        dayObj?.isToday ? 'primary.light' : 'transparent',
                                                    color: dayObj?.isSelected ? 'white' :
                                                        dayObj?.isToday ? 'primary.main' : 'text.primary',
                                                    borderRadius: 1,
                                                    position: 'relative',
                                                    '&:hover': dayObj ? {
                                                        backgroundColor: dayObj.isSelected ? 'primary.main' : 'action.hover'
                                                    } : {}
                                                }}
                                                onClick={() => dayObj && handleDateClick(dayObj.date)}
                                            >
                                                {dayObj && (
                                                    <>
                                                        <Typography variant="body2">
                                                            {dayObj.day}
                                                        </Typography>
                                                        {dayObj.hasTask && (
                                                            <Box
                                                                position="absolute"
                                                                bottom={2}
                                                                right={2}
                                                                width={6}
                                                                height={6}
                                                                borderRadius="50%"
                                                                bgcolor="success.main"
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Tasks Overview */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="success"
                                borderRadius="lg"
                                coloredShadow="success"
                            >
                                <MDTypography variant="h6" color="white">
                                    Tasks Overview
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                <MDTypography variant="body2" color="text" mb={2}>
                                    Select a date from the calendar to view and manage tasks for that day.
                                </MDTypography>
                                <MDTypography variant="h6" color="text">
                                    Total Tasks: {Object.values(tasks).flat().length}
                                </MDTypography>
                                <MDTypography variant="body2" color="text">
                                    Completed: {Object.values(tasks).flat().filter(task => task.completed).length}
                                </MDTypography>
                                <MDTypography variant="body2" color="text">
                                    Pending: {Object.values(tasks).flat().filter(task => !task.completed).length}
                                </MDTypography>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>

                {/* Task Management Dialog */}
                <Dialog
                    open={showTaskDialog}
                    onClose={() => setShowTaskDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <MDTypography variant="h5">
                            Tasks for {selectedDate.toLocaleDateString()}
                        </MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        {/* Add New Task */}
                        <MDBox mb={3} mt={2}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={9}>
                                    <TextField
                                        fullWidth
                                        label="Add new task"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                addTask();
                                            }
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <MDButton
                                        variant="gradient"
                                        color="info"
                                        onClick={addTask}
                                        fullWidth
                                        disabled={!newTask.trim()}
                                    >
                                        Add Task
                                    </MDButton>
                                </Grid>
                            </Grid>
                        </MDBox>

                        {/* Tasks List */}
                        <MDBox>
                            {currentTasks.length === 0 ? (
                                <MDTypography variant="body2" color="text" textAlign="center" py={4}>
                                    No tasks for this date. Add a task above to get started!
                                </MDTypography>
                            ) : (
                                <List>
                                    {currentTasks.map((task) => (
                                        <ListItem key={task.id} dense>
                                            <Checkbox
                                                checked={task.completed}
                                                onChange={() => toggleTask(task.id)}
                                                color="primary"
                                            />
                                            <ListItemText
                                                primary={task.text}
                                                style={{
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
                            )}
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowTaskDialog(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Todo; 