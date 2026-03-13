import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ProtectedRoute acts like a bouncer at the door of a VIP club.
// If you try to visit a page wrapped in <ProtectedRoute> (like the Dashboard),
// it first checks if you are logged in.
export default function ProtectedRoute({ children }) {
  // We ask our Redux store (the central memory of our app): "Is the user logged in?"
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  // If the user is NOT logged in...
  if (!isAuthenticated) {
    // ...we forcefully kick them back to the login page!
    return <Navigate to="/auth" replace />;
  }
  
  // If they ARE logged in, we let them inside by rendering the `children` 
  // (which is whatever component is inside the ProtectedRoute tags).
  return children;
}
