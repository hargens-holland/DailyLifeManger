/**
=========================================================
* Material Dashboard 2 React - Enhanced Cooking Layout
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

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

// AI Recipe service
import recipeAIService from "services/recipeAI";

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`cooking-tabpanel-${index}`}
            aria-labelledby={`cooking-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function Cooking() {
    // Authentication
    const { user } = useAuth();

    // Tab state
    const [currentTab, setCurrentTab] = useState(0);

    // Existing recipe state
    const [recipes, setRecipes] = useState([]);
    const [showRecipeDialog, setShowRecipeDialog] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [newRecipe, setNewRecipe] = useState({
        title: "",
        ingredients: "",
        instructions: "",
        cookingTime: "",
        servings: "",
        difficulty: "Medium"
    });

    // Pantry state
    const [pantryItems, setPantryItems] = useState([]);
    const [showPantryDialog, setShowPantryDialog] = useState(false);
    const [newPantryItem, setNewPantryItem] = useState({
        name: "",
        quantity: "",
        unit: "pieces",
        category: "other",
        expirationDate: "",
        location: "pantry"
    });

    // AI Recipe Generator state
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
    const [mealType, setMealType] = useState("any");
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showDetailedRecipe, setShowDetailedRecipe] = useState(false);
    const [detailedRecipe, setDetailedRecipe] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    // Constants for pantry
    const categories = [
        { value: "vegetables", label: "Vegetables" },
        { value: "fruits", label: "Fruits" },
        { value: "meat", label: "Meat & Poultry" },
        { value: "dairy", label: "Dairy" },
        { value: "grains", label: "Grains & Cereals" },
        { value: "spices", label: "Spices & Herbs" },
        { value: "canned", label: "Canned Goods" },
        { value: "frozen", label: "Frozen" },
        { value: "other", label: "Other" }
    ];

    const units = ["pieces", "cups", "lbs", "oz", "kg", "g", "ml", "l", "tsp", "tbsp", "packages"];
    const locations = ["pantry", "fridge", "freezer", "cabinet"];

    const dietaryOptions = [
        "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Low-Carb", "High-Protein"
    ];

    const mealTypes = [
        { value: "any", label: "Any Meal" },
        { value: "breakfast", label: "Breakfast" },
        { value: "lunch", label: "Lunch" },
        { value: "dinner", label: "Dinner" },
        { value: "snack", label: "Snack" },
        { value: "dessert", label: "Dessert" }
    ];

    // Load data on component mount
    useEffect(() => {
        loadRecipes();
        loadPantryItems();
    }, [user]);

    // Load existing recipes
    const loadRecipes = () => {
        if (user) {
            const savedRecipes = localStorage.getItem(`recipes_${user.user_id}`);
            if (savedRecipes) {
                setRecipes(JSON.parse(savedRecipes));
            }
        }
    };

    // Save recipes
    const saveRecipes = (updatedRecipes) => {
        if (user) {
            localStorage.setItem(`recipes_${user.user_id}`, JSON.stringify(updatedRecipes));
            setRecipes(updatedRecipes);
        }
    };

    // Load pantry items
    const loadPantryItems = () => {
        if (user) {
            const savedItems = localStorage.getItem(`pantry_${user.user_id}`);
            if (savedItems) {
                setPantryItems(JSON.parse(savedItems));
            }
        }
    };

    // Save pantry items
    const savePantryItems = (updatedItems) => {
        if (user) {
            localStorage.setItem(`pantry_${user.user_id}`, JSON.stringify(updatedItems));
            setPantryItems(updatedItems);
        }
    };

    // Add new recipe (existing functionality)
    const addRecipe = () => {
        if (newRecipe.title.trim() && newRecipe.ingredients.trim() && newRecipe.instructions.trim()) {
            const recipe = {
                id: Date.now(),
                ...newRecipe,
                createdAt: new Date().toISOString()
            };

            const updatedRecipes = [...recipes, recipe];
            saveRecipes(updatedRecipes);

            setNewRecipe({
                title: "",
                ingredients: "",
                instructions: "",
                cookingTime: "",
                servings: "",
                difficulty: "Medium"
            });
            setShowRecipeDialog(false);
        }
    };

    // Delete recipe (existing functionality)
    const deleteRecipe = (id) => {
        const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
        saveRecipes(updatedRecipes);
    };

    // Add pantry item
    const addPantryItem = () => {
        if (newPantryItem.name.trim() && newPantryItem.quantity.trim()) {
            const item = {
                id: Date.now(),
                ...newPantryItem,
                addedAt: new Date().toISOString()
            };

            const updatedItems = [...pantryItems, item];
            savePantryItems(updatedItems);

            setNewPantryItem({
                name: "",
                quantity: "",
                unit: "pieces",
                category: "other",
                expirationDate: "",
                location: "pantry"
            });
            setShowPantryDialog(false);
        }
    };

    // Delete pantry item
    const deletePantryItem = (id) => {
        const updatedItems = pantryItems.filter(item => item.id !== id);
        savePantryItems(updatedItems);
    };

    // Check if item is expiring soon
    const isExpiringSoon = (expirationDate) => {
        if (!expirationDate) return false;
        const expDate = new Date(expirationDate);
        const today = new Date();
        const diffTime = expDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0;
    };

    // Check if item is expired
    const isExpired = (expirationDate) => {
        if (!expirationDate) return false;
        const expDate = new Date(expirationDate);
        const today = new Date();
        return expDate < today;
    };

    // Handle ingredient selection for AI
    const handleIngredientToggle = (ingredient) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(item => item !== ingredient)
                : [...prev, ingredient]
        );
    };

    // Handle dietary restriction toggle
    const handleDietaryToggle = (restriction) => {
        setDietaryRestrictions(prev =>
            prev.includes(restriction)
                ? prev.filter(item => item !== restriction)
                : [...prev, restriction]
        );
    };

    // Generate AI recipe suggestions
    const generateRecipeSuggestions = async () => {
        if (selectedIngredients.length === 0) {
            alert("Please select at least one ingredient from your pantry");
            return;
        }

        setIsGenerating(true);
        try {
            const suggestions = await recipeAIService.generateRecipeSuggestions(
                selectedIngredients,
                dietaryRestrictions,
                mealType
            );
            setAiSuggestions(suggestions.recipes || []);
        } catch (error) {
            console.error("Error generating suggestions:", error);
            alert("Failed to generate recipe suggestions. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Get detailed recipe
    const getDetailedRecipe = async (recipeName, ingredients) => {
        setIsLoadingDetails(true);
        setShowDetailedRecipe(true);

        try {
            const detailed = await recipeAIService.generateDetailedRecipe(recipeName, ingredients);
            setDetailedRecipe(detailed);
        } catch (error) {
            console.error("Error getting detailed recipe:", error);
            alert("Failed to get detailed recipe. Please try again.");
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // Save AI recipe to saved recipes
    const saveAIRecipe = (aiRecipe) => {
        const recipe = {
            id: Date.now(),
            title: aiRecipe.name,
            ingredients: aiRecipe.ingredients.join('\n'),
            instructions: aiRecipe.instructions.join('\n'),
            cookingTime: aiRecipe.cookingTime || aiRecipe.totalTime,
            servings: aiRecipe.servings,
            difficulty: aiRecipe.difficulty,
            createdAt: new Date().toISOString(),
            source: 'AI Generated'
        };

        const updatedRecipes = [...recipes, recipe];
        saveRecipes(updatedRecipes);
        alert("Recipe saved to your collection!");
    };

    // Group pantry items by category
    const groupedPantryItems = pantryItems.reduce((groups, item) => {
        const category = item.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
        return groups;
    }, {});

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <MDBox mb={3}>
                    <MDTypography variant="h4" fontWeight="medium">
                        Cooking & Recipe Management
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                        Manage your recipes, pantry items, and get AI-powered meal suggestions
                    </MDTypography>
                </MDBox>

                <Card>
                    <MDBox>
                        <Tabs
                            value={currentTab}
                            onChange={(e, newValue) => setCurrentTab(newValue)}
                            variant="fullWidth"
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab
                                label={
                                    <Box display="flex" alignItems="center">
                                        <Icon sx={{ mr: 1 }}>restaurant</Icon>
                                        Saved Recipes
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box display="flex" alignItems="center">
                                        <Icon sx={{ mr: 1 }}>kitchen</Icon>
                                        Pantry Management
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box display="flex" alignItems="center">
                                        <Icon sx={{ mr: 1 }}>auto_awesome</Icon>
                                        AI Recipe Generator
                                    </Box>
                                }
                            />
                        </Tabs>

                        {/* Saved Recipes Tab */}
                        <TabPanel value={currentTab} index={0}>
                            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <MDTypography variant="h6">Your Saved Recipes</MDTypography>
                                <MDButton
                                    variant="gradient"
                                    color="success"
                                    onClick={() => setShowRecipeDialog(true)}
                                >
                                    <Icon sx={{ mr: 1 }}>add</Icon>
                                    Add Recipe
                                </MDButton>
                            </MDBox>

                            {recipes.length === 0 ? (
                                <MDBox textAlign="center" py={4}>
                                    <Icon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}>restaurant_menu</Icon>
                                    <MDTypography variant="h6" color="text">
                                        No recipes saved yet
                                    </MDTypography>
                                    <MDTypography variant="body2" color="text">
                                        Add your first recipe or generate one with AI!
                                    </MDTypography>
                                </MDBox>
                            ) : (
                                <Grid container spacing={3}>
                                    {recipes.map((recipe) => (
                                        <Grid item xs={12} md={6} lg={4} key={recipe.id}>
                                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <MDBox p={2} flexGrow={1}>
                                                    <MDTypography variant="h6" mb={1}>
                                                        {recipe.title}
                                                    </MDTypography>
                                                    <MDBox mb={2}>
                                                        <Chip label={recipe.difficulty} color="primary" size="small" sx={{ mr: 1 }} />
                                                        {recipe.cookingTime && (
                                                            <Chip label={recipe.cookingTime} color="secondary" size="small" sx={{ mr: 1 }} />
                                                        )}
                                                        {recipe.servings && (
                                                            <Chip label={`Serves ${recipe.servings}`} color="info" size="small" />
                                                        )}
                                                    </MDBox>
                                                    <MDTypography variant="body2" color="text" sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {recipe.ingredients.substring(0, 100)}...
                                                    </MDTypography>
                                                </MDBox>
                                                <MDBox p={2} pt={0}>
                                                    <MDBox display="flex" justifyContent="space-between">
                                                        <MDButton
                                                            variant="outlined"
                                                            color="info"
                                                            size="small"
                                                            onClick={() => setSelectedRecipe(recipe)}
                                                        >
                                                            View Recipe
                                                        </MDButton>
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => deleteRecipe(recipe.id)}
                                                        >
                                                            <Icon>delete</Icon>
                                                        </IconButton>
                                                    </MDBox>
                                                </MDBox>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </TabPanel>

                        {/* Pantry Management Tab */}
                        <TabPanel value={currentTab} index={1}>
                            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <MDTypography variant="h6">Pantry & Fridge Inventory</MDTypography>
                                <MDButton
                                    variant="gradient"
                                    color="success"
                                    onClick={() => setShowPantryDialog(true)}
                                >
                                    <Icon sx={{ mr: 1 }}>add</Icon>
                                    Add Item
                                </MDButton>
                            </MDBox>

                            {/* Expiration Alerts */}
                            {pantryItems.some(item => isExpired(item.expirationDate) || isExpiringSoon(item.expirationDate)) && (
                                <Alert severity="warning" sx={{ mb: 3 }}>
                                    <MDTypography variant="body2">
                                        <strong>Expiration Alert:</strong> You have items that are expired or expiring soon!
                                    </MDTypography>
                                </Alert>
                            )}

                            {pantryItems.length === 0 ? (
                                <MDBox textAlign="center" py={4}>
                                    <Icon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}>kitchen</Icon>
                                    <MDTypography variant="h6" color="text">
                                        Your pantry is empty
                                    </MDTypography>
                                    <MDTypography variant="body2" color="text">
                                        Start adding items to track your ingredients!
                                    </MDTypography>
                                </MDBox>
                            ) : (
                                <MDBox>
                                    {Object.entries(groupedPantryItems).map(([category, items]) => (
                                        <Accordion key={category} defaultExpanded>
                                            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
                                                <MDTypography variant="h6">
                                                    {categories.find(cat => cat.value === category)?.label || category}
                                                    <Chip label={items.length} size="small" sx={{ ml: 2 }} />
                                                </MDTypography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <List>
                                                    {items.map((item) => (
                                                        <ListItem key={item.id} divider>
                                                            <ListItemText
                                                                primary={
                                                                    <MDBox display="flex" alignItems="center">
                                                                        <MDTypography variant="body1" sx={{ mr: 2 }}>
                                                                            {item.name}
                                                                        </MDTypography>
                                                                        <Chip
                                                                            label={item.location}
                                                                            size="small"
                                                                            color="default"
                                                                            sx={{ mr: 1 }}
                                                                        />
                                                                        {isExpired(item.expirationDate) && (
                                                                            <Chip label="Expired" size="small" color="error" />
                                                                        )}
                                                                        {isExpiringSoon(item.expirationDate) && !isExpired(item.expirationDate) && (
                                                                            <Chip label="Expiring Soon" size="small" color="warning" />
                                                                        )}
                                                                    </MDBox>
                                                                }
                                                                secondary={
                                                                    <MDBox>
                                                                        <MDTypography variant="body2" color="text">
                                                                            Quantity: {item.quantity} {item.unit}
                                                                        </MDTypography>
                                                                        {item.expirationDate && (
                                                                            <MDTypography variant="caption" color="text">
                                                                                Expires: {new Date(item.expirationDate).toLocaleDateString()}
                                                                            </MDTypography>
                                                                        )}
                                                                    </MDBox>
                                                                }
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton
                                                                    edge="end"
                                                                    onClick={() => deletePantryItem(item.id)}
                                                                    color="error"
                                                                    size="small"
                                                                >
                                                                    <Icon>delete</Icon>
                                                                </IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}
                                </MDBox>
                            )}
                        </TabPanel>

                        {/* AI Recipe Generator Tab */}
                        <TabPanel value={currentTab} index={2}>
                            <MDTypography variant="h6" mb={3}>
                                AI Recipe Generator
                            </MDTypography>

                            {!recipeAIService.isServiceAvailable() && (
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    <MDTypography variant="body2">
                                        AI recipe generation is using mock data. To enable real AI suggestions, add your OpenAI API key to the .env file.
                                    </MDTypography>
                                </Alert>
                            )}

                            <Grid container spacing={3}>
                                {/* Ingredient Selection */}
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <MDBox p={3}>
                                            <MDTypography variant="h6" mb={2}>
                                                Select Ingredients from Your Pantry
                                            </MDTypography>

                                            {pantryItems.length === 0 ? (
                                                <MDBox textAlign="center" py={3}>
                                                    <MDTypography variant="body2" color="text">
                                                        No pantry items available. Add items to your pantry first!
                                                    </MDTypography>
                                                    <MDButton
                                                        variant="outlined"
                                                        color="info"
                                                        size="small"
                                                        onClick={() => setCurrentTab(1)}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Go to Pantry
                                                    </MDButton>
                                                </MDBox>
                                            ) : (
                                                <FormGroup>
                                                    {pantryItems.map((item) => (
                                                        <FormControlLabel
                                                            key={item.id}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedIngredients.includes(item.name)}
                                                                    onChange={() => handleIngredientToggle(item.name)}
                                                                />
                                                            }
                                                            label={
                                                                <MDBox display="flex" alignItems="center">
                                                                    <MDTypography variant="body2">
                                                                        {item.name}
                                                                    </MDTypography>
                                                                    <Chip
                                                                        label={`${item.quantity} ${item.unit}`}
                                                                        size="small"
                                                                        sx={{ ml: 1 }}
                                                                    />
                                                                </MDBox>
                                                            }
                                                        />
                                                    ))}
                                                </FormGroup>
                                            )}
                                        </MDBox>
                                    </Card>
                                </Grid>

                                {/* Preferences */}
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <MDBox p={3}>
                                            <MDTypography variant="h6" mb={2}>
                                                Preferences
                                            </MDTypography>

                                            <FormControl fullWidth sx={{ mb: 3 }}>
                                                <InputLabel>Meal Type</InputLabel>
                                                <Select
                                                    value={mealType}
                                                    onChange={(e) => setMealType(e.target.value)}
                                                    label="Meal Type"
                                                >
                                                    {mealTypes.map((type) => (
                                                        <MenuItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <MDTypography variant="body2" mb={1}>
                                                Dietary Restrictions:
                                            </MDTypography>
                                            <FormGroup>
                                                {dietaryOptions.map((option) => (
                                                    <FormControlLabel
                                                        key={option}
                                                        control={
                                                            <Checkbox
                                                                checked={dietaryRestrictions.includes(option)}
                                                                onChange={() => handleDietaryToggle(option)}
                                                            />
                                                        }
                                                        label={option}
                                                    />
                                                ))}
                                            </FormGroup>

                                            <MDButton
                                                variant="gradient"
                                                color="info"
                                                fullWidth
                                                onClick={generateRecipeSuggestions}
                                                disabled={isGenerating || selectedIngredients.length === 0}
                                                sx={{ mt: 3 }}
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Icon sx={{ mr: 1 }}>auto_awesome</Icon>
                                                        Generate Recipe Ideas
                                                    </>
                                                )}
                                            </MDButton>
                                        </MDBox>
                                    </Card>
                                </Grid>

                                {/* AI Suggestions */}
                                {aiSuggestions.length > 0 && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <MDBox p={3}>
                                                <MDTypography variant="h6" mb={3}>
                                                    Recipe Suggestions
                                                </MDTypography>

                                                <Grid container spacing={3}>
                                                    {aiSuggestions.map((suggestion, index) => (
                                                        <Grid item xs={12} md={4} key={index}>
                                                            <Card variant="outlined">
                                                                <MDBox p={2}>
                                                                    <MDTypography variant="h6" mb={1}>
                                                                        {suggestion.name}
                                                                    </MDTypography>
                                                                    <MDTypography variant="body2" color="text" mb={2}>
                                                                        {suggestion.description}
                                                                    </MDTypography>

                                                                    <MDBox mb={2}>
                                                                        <Chip label={suggestion.difficulty} color="primary" size="small" sx={{ mr: 1 }} />
                                                                        <Chip label={suggestion.cookingTime} color="secondary" size="small" sx={{ mr: 1 }} />
                                                                        <Chip label={`Serves ${suggestion.servings}`} color="info" size="small" />
                                                                    </MDBox>

                                                                    {suggestion.usedIngredients && suggestion.usedIngredients.length > 0 && (
                                                                        <MDBox mb={2}>
                                                                            <MDTypography variant="caption" color="success">
                                                                                Using: {suggestion.usedIngredients.join(', ')}
                                                                            </MDTypography>
                                                                        </MDBox>
                                                                    )}

                                                                    {suggestion.additionalIngredients && suggestion.additionalIngredients.length > 0 && (
                                                                        <MDBox mb={2}>
                                                                            <MDTypography variant="caption" color="warning">
                                                                                Need: {suggestion.additionalIngredients.join(', ')}
                                                                            </MDTypography>
                                                                        </MDBox>
                                                                    )}

                                                                    <MDBox display="flex" justifyContent="space-between" mt={2}>
                                                                        <MDButton
                                                                            variant="outlined"
                                                                            color="info"
                                                                            size="small"
                                                                            onClick={() => getDetailedRecipe(suggestion.name, suggestion.ingredients)}
                                                                        >
                                                                            View Details
                                                                        </MDButton>
                                                                        <MDButton
                                                                            variant="gradient"
                                                                            color="success"
                                                                            size="small"
                                                                            onClick={() => saveAIRecipe(suggestion)}
                                                                        >
                                                                            Save Recipe
                                                                        </MDButton>
                                                                    </MDBox>
                                                                </MDBox>
                                                            </Card>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </MDBox>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        </TabPanel>
                    </MDBox>
                </Card>

                {/* Add Recipe Dialog (existing) */}
                <Dialog open={showRecipeDialog} onClose={() => setShowRecipeDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <MDTypography variant="h5">Add New Recipe</MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        <MDBox mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Recipe Title"
                                        value={newRecipe.title}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Cooking Time"
                                        value={newRecipe.cookingTime}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, cookingTime: e.target.value })}
                                        variant="outlined"
                                        margin="normal"
                                        placeholder="e.g., 30 minutes"
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Servings"
                                        value={newRecipe.servings}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, servings: e.target.value })}
                                        variant="outlined"
                                        margin="normal"
                                        placeholder="e.g., 4"
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Difficulty</InputLabel>
                                        <Select
                                            value={newRecipe.difficulty}
                                            onChange={(e) => setNewRecipe({ ...newRecipe, difficulty: e.target.value })}
                                            label="Difficulty"
                                        >
                                            <MenuItem value="Easy">Easy</MenuItem>
                                            <MenuItem value="Medium">Medium</MenuItem>
                                            <MenuItem value="Hard">Hard</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Ingredients"
                                        value={newRecipe.ingredients}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                                        variant="outlined"
                                        margin="normal"
                                        multiline
                                        rows={4}
                                        placeholder="List ingredients, one per line"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Instructions"
                                        value={newRecipe.instructions}
                                        onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                                        variant="outlined"
                                        margin="normal"
                                        multiline
                                        rows={6}
                                        placeholder="Step-by-step instructions"
                                    />
                                </Grid>
                            </Grid>
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowRecipeDialog(false)}>Cancel</Button>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={addRecipe}
                            disabled={!newRecipe.title.trim() || !newRecipe.ingredients.trim() || !newRecipe.instructions.trim()}
                        >
                            Save Recipe
                        </MDButton>
                    </DialogActions>
                </Dialog>

                {/* Add Pantry Item Dialog */}
                <Dialog open={showPantryDialog} onClose={() => setShowPantryDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <MDTypography variant="h5">Add Pantry Item</MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        <MDBox mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Item Name"
                                        value={newPantryItem.name}
                                        onChange={(e) => setNewPantryItem({ ...newPantryItem, name: e.target.value })}
                                        variant="outlined"
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Quantity"
                                        value={newPantryItem.quantity}
                                        onChange={(e) => setNewPantryItem({ ...newPantryItem, quantity: e.target.value })}
                                        variant="outlined"
                                        margin="normal"
                                        placeholder="e.g., 2"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Unit</InputLabel>
                                        <Select
                                            value={newPantryItem.unit}
                                            onChange={(e) => setNewPantryItem({ ...newPantryItem, unit: e.target.value })}
                                            label="Unit"
                                        >
                                            {units.map((unit) => (
                                                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={newPantryItem.category}
                                            onChange={(e) => setNewPantryItem({ ...newPantryItem, category: e.target.value })}
                                            label="Category"
                                        >
                                            {categories.map((category) => (
                                                <MenuItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Location</InputLabel>
                                        <Select
                                            value={newPantryItem.location}
                                            onChange={(e) => setNewPantryItem({ ...newPantryItem, location: e.target.value })}
                                            label="Location"
                                        >
                                            {locations.map((location) => (
                                                <MenuItem key={location} value={location}>
                                                    {location.charAt(0).toUpperCase() + location.slice(1)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Expiration Date"
                                        type="date"
                                        value={newPantryItem.expirationDate}
                                        onChange={(e) => setNewPantryItem({ ...newPantryItem, expirationDate: e.target.value })}
                                        variant="outlined"
                                        margin="normal"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowPantryDialog(false)}>Cancel</Button>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={addPantryItem}
                            disabled={!newPantryItem.name.trim() || !newPantryItem.quantity.trim()}
                        >
                            Add Item
                        </MDButton>
                    </DialogActions>
                </Dialog>

                {/* View Recipe Dialog (existing) */}
                <Dialog open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} maxWidth="md" fullWidth>
                    {selectedRecipe && (
                        <>
                            <DialogTitle>
                                <MDTypography variant="h5">{selectedRecipe.title}</MDTypography>
                            </DialogTitle>
                            <DialogContent>
                                <MDBox>
                                    <MDBox mb={2}>
                                        <Chip label={selectedRecipe.difficulty} color="primary" sx={{ mr: 1 }} />
                                        {selectedRecipe.cookingTime && (
                                            <Chip label={selectedRecipe.cookingTime} color="secondary" sx={{ mr: 1 }} />
                                        )}
                                        {selectedRecipe.servings && (
                                            <Chip label={`Serves ${selectedRecipe.servings}`} color="info" />
                                        )}
                                    </MDBox>

                                    <MDTypography variant="h6" mb={1}>Ingredients:</MDTypography>
                                    <MDTypography variant="body2" mb={3} sx={{ whiteSpace: 'pre-line' }}>
                                        {selectedRecipe.ingredients}
                                    </MDTypography>

                                    <MDTypography variant="h6" mb={1}>Instructions:</MDTypography>
                                    <MDTypography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                        {selectedRecipe.instructions}
                                    </MDTypography>
                                </MDBox>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setSelectedRecipe(null)}>Close</Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>

                {/* Detailed AI Recipe Dialog */}
                <Dialog open={showDetailedRecipe} onClose={() => setShowDetailedRecipe(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <MDTypography variant="h5">
                            {detailedRecipe?.name || "Recipe Details"}
                        </MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        {isLoadingDetails ? (
                            <MDBox display="flex" justifyContent="center" alignItems="center" py={4}>
                                <CircularProgress />
                                <MDTypography variant="body2" sx={{ ml: 2 }}>
                                    Generating detailed recipe...
                                </MDTypography>
                            </MDBox>
                        ) : detailedRecipe ? (
                            <MDBox>
                                <MDTypography variant="body1" mb={2}>
                                    {detailedRecipe.description}
                                </MDTypography>

                                <MDBox mb={3}>
                                    <Chip label={detailedRecipe.difficulty} color="primary" sx={{ mr: 1 }} />
                                    <Chip label={`Prep: ${detailedRecipe.prepTime}`} color="secondary" sx={{ mr: 1 }} />
                                    <Chip label={`Cook: ${detailedRecipe.cookTime}`} color="warning" sx={{ mr: 1 }} />
                                    <Chip label={`Serves ${detailedRecipe.servings}`} color="info" />
                                </MDBox>

                                <Divider sx={{ my: 2 }} />

                                <MDTypography variant="h6" mb={2}>Ingredients:</MDTypography>
                                <List dense>
                                    {detailedRecipe.ingredients?.map((ingredient, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={`${ingredient.amount} ${ingredient.item}`}
                                                secondary={ingredient.notes}
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                <Divider sx={{ my: 2 }} />

                                <MDTypography variant="h6" mb={2}>Instructions:</MDTypography>
                                <List>
                                    {detailedRecipe.instructions?.map((instruction, index) => (
                                        <ListItem key={index} alignItems="flex-start">
                                            <ListItemText
                                                primary={`Step ${instruction.step}`}
                                                secondary={
                                                    <MDBox>
                                                        <MDTypography variant="body2" mb={1}>
                                                            {instruction.instruction}
                                                        </MDTypography>
                                                        {instruction.time && (
                                                            <Chip label={instruction.time} size="small" color="default" />
                                                        )}
                                                    </MDBox>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>

                                {detailedRecipe.tips && detailedRecipe.tips.length > 0 && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <MDTypography variant="h6" mb={2}>Tips:</MDTypography>
                                        <List dense>
                                            {detailedRecipe.tips.map((tip, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText primary={tip} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </>
                                )}

                                {detailedRecipe.nutrition && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <MDTypography variant="h6" mb={2}>Nutrition (per serving):</MDTypography>
                                        <MDBox display="flex" gap={1} flexWrap="wrap">
                                            <Chip label={`${detailedRecipe.nutrition.calories} cal`} />
                                            <Chip label={`${detailedRecipe.nutrition.protein} protein`} />
                                            <Chip label={`${detailedRecipe.nutrition.carbs} carbs`} />
                                            <Chip label={`${detailedRecipe.nutrition.fat} fat`} />
                                        </MDBox>
                                    </>
                                )}
                            </MDBox>
                        ) : null}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowDetailedRecipe(false)}>Close</Button>
                        {detailedRecipe && !isLoadingDetails && (
                            <MDButton
                                variant="gradient"
                                color="success"
                                onClick={() => {
                                    saveAIRecipe(detailedRecipe);
                                    setShowDetailedRecipe(false);
                                }}
                            >
                                Save to My Recipes
                            </MDButton>
                        )}
                    </DialogActions>
                </Dialog>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Cooking; 