// src/Components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute — wraps a route and enforces authentication + optional role check.
 *
 * Usage:
 *   <PrivateRoute>                          → any logged-in user
 *   <PrivateRoute roles={["admin"]}>        → admin only
 *   <PrivateRoute roles={["driver"]}>       → driver only
 *   <PrivateRoute roles={["admin","driver"]}> → admin OR driver
 */
export default function PrivateRoute({ children, roles = [] }) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    // Not logged in → redirect to login
    if (!userInfo || !userInfo.token) {
        return <Navigate to="/login" replace />;
    }

    // Role check (if roles array is provided and non-empty)
    if (roles.length > 0 && !roles.includes(userInfo.role?.toLowerCase())) {
        return <Navigate to="/not-authorized" replace />;
    }

    return children;
}
