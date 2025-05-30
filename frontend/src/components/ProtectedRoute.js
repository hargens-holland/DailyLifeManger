/**
=========================================================
* Protected Route Component
=========================================================
*/

import { useAuth } from "context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // You can replace this with a loading spinner component
        return <div>Loading...</div>;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/authentication/sign-in" replace />;
    }

    return children;
};

export default ProtectedRoute; 