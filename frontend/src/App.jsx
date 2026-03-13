import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "./utils/authSlice";
import { ShimmerPostList } from "react-shimmer-effects";
import Navbar from "./components/Navbar";

// App.jsx is the main "wrapper" or "shell" for our dashboard. 
// It doesn't show specific pages itself. Instead, it holds the Navbar 
// at the top and uses `<Outlet />` to show whatever page the user 
// clicked on (like the Dashboard or Analytics page).
export default function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Where our backend lives
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // When the app first loads (or on a page refresh), we check if the user is already logged in.
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // We ping our new backend endpoint. It will automatically send our secure HTTP cookie!
        const res = await fetch(`${apiBase}/auth/me`, {
          credentials: "include",
        });
        const result = await res.json();
        
        // If the backend recognizes the cookie and returns the user...
        if (res.ok && result.success) {
          // Put the user directly into Redux! Now our whole app knows we are logged in.
          dispatch(setUser(result.data));
        }
      } catch (err) {
        // If it fails (e.g., token expired, or user not logged in), do nothing.
        // ProtectedRoute will kick them to the login screen when they try to access a private page.
        console.error("Auto-login failed:", err);
      } finally {
        // Finished checking! We can stop showing the loading screen.
        setLoading(false);
      }
    };

    fetchUser();
  }, [apiBase, dispatch]);

  // If we are still checking the backend, show a nice loading skeleton instead of flashing the login page!
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 p-8">
        <ShimmerPostList postStyle="STYLE_SIX" col={1} row={3} gap={30} />
      </div>
    );
  }

  return (
    // "min-h-screen" makes sure the background covers the whole screen height
    <div className="min-h-screen bg-base-200">
      {/* The navigation bar shown at the top of every page inside the dashboard */}
      <Navbar />
      
      {/* <Outlet /> is a placeholder. React Router injects the active page right here! */}
      <Outlet />
    </div>
  );
}
