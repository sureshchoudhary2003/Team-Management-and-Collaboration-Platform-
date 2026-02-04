import { DashboardSkeleton } from "../components/skeleton-loaders/dashboard-skeleton";
import useAuth from "../hooks/api/use-auth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;

  // If no token exists, redirect immediately
  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute; 