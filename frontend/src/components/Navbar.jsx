import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearUser } from "../utils/authSlice";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // `useSelector` lets us read data from the Redux store.
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const showNavbar = !location.pathname.startsWith("/embed");
  if (!showNavbar) return null;

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      // Clear authentication state in Redux.
      dispatch(clearUser());
      toast.success("Logged out successfully");
    } catch {
      // If the API call fails we still clear local state so the user is not stuck.
      dispatch(clearUser());
      toast.error("Problem contacting server, but you have been logged out locally.");
    } finally {
      navigate("/auth");
    }
  };

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-base-200/50">
      <div className="flex-1">
        <button
          type="button"
          className="btn btn-ghost text-xl"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
        >
          Chatbot Widget Dashboard
        </button>
      </div>
      {isAuthenticated && (
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-semibold text-sm">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs opacity-70">Logged in</span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

