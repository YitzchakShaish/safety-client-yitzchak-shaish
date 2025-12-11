import { Outlet, Navigate } from "react-router";
import { useUser } from "../hooks/useUser";


export default function ProtectedRoute() {
    const isAuthenticated = useUser().user;

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace 
        state={{ message: "עליך להיות מחובר כדי להיכנס לעמוד זה" }} />;
    }

    return <Outlet />;
}
