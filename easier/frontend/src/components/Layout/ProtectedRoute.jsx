import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children , adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading} = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/products" replace />;
  }
  
  return children;
} 