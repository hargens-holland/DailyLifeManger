/**
=========================================================
* Authentication Context for JWT Management
=========================================================
*/

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get users from localStorage or initialize with default users
    const getUsersFromStorage = () => {
        const savedUsers = localStorage.getItem("appUsers");
        if (savedUsers) {
            return JSON.parse(savedUsers);
        } else {
            // Initialize with default users if none exist
            const defaultUsers = [
                {
                    user_id: 1,
                    username: "john_doe",
                    email: "john@example.com",
                    password: "password123"
                },
                {
                    user_id: 2,
                    username: "jane_smith",
                    email: "jane@example.com",
                    password: "password456"
                }
            ];
            localStorage.setItem("appUsers", JSON.stringify(defaultUsers));
            return defaultUsers;
        }
    };

    // Save users to localStorage
    const saveUsersToStorage = (users) => {
        localStorage.setItem("appUsers", JSON.stringify(users));
    };

    // Check for existing token on app load
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("authUser");

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing saved user data:", error);
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
            }
        }
        setLoading(false);
    }, []);

    // Generate simple JWT-like token (in real app, use proper JWT library)
    const generateToken = (userId) => {
        const payload = {
            userId: userId,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        return btoa(JSON.stringify(payload));
    };

    // Verify token
    const verifyToken = (token) => {
        try {
            const payload = JSON.parse(atob(token));
            if (payload.exp > Date.now()) {
                return payload;
            }
            return null;
        } catch {
            return null;
        }
    };

    // Sign in function
    const signIn = async (email, password) => {
        try {
            const users = getUsersFromStorage();

            // Find user by email
            const foundUser = users.find(u => u.email === email);

            if (!foundUser || foundUser.password !== password) {
                throw new Error("Invalid email or password");
            }

            // Generate token
            const newToken = generateToken(foundUser.user_id);

            // Create user object without password
            const userWithoutPassword = {
                user_id: foundUser.user_id,
                username: foundUser.username,
                email: foundUser.email
            };

            // Save to localStorage
            localStorage.setItem("authToken", newToken);
            localStorage.setItem("authUser", JSON.stringify(userWithoutPassword));

            // Update state
            setToken(newToken);
            setUser(userWithoutPassword);

            return { success: true, user: userWithoutPassword };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Sign up function
    const signUp = async (username, email, password) => {
        try {
            const users = getUsersFromStorage();

            // Check if user already exists
            const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            // Check if username already exists
            const existingUsername = users.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (existingUsername) {
                throw new Error("Username already taken");
            }

            // Generate new user ID
            const newUserId = users.length > 0 ? Math.max(...users.map(u => u.user_id)) + 1 : 1;

            // Create new user
            const newUser = {
                user_id: newUserId,
                username,
                email,
                password // In real app, hash this password
            };

            // Add to users array and save to localStorage
            const updatedUsers = [...users, newUser];
            saveUsersToStorage(updatedUsers);

            // Generate token
            const newToken = generateToken(newUser.user_id);

            // Create user object without password
            const userWithoutPassword = {
                user_id: newUser.user_id,
                username: newUser.username,
                email: newUser.email
            };

            // Save to localStorage
            localStorage.setItem("authToken", newToken);
            localStorage.setItem("authUser", JSON.stringify(userWithoutPassword));

            // Update state
            setToken(newToken);
            setUser(userWithoutPassword);

            return { success: true, user: userWithoutPassword };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Sign out function
    const signOut = () => {
        // Remove from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");

        // Clear state
        setToken(null);
        setUser(null);

        console.log("User signed out successfully"); // For debugging
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        if (!token) return false;
        const payload = verifyToken(token);
        return payload !== null;
    };

    const value = {
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 