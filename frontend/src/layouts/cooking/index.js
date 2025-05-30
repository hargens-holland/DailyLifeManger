/**
=========================================================
* Material Dashboard 2 React - Cooking Layout
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";

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

function Cooking() {
    // Calendar and meals state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [meals, setMeals] = useState({});
    const [showMealDialog, setShowMealDialog] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedMealType, setSelectedMealType] = useState("breakfast");
    const [newFoodItem, setNewFoodItem] = useState({ name: "", calories: "" });

    // Recipes state
    const [recipes, setRecipes] = useState([]);
    const [showRecipeDialog, setShowRecipeDialog] = useState(false);
    const [newRecipe, setNewRecipe] = useState({ name: "", description: "", ingredients: [] });
    const [currentIngredient, setCurrentIngredient] = useState({ name: "", amount: "", unit: "" });

    // Meal types
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

    // Calendar helper functions
    const formatDateKey = (date) => {
        return date.toISOString().split('T')[0];
    };

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

    // Meal functions
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowMealDialog(true);
    };

    const addFoodItem = () => {
        if (newFoodItem.name && newFoodItem.calories) {
            const dateKey = formatDateKey(selectedDate);
            const dayMeals = meals[dateKey] || { breakfast: [], lunch: [], dinner: [], snack: [] };

            const foodItem = {
                id: Date.now(),
                name: newFoodItem.name,
                calories: parseInt(newFoodItem.calories),
                addedAt: new Date()
            };

            dayMeals[selectedMealType].push(foodItem);

            setMeals({
                ...meals,
                [dateKey]: dayMeals
            });

            setNewFoodItem({ name: "", calories: "" });
        }
    };

    const removeFoodItem = (mealType, foodId) => {
        const dateKey = formatDateKey(selectedDate);
        const dayMeals = meals[dateKey] || { breakfast: [], lunch: [], dinner: [], snack: [] };

        dayMeals[mealType] = dayMeals[mealType].filter(item => item.id !== foodId);

        setMeals({
            ...meals,
            [dateKey]: dayMeals
        });
    };

    const getDayTotalCalories = (date) => {
        const dateKey = formatDateKey(date);
        const dayMeals = meals[dateKey];
        if (!dayMeals) return 0;

        return Object.values(dayMeals).flat().reduce((total, item) => total + item.calories, 0);
    };

    const getMealTypeCalories = (mealType) => {
        const dateKey = formatDateKey(selectedDate);
        const dayMeals = meals[dateKey];
        if (!dayMeals || !dayMeals[mealType]) return 0;

        return dayMeals[mealType].reduce((total, item) => total + item.calories, 0);
    };

    const getCurrentDayMeals = () => {
        const dateKey = formatDateKey(selectedDate);
        return meals[dateKey] || { breakfast: [], lunch: [], dinner: [], snack: [] };
    };

    // Recipe functions
    const addIngredientToRecipe = () => {
        if (currentIngredient.name && currentIngredient.amount) {
            setNewRecipe({
                ...newRecipe,
                ingredients: [...newRecipe.ingredients, { ...currentIngredient, id: Date.now() }]
            });
            setCurrentIngredient({ name: "", amount: "", unit: "" });
        }
    };

    const removeIngredientFromRecipe = (ingredientId) => {
        setNewRecipe({
            ...newRecipe,
            ingredients: newRecipe.ingredients.filter(ing => ing.id !== ingredientId)
        });
    };

    const saveRecipe = () => {
        if (newRecipe.name && newRecipe.ingredients.length > 0) {
            const recipe = {
                id: Date.now(),
                name: newRecipe.name,
                description: newRecipe.description,
                ingredients: newRecipe.ingredients,
                createdAt: new Date()
            };

            setRecipes([...recipes, recipe]);
            setNewRecipe({ name: "", description: "", ingredients: [] });
            setShowRecipeDialog(false);
        }
    };

    const deleteRecipe = (recipeId) => {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    };

    // Render calendar with improved spacing
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const today = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        const days = [];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <Box
                    key={`empty-${i}`}
                    sx={{
                        width: "14.28%",
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                />
            );
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const totalCalories = getDayTotalCalories(date);
            const hasFood = totalCalories > 0;

            days.push(
                <Box
                    key={day}
                    onClick={() => handleDateClick(date)}
                    sx={{
                        width: "14.28%",
                        height: 60,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: "1px solid #e0e0e0",
                        backgroundColor: isSelected ? "#1976d2" : isToday ? "#e3f2fd" : "white",
                        color: isSelected ? "white" : isToday ? "#1976d2" : "black",
                        position: "relative",
                        "&:hover": {
                            backgroundColor: isSelected ? "#1565c0" : "#f5f5f5",
                        },
                    }}
                >
                    <Typography variant="body2" fontWeight={isToday ? "bold" : "normal"}>
                        {day}
                    </Typography>
                    {hasFood && (
                        <Typography variant="caption" sx={{ fontSize: "10px", mt: 0.5 }}>
                            {totalCalories}cal
                        </Typography>
                    )}
                </Box>
            );
        }

        return (
            <MDBox>
                {/* Calendar Header */}
                <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    px={2}
                    py={1}
                    sx={{
                        backgroundColor: "#f44336",
                        borderRadius: "8px",
                        color: "white"
                    }}
                >
                    <IconButton onClick={() => navigateMonth(-1)} sx={{ color: "white" }}>
                        <Icon>chevron_left</Icon>
                    </IconButton>
                    <MDTypography variant="h6" color="white">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </MDTypography>
                    <IconButton onClick={() => navigateMonth(1)} sx={{ color: "white" }}>
                        <Icon>chevron_right</Icon>
                    </IconButton>
                </MDBox>

                {/* Day Names Header */}
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        backgroundColor: "#f5f5f5",
                        borderBottom: "2px solid #e0e0e0"
                    }}
                >
                    {dayNames.map((dayName) => (
                        <Box
                            key={dayName}
                            sx={{
                                width: "14.28%",
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "14px",
                                color: "#666"
                            }}
                        >
                            {dayName}
                        </Box>
                    ))}
                </Box>

                {/* Calendar Grid */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "100%",
                        border: "1px solid #e0e0e0",
                        borderTop: "none"
                    }}
                >
                    {days}
                </Box>
            </MDBox>
        );
    };

    const currentTasks = getCurrentDayMeals();

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    {/* Meal Calendar Section */}
                    <Grid item xs={12} lg={8}>
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
                                    Meal Calendar
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                {renderCalendar()}
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Recipe Collection Section */}
                    <Grid item xs={12} lg={4}>
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
                                    Recipe Collection
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                <MDButton
                                    variant="gradient"
                                    color="success"
                                    onClick={() => setShowRecipeDialog(true)}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                >
                                    Create New Recipe
                                </MDButton>

                                {recipes.length === 0 ? (
                                    <MDTypography variant="body2" color="text" textAlign="center" py={4}>
                                        No recipes yet. Create your first recipe!
                                    </MDTypography>
                                ) : (
                                    <MDBox>
                                        {recipes.map((recipe) => (
                                            <Accordion key={recipe.id} sx={{ mb: 1 }}>
                                                <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                                                    <MDBox display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                                        <MDTypography variant="subtitle1">{recipe.name}</MDTypography>
                                                        <Chip
                                                            label={`${recipe.ingredients.length} ingredients`}
                                                            size="small"
                                                            color="primary"
                                                            sx={{ mr: 2 }}
                                                        />
                                                    </MDBox>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {recipe.description && (
                                                        <MDTypography variant="body2" color="text" mb={2}>
                                                            {recipe.description}
                                                        </MDTypography>
                                                    )}
                                                    <MDTypography variant="subtitle2" mb={1}>Ingredients:</MDTypography>
                                                    <List dense>
                                                        {recipe.ingredients.map((ingredient) => (
                                                            <ListItem key={ingredient.id}>
                                                                <ListItemText
                                                                    primary={`${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ''} ${ingredient.name}`}
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                    <MDButton
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => deleteRecipe(recipe.id)}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Delete Recipe
                                                    </MDButton>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </MDBox>
                                )}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>

                {/* Meal Management Dialog */}
                <Dialog
                    open={showMealDialog}
                    onClose={() => setShowMealDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <MDTypography variant="h5">
                            Meals for {selectedDate.toLocaleDateString()}
                        </MDTypography>
                        <MDTypography variant="h6" color="success">
                            Total: {getDayTotalCalories(selectedDate)} calories
                        </MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        {/* Meal Type Tabs */}
                        <Tabs
                            value={selectedMealType}
                            onChange={(e, newValue) => setSelectedMealType(newValue)}
                            sx={{ mb: 3 }}
                        >
                            {mealTypes.map((mealType) => (
                                <Tab
                                    key={mealType}
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <span style={{ textTransform: 'capitalize' }}>{mealType}</span>
                                            <Chip
                                                label={`${getMealTypeCalories(mealType)}cal`}
                                                size="small"
                                                color="primary"
                                            />
                                        </Box>
                                    }
                                    value={mealType}
                                />
                            ))}
                        </Tabs>

                        {/* Add Food Item */}
                        <MDBox mb={3}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Food Item"
                                        value={newFoodItem.name}
                                        onChange={(e) => setNewFoodItem({ ...newFoodItem, name: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Calories"
                                        type="number"
                                        value={newFoodItem.calories}
                                        onChange={(e) => setNewFoodItem({ ...newFoodItem, calories: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <MDButton
                                        variant="gradient"
                                        color="info"
                                        onClick={addFoodItem}
                                        fullWidth
                                        disabled={!newFoodItem.name || !newFoodItem.calories}
                                    >
                                        Add
                                    </MDButton>
                                </Grid>
                            </Grid>
                        </MDBox>

                        {/* Food Items List */}
                        <MDBox>
                            {getCurrentDayMeals()[selectedMealType].length === 0 ? (
                                <MDTypography variant="body2" color="text" textAlign="center" py={4}>
                                    No food items for {selectedMealType}. Add some above!
                                </MDTypography>
                            ) : (
                                <List>
                                    {getCurrentDayMeals()[selectedMealType].map((item) => (
                                        <ListItem key={item.id}>
                                            <ListItemText
                                                primary={item.name}
                                                secondary={`${item.calories} calories`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => removeFoodItem(selectedMealType, item.id)}
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
                        <Button onClick={() => setShowMealDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Recipe Dialog */}
                <Dialog
                    open={showRecipeDialog}
                    onClose={() => setShowRecipeDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <MDTypography variant="h5">Create New Recipe</MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        {/* Recipe Details */}
                        <MDBox mb={3} mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Recipe Name"
                                        value={newRecipe.name}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description (optional)"
                                        value={newRecipe.description}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                        </MDBox>

                        {/* Add Ingredient */}
                        <MDBox mb={3}>
                            <Typography variant="h6" mb={2}>Add Ingredients</Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                        fullWidth
                                        label="Ingredient Name"
                                        value={currentIngredient.name}
                                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        value={currentIngredient.amount}
                                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, amount: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <TextField
                                        fullWidth
                                        label="Unit"
                                        value={currentIngredient.unit}
                                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                        placeholder="cups, lbs, etc."
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                    <MDButton
                                        variant="gradient"
                                        color="info"
                                        onClick={addIngredientToRecipe}
                                        fullWidth
                                        disabled={!currentIngredient.name || !currentIngredient.amount}
                                    >
                                        Add
                                    </MDButton>
                                </Grid>
                            </Grid>
                        </MDBox>

                        {/* Ingredients List */}
                        {newRecipe.ingredients.length > 0 && (
                            <MDBox>
                                <Typography variant="h6" mb={2}>Recipe Ingredients</Typography>
                                <List>
                                    {newRecipe.ingredients.map((ingredient) => (
                                        <ListItem key={ingredient.id}>
                                            <ListItemText
                                                primary={`${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ''} ${ingredient.name}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => removeIngredientFromRecipe(ingredient.id)}
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
                        <Button onClick={() => setShowRecipeDialog(false)}>Cancel</Button>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={saveRecipe}
                            disabled={!newRecipe.name || newRecipe.ingredients.length === 0}
                        >
                            Save Recipe
                        </MDButton>
                    </DialogActions>
                </Dialog>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Cooking; 