import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const AUTH_KEY = "ffrd_admin_auth";

export default function AdminLayout() {
  const [authenticated, setAuthenticated] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem(AUTH_KEY) === "true";
    setAuthenticated(isAuth);
  }, []);

  function handleLogin() {
    setAuthenticated(true);
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
  }

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
