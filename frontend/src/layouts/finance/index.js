/**
=========================================================
* Material Dashboard 2 React - Finance Layout
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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

function Finance() {
    // Balance and transactions state
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [showTransactionDialog, setShowTransactionDialog] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        description: "",
        amount: "",
        type: "expense", // income or expense
        category: "",
        date: new Date().toISOString().split('T')[0]
    });

    // Calendar and recurring transactions state
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [recurringTransactions, setRecurringTransactions] = useState({});
    const [showCalendarDialog, setShowCalendarDialog] = useState(false);
    const [showRecurringDialog, setShowRecurringDialog] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [newRecurringTransaction, setNewRecurringTransaction] = useState({
        description: "",
        amount: "",
        type: "income",
        frequency: "monthly" // weekly, monthly, yearly
    });

    // Categories
    const expenseCategories = ["Food", "Transportation", "Entertainment", "Bills", "Shopping", "Healthcare", "Other"];
    const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Other"];

    // Transaction functions
    const addTransaction = () => {
        if (newTransaction.description && newTransaction.amount) {
            const transaction = {
                id: Date.now(),
                description: newTransaction.description,
                amount: parseFloat(newTransaction.amount),
                type: newTransaction.type,
                category: newTransaction.category,
                date: newTransaction.date,
                createdAt: new Date()
            };

            setTransactions([transaction, ...transactions]);

            // Update balance
            if (newTransaction.type === "income") {
                setBalance(balance + parseFloat(newTransaction.amount));
            } else {
                setBalance(balance - parseFloat(newTransaction.amount));
            }

            setNewTransaction({
                description: "",
                amount: "",
                type: "expense",
                category: "",
                date: new Date().toISOString().split('T')[0]
            });
            setShowTransactionDialog(false);
        }
    };

    const deleteTransaction = (transactionId) => {
        const transaction = transactions.find(t => t.id === transactionId);
        if (transaction) {
            // Reverse the balance change
            if (transaction.type === "income") {
                setBalance(balance - transaction.amount);
            } else {
                setBalance(balance + transaction.amount);
            }
            setTransactions(transactions.filter(t => t.id !== transactionId));
        }
    };

    // Calendar functions
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

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowCalendarDialog(true);
    };

    // Recurring transaction functions
    const addRecurringTransaction = () => {
        if (newRecurringTransaction.description && newRecurringTransaction.amount) {
            const dateKey = formatDateKey(selectedDate);
            const dayTransactions = recurringTransactions[dateKey] || [];

            const recurring = {
                id: Date.now(),
                description: newRecurringTransaction.description,
                amount: parseFloat(newRecurringTransaction.amount),
                type: newRecurringTransaction.type,
                frequency: newRecurringTransaction.frequency,
                createdAt: new Date()
            };

            setRecurringTransactions({
                ...recurringTransactions,
                [dateKey]: [...dayTransactions, recurring]
            });

            setNewRecurringTransaction({
                description: "",
                amount: "",
                type: "income",
                frequency: "monthly"
            });
        }
    };

    const deleteRecurringTransaction = (transactionId) => {
        const dateKey = formatDateKey(selectedDate);
        const dayTransactions = recurringTransactions[dateKey] || [];
        const updatedTransactions = dayTransactions.filter(t => t.id !== transactionId);

        setRecurringTransactions({
            ...recurringTransactions,
            [dateKey]: updatedTransactions
        });
    };

    const getDayRecurringTransactions = (date) => {
        const dateKey = formatDateKey(date);
        return recurringTransactions[dateKey] || [];
    };

    // Calculate monthly projections
    const getMonthlyProjection = () => {
        const monthlyIncome = Object.values(recurringTransactions)
            .flat()
            .filter(t => t.type === "income")
            .reduce((total, t) => total + t.amount, 0);

        const monthlyExpenses = Object.values(recurringTransactions)
            .flat()
            .filter(t => t.type === "expense")
            .reduce((total, t) => total + t.amount, 0);

        return monthlyIncome - monthlyExpenses;
    };

    // Render calendar
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const today = new Date();
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <Box
                    key={`empty-${i}`}
                    sx={{
                        width: "14.28%",
                        height: "60px",
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                />
            );
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const dayTransactions = getDayRecurringTransactions(date);
            const hasTransactions = dayTransactions.length > 0;

            days.push(
                <Box
                    key={day}
                    onClick={() => handleDateClick(date)}
                    sx={{
                        width: "14.28%",
                        height: "60px",
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#1976d2" : isToday ? "#e3f2fd" : "white",
                        color: isSelected ? "white" : "black",
                        "&:hover": {
                            backgroundColor: isSelected ? "#1565c0" : "#f5f5f5"
                        },
                        position: "relative"
                    }}
                >
                    <Typography variant="body2" fontWeight={isToday ? "bold" : "normal"}>
                        {day}
                    </Typography>
                    {hasTransactions && (
                        <Box
                            sx={{
                                width: "6px",
                                height: "6px",
                                backgroundColor: isSelected ? "white" : "#4caf50",
                                borderRadius: "50%",
                                position: "absolute",
                                bottom: "8px"
                            }}
                        />
                    )}
                </Box>
            );
        }

        return (
            <Box>
                {/* Calendar Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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

                {/* Day names header */}
                <Box sx={{ display: "flex", backgroundColor: "#f5f5f5", borderRadius: "4px 4px 0 0" }}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                        <Box
                            key={dayName}
                            sx={{
                                width: "14.28%",
                                padding: "8px",
                                textAlign: "center",
                                fontWeight: "bold",
                                borderRight: "1px solid #e0e0e0"
                            }}
                        >
                            {dayName}
                        </Box>
                    ))}
                </Box>

                {/* Calendar grid */}
                <Box sx={{ display: "flex", flexWrap: "wrap", border: "1px solid #e0e0e0", borderTop: "none" }}>
                    {days}
                </Box>
            </Box>
        );
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    {/* Balance Overview */}
                    <Grid item xs={12} md={4}>
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
                                    Current Balance
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2} textAlign="center">
                                <MDTypography variant="h3" color={balance >= 0 ? "success" : "error"}>
                                    ${balance.toFixed(2)}
                                </MDTypography>
                                <MDButton
                                    variant="gradient"
                                    color="info"
                                    onClick={() => setShowTransactionDialog(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Add Transaction
                                </MDButton>
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Monthly Projection */}
                    <Grid item xs={12} md={4}>
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
                                    Monthly Projection
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2} textAlign="center">
                                <MDTypography variant="h4" color={getMonthlyProjection() >= 0 ? "success" : "error"}>
                                    ${getMonthlyProjection().toFixed(2)}
                                </MDTypography>
                                <MDTypography variant="body2" color="text">
                                    Based on recurring transactions
                                </MDTypography>
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Transaction Summary */}
                    <Grid item xs={12} md={4}>
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
                                <MDTypography variant="h6" color="white">
                                    This Month
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                <MDTypography variant="body2" color="text">
                                    Total Transactions: {transactions.length}
                                </MDTypography>
                                <MDTypography variant="body2" color="success">
                                    Income: ${transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                                </MDTypography>
                                <MDTypography variant="body2" color="error">
                                    Expenses: ${transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                                </MDTypography>
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Transaction History */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="dark"
                                borderRadius="lg"
                                coloredShadow="dark"
                            >
                                <MDTypography variant="h6" color="white">
                                    Transaction History
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                {transactions.length === 0 ? (
                                    <MDTypography variant="body2" color="text" textAlign="center" py={4}>
                                        No transactions yet. Add your first transaction above!
                                    </MDTypography>
                                ) : (
                                    <List sx={{ maxHeight: "400px", overflow: "auto" }}>
                                        {transactions.slice(0, 10).map((transaction) => (
                                            <ListItem key={transaction.id}>
                                                <ListItemText
                                                    primary={transaction.description}
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" color="text">
                                                                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Chip
                                                        label={`${transaction.type === "income" ? "+" : "-"}$${transaction.amount.toFixed(2)}`}
                                                        color={transaction.type === "income" ? "success" : "error"}
                                                        size="small"
                                                    />
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => deleteTransaction(transaction.id)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <Icon>delete</Icon>
                                                    </IconButton>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </MDBox>
                        </Card>
                    </Grid>

                    {/* Recurring Transactions Calendar */}
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
                                    Recurring Transactions Calendar
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} pb={2} px={2}>
                                {renderCalendar()}
                                <MDButton
                                    variant="gradient"
                                    color="success"
                                    onClick={() => setShowRecurringDialog(true)}
                                    sx={{ mt: 2 }}
                                    fullWidth
                                >
                                    Add Recurring Transaction
                                </MDButton>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>

                {/* Add Transaction Dialog */}
                <Dialog
                    open={showTransactionDialog}
                    onClose={() => setShowTransactionDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <MDTypography variant="h5">Add Transaction</MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        <MDBox mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        type="number"
                                        value={newTransaction.amount}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Type</InputLabel>
                                        <Select
                                            value={newTransaction.type}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                                            label="Type"
                                        >
                                            <MenuItem value="income">Income</MenuItem>
                                            <MenuItem value="expense">Expense</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={newTransaction.category}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                            label="Category"
                                        >
                                            {(newTransaction.type === "income" ? incomeCategories : expenseCategories).map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Date"
                                        type="date"
                                        value={newTransaction.date}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowTransactionDialog(false)}>Cancel</Button>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={addTransaction}
                            disabled={!newTransaction.description || !newTransaction.amount}
                        >
                            Add Transaction
                        </MDButton>
                    </DialogActions>
                </Dialog>

                {/* Calendar Day Dialog */}
                <Dialog
                    open={showCalendarDialog}
                    onClose={() => setShowCalendarDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <MDTypography variant="h5">
                            Recurring Transactions - {selectedDate.toLocaleDateString()}
                        </MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        <MDBox mt={2}>
                            {getDayRecurringTransactions(selectedDate).length === 0 ? (
                                <MDTypography variant="body2" color="text" textAlign="center" py={4}>
                                    No recurring transactions for this date.
                                </MDTypography>
                            ) : (
                                <List>
                                    {getDayRecurringTransactions(selectedDate).map((transaction) => (
                                        <ListItem key={transaction.id}>
                                            <ListItemText
                                                primary={transaction.description}
                                                secondary={`${transaction.frequency} • ${transaction.type}`}
                                            />
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Chip
                                                    label={`${transaction.type === "income" ? "+" : "-"}$${transaction.amount.toFixed(2)}`}
                                                    color={transaction.type === "income" ? "success" : "error"}
                                                    size="small"
                                                />
                                                <IconButton
                                                    edge="end"
                                                    onClick={() => deleteRecurringTransaction(transaction.id)}
                                                    color="error"
                                                    size="small"
                                                >
                                                    <Icon>delete</Icon>
                                                </IconButton>
                                            </Box>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowCalendarDialog(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Add Recurring Transaction Dialog */}
                <Dialog
                    open={showRecurringDialog}
                    onClose={() => setShowRecurringDialog(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        <MDTypography variant="h5">Add Recurring Transaction</MDTypography>
                    </DialogTitle>
                    <DialogContent>
                        <MDBox mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description (e.g., Rent, Salary)"
                                        value={newRecurringTransaction.description}
                                        onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, description: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        type="number"
                                        value={newRecurringTransaction.amount}
                                        onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, amount: e.target.value })}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Type</InputLabel>
                                        <Select
                                            value={newRecurringTransaction.type}
                                            onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, type: e.target.value })}
                                            label="Type"
                                        >
                                            <MenuItem value="income">Income</MenuItem>
                                            <MenuItem value="expense">Expense</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Frequency</InputLabel>
                                        <Select
                                            value={newRecurringTransaction.frequency}
                                            onChange={(e) => setNewRecurringTransaction({ ...newRecurringTransaction, frequency: e.target.value })}
                                            label="Frequency"
                                        >
                                            <MenuItem value="weekly">Weekly</MenuItem>
                                            <MenuItem value="monthly">Monthly</MenuItem>
                                            <MenuItem value="yearly">Yearly</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <MDTypography variant="body2" color="text" sx={{ mt: 2 }}>
                                Select a date on the calendar to assign this recurring transaction.
                            </MDTypography>
                        </MDBox>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowRecurringDialog(false)}>Cancel</Button>
                        <MDButton
                            variant="gradient"
                            color="success"
                            onClick={() => {
                                addRecurringTransaction();
                                setShowRecurringDialog(false);
                                setShowCalendarDialog(true);
                            }}
                            disabled={!newRecurringTransaction.description || !newRecurringTransaction.amount}
                        >
                            Add to Selected Date
                        </MDButton>
                    </DialogActions>
                </Dialog>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Finance; 