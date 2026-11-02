import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role = (localStorage.getItem('userRole') || '').toLowerCase();

  if (!isLoggedIn) {
    if (allowedRole === 'doctor') {
      return <Navigate to="/doctor/login" replace />;
    }
    if (allowedRole === 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/patient/login" replace />;
  }

  // If role does not match required role, redirect to appropriate role dashboard
  if (allowedRole && role !== allowedRole.toLowerCase()) {
    if (role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    if (role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/patient/dashboard" replace />;
  }

  return children;
}
