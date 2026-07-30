/**
 * This function prevents unauthorized users from accessing the page, 
 * offering a smooth UX redirect instead of a raw error
 */

import { useAuth } from "../services/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children })
{
    const {user, loading} = useAuth();

    if (loading)
    {
        return <div>Loading...</div>
    }

    if (!user)
    {
        return <Navigate to="/register"/>
    }

    return children;
}