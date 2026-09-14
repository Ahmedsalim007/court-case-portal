import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function ProtectedRoute({children, allowedRoles}){
    const {isAuthenticated, user} = useAuth();
    
    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    if(allowedRoles&& !allowedRoles.includes(user?.role)){
        return <Navigate to="/" /> // this here right now when unauthorized person try to access admin it redirect him back to the login  but it does need changes
    }
    return children;
}
export default ProtectedRoute;