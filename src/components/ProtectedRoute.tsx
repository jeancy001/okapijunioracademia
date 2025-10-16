
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: ("admin" | "teacher" | "student")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>; // Or spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <div className="text-center mt-20 text-red-600">Access Denied</div>;
  }

  return children;
};

export default ProtectedRoute;
