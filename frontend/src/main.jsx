import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import EditPage from "./pages/EditPage.jsx";
import EmbedWidget from "./components/EmbedWidget.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import App from "./App.jsx";
import { appStore } from "./utils/appStore";
import AnalyticsPage from "./pages/AnalyticsPage.jsx"; // Import our new analytics page!

// --- HOW ROUTING WORKS ---
// We create an "appRouter" which is like a map of all the pages in our app.
// If the URL matches a path (like "/auth"), it shows the correct component.
const appRouter = createBrowserRouter([
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/widgets/:id",
        element: (
          // Only allowed if logged in (VIP area)
          <ProtectedRoute>
            <EditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/widgets/:id/analytics",
        element: (
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        ),
      },
      // Public embed route used by the script tag; it intentionally
      // does not use ProtectedRoute so it can be shown on any site.
      // E.g., The little chatbot circle at the bottom right of a page.
      {
        path: "embed/widget/:widgetId",
        element: <EmbedWidget />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/auth" replace />,
  },
]);

// Root render: Redux Provider + RouterProvider + global toast container.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={appRouter} />
      <Toaster position="top-right" />
    </Provider>
  </StrictMode>
);
