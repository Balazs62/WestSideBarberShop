import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService, ROLES } from "@/services/AuthService";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const user = authService.getCurrentUser();

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !authService.hasAnyRole(allowedRoles)) {
    // Redirect based on user's role
    if (authService.isAdmin()) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (authService.isEmployee()) {
      return <Navigate to="/employee/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

// Specific protected route components for different roles
export function AdminRoute({ children }) {
  return <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>{children}</ProtectedRoute>;
}

export function EmployeeRoute({ children }) {
  return <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>{children}</ProtectedRoute>;
}

export function CustomerRoute({ children }) {
  return <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>{children}</ProtectedRoute>;
}
