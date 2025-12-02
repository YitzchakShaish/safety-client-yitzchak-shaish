import { Outlet, Navigate } from "react-router";
import { isAuthenticated } from "../utils/storage";

export default function ProtectedRoute() {
    const hasToken = isAuthenticated();

    if (!hasToken) {
        return <Navigate to="/auth" replace 
        state={{ message: "עליך להיות מחובר כדי להיכנס לעמוד זה" }} />;
    }

    return <Outlet />;
}
