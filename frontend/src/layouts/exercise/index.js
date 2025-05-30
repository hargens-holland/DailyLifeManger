/**
=========================================================
* Material Dashboard 2 React - Exercise Layout
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

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

function Exercise() {
    // Routines state
    const [routines, setRoutines] = useState([]);
    const [showRoutineDialog, setShowRoutineDialog] = useState(false);
    const [newRoutineName, setNewRoutineName] = useState("");
    const [newRoutineExercises, setNewRoutineExercises] = useState([]);
    const [currentExercise, setCurrentExercise] = useState({ name: "", sets: "", reps: "", weight: "" });

    // Max Lifts state
    const [maxLifts, setMaxLifts] = useState({});
    const [selectedBodyPart, setSelectedBodyPart] = useState("");
    const [showMaxLiftDialog, setShowMaxLiftDialog] = useState(false);
    const [newMaxLift, setNewMaxLift] = useState({ exercise: "", weight: "", reps: "" });

    // Body parts and their exercises
    const bodyParts = {
        chest: ["Bench Press", "Incline Bench Press", "Dumbbell Press", "Push-ups", "Chest Fly"],
        back: ["Deadlift", "Pull-ups", "Bent-over Row", "Lat Pulldown", "T-Bar Row"],
        shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Rear Delt Fly", "Arnold Press"],
        arms: ["Bicep Curls", "Tricep Dips", "Hammer Curls", "Close-grip Bench Press", "Preacher Curls"],
        legs: ["Squat", "Leg Press", "Lunges", "Leg Curls", "Calf Raises"],
        core: ["Plank", "Crunches", "Russian Twists", "Leg Raises", "Dead Bug"]
    };

    // Routine functions
    const addExerciseToRoutine = () => {
        if (currentExercise.name && currentExercise.sets && currentExercise.reps) {
            setNewRoutineExercises([...newRoutineExercises, { ...currentExercise, id: Date.now() }]);
            setCurrentExercise({ name: "", sets: "", reps: "", weight: "" });
        }
    };

    const removeExerciseFromRoutine = (exerciseId) => {
        setNewRoutineExercises(newRoutineExercises.filter(ex => ex.id !== exerciseId));
    };

    const saveRoutine = () => {
        if (newRoutineName && newRoutineExercises.length > 0) {
            const newRoutine = {
                id: Date.now(),
                name: newRoutineName,
                exercises: newRoutineExercises,
                createdAt: new Date()
            };
            setRoutines([...routines, newRoutine]);
            setNewRoutineName("");
            setNewRoutineExercises([]);
            setShowRoutineDialog(false);
        }
    };

    const deleteRoutine = (routineId) => {
        setRoutines(routines.filter(routine => routine.id !== routineId));
    };

    // Max Lifts functions
    const handleBodyPartSelect = (bodyPart) => {
        setSelectedBodyPart(bodyPart);
        setShowMaxLiftDialog(true);
    };

    const addMaxLift = () => {
        if (newMaxLift.exercise && newMaxLift.weight && newMaxLift.reps) {
            const bodyPartLifts = maxLifts[selectedBodyPart] || [];
            const existingLiftIndex = bodyPartLifts.findIndex(lift => lift.exercise === newMaxLift.exercise);

            if (existingLiftIndex >= 0) {
                // Update existing lift
                bodyPartLifts[existingLiftIndex] = { ...newMaxLift, updatedAt: new Date() };
            } else {
                // Add new lift
                bodyPartLifts.push({ ...newMaxLift, id: Date.now(), createdAt: new Date() });
            }

            setMaxLifts({
                ...maxLifts,
                [selectedBodyPart]: bodyPartLifts
            });

            setNewMaxLift({ exercise: "", weight: "", reps: "" });
        }
    };

    const deleteMaxLift = (exercise) => {
        const bodyPartLifts = maxLifts[selectedBodyPart] || [];
        const updatedLifts = bodyPartLifts.filter(lift => lift.exercise !== exercise);
        setMaxLifts({
            ...maxLifts,
            [selectedBodyPart]: updatedLifts
        });
    };

    const getCurrentBodyPartLifts = () => {
        return maxLifts[selectedBodyPart] || [];
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    {/* Routines Section */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="warning"
                                borderRadius="lg"
                                coloredShadow="warning"
                            >
                                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                                    <MDTypography variant="h6" color="white">
                                        Workout Routines
                                    </MDTypography>
                                    <MDButton
                                        variant="contained"
                                        color="white"
                                        size="small"
                                        onClick={() => setShowRoutineDialog(true)}
                                    >
                                        Create Routine
                                    </MDButton>
                                </MDBox>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                {routines.length === 0 ? (
                                    <MDTypography variant="body2" color="text" textAlign="center" py={4}>
                                        No routines created yet. Click "Create Routine" to get started!
                                    </MDTypography>
                                ) : (
                                    <Box>
                                        {routines.map((routine) => (
                                            <Accordion key={routine.id} sx={{ mb: 1 }}>
                                                <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                                        <Typography variant="h6">{routine.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {routine.exercises.length} exercises
                                                        </Typography>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <List dense>
                                                        {routine.exercises.map((exercise, index) => (
                                                            <ListItem key={index}>
                                                                <ListItemText
                                                                    primary={exercise.name}
                                                                    secondary={`${exercise.sets} sets × ${exercise.reps} reps${exercise.weight ? ` @ ${exercise.weight}lbs` : ''}`}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                    <Box mt={2}>
                                                        <MDButton
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => deleteRoutine(routine.id)}
                                                        >
                                                            Delete Routine
                                                        </MDButton>
                                                    </Box>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Box>
                                )}
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Max Lifts Section */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="error"
                                borderRadius="lg"
                                coloredShadow="error"
                            >
                                <MDTypography variant="h6" color="white">
                                    Max Lifts by Body Part
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                <MDTypography variant="body2" color="text" mb={3}>
                                    Select a body part to view and manage your max lifts:
                                </MDTypography>
                                <Grid container spacing={2}>
                                    {Object.keys(bodyParts).map((bodyPart) => (
                                        <Grid item xs={6} sm={4} key={bodyPart}>
                                            <MDButton
                                                variant="outlined"
                                                color="info"
                                                fullWidth
                                                onClick={() => handleBodyPartSelect(bodyPart)}
                                                sx={{
                                                    textTransform: 'capitalize',
                                                    position: 'relative'
                                                }}
                                            >
                                                {bodyPart}
                                                {maxLifts[bodyPart] && maxLifts[bodyPart].length > 0 && (
                                                    <Chip
                                                        label={maxLifts[bodyPart].length}
                                                        size="small"
                                                        color="success"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: -8,
                                                            right: -8,
                                                            minWidth: 20,
                                                            height: 20
                                                        }}
                                                    />
                                                )}
                                            </MDButton>
                                        </Grid>
                                    ))}
                                </Grid>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>

                {/* Create Routine Dialog */}
                <Dialog
                    open={showRoutineDialog}
                    onClose={() => setShowRoutineDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <MDTypography variant="h5">Create New Routine</MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        <MDBox mb={3} mt={2}>
                            <TextField
                                fullWidth
                                label="Routine Name"
                                value={newRoutineName}
                                onChange={(e) => setNewRoutineName(e.target.value)}
                                variant="outlined"
                                margin="normal"
                            />
                        </MDBox>

                        {/* Add Exercise Form */}
                        <MDBox mb={3}>
                            <Typography variant="h6" mb={2}>Add Exercises</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Exercise Name"
                                        value={currentExercise.name}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <TextField
                                        fullWidth
                                        label="Sets"
                                        type="number"
                                        value={currentExercise.sets}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <TextField
                                        fullWidth
                                        label="Reps"
                                        value={currentExercise.reps}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={4} sm={2}>
                                    <TextField
                                        fullWidth
                                        label="Weight (lbs)"
                                        type="number"
                                        value={currentExercise.weight}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, weight: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            <MDButton
                                variant="gradient"
                                color="info"
                                onClick={addExerciseToRoutine}
                                sx={{ mt: 2 }}
                                disabled={!currentExercise.name || !currentExercise.sets || !currentExercise.reps}
                            >
                                Add Exercise
                            </MDButton>
                        </MDBox>

                        {/* Exercise List */}
                        {newRoutineExercises.length > 0 && (
                            <MDBox>
                                <Typography variant="h6" mb={2}>Routine Exercises</Typography>
                                <List>
                                    {newRoutineExercises.map((exercise) => (
                                        <ListItem key={exercise.id}>
                                            <ListItemText
                                                primary={exercise.name}
                                                secondary={`${exercise.sets} sets × ${exercise.reps} reps${exercise.weight ? ` @ ${exercise.weight}lbs` : ''}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => removeExerciseFromRoutine(exercise.id)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>
                            </MDBox>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowRoutineDialog(false)}>Cancel</Button>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={saveRoutine}
                            disabled={!newRoutineName || newRoutineExercises.length === 0}
                        >
                            Save Routine
                        </MDButton>
                    </DialogActions>
                </Dialog>

                {/* Max Lifts Dialog */}
                <Dialog
                    open={showMaxLiftDialog}
                    onClose={() => setShowMaxLiftDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <MDTypography variant="h5" sx={{ textTransform: 'capitalize' }}>
                            {selectedBodyPart} Max Lifts
                        </MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        {/* Add Max Lift Form */}
                        <MDBox mb={3} mt={2}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Exercise</InputLabel>
                                        <Select
                                            value={newMaxLift.exercise}
                                            onChange={(e) => setNewMaxLift({ ...newMaxLift, exercise: e.target.value })}
                                            label="Exercise"
                                        >
                                            {bodyParts[selectedBodyPart]?.map((exercise) => (
                                                <MenuItem key={exercise} value={exercise}>
                                                    {exercise}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Weight (lbs)"
                                        type="number"
                                        value={newMaxLift.weight}
                                        onChange={(e) => setNewMaxLift({ ...newMaxLift, weight: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Reps"
                                        type="number"
                                        value={newMaxLift.reps}
                                        onChange={(e) => setNewMaxLift({ ...newMaxLift, reps: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            <MDButton
                                variant="gradient"
                                color="success"
                                onClick={addMaxLift}
                                sx={{ mt: 2 }}
                                disabled={!newMaxLift.exercise || !newMaxLift.weight || !newMaxLift.reps}
                            >
                                Add/Update Max Lift
                            </MDButton>
                        </MDBox>

                        {/* Current Max Lifts */}
                        <MDBox>
                            {getCurrentBodyPartLifts().length === 0 ? (
                                <MDTypography variant="body2" color="text" textAlign="center" py={4}>
                                    No max lifts recorded for {selectedBodyPart}. Add one above!
                                </MDTypography>
                            ) : (
                                <List>
                                    {getCurrentBodyPartLifts().map((lift) => (
                                        <ListItem key={lift.exercise}>
                                            <ListItemText
                                                primary={lift.exercise}
                                                secondary={`${lift.weight} lbs × ${lift.reps} reps`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => deleteMaxLift(lift.exercise)}
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
                        <Button onClick={() => setShowMaxLiftDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Exercise; 