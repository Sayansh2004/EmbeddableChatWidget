import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ShimmerPostList } from "react-shimmer-effects";
import { setWidgets } from "../utils/widgetsSlice";

/**
 * Dashboard home: lists widgets and shows lightweight metrics.
 */
export default function Dashboard() {
  const dispatch = useDispatch(); // Used to send actions to our Redux store
  const widgets = useSelector((state) => state.widgets.items); // Grab the widgets from the store
  const [loading, setLoading] = useState(true); // Are we waiting for the backend?
  const [error, setError] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // When the Dashboard first loads, go ask the backend for our widgets
  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = await fetch(`${apiBase}/widgets`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load widgets");
        }
        dispatch(setWidgets(data.data || []));
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Failed to load widgets");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [apiBase]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Your Chatbot Widgets</h1>
        <Link to="/dashboard/widgets/new" className="btn btn-primary rounded-full shadow-lg hover:shadow-primary/40 transition-shadow">
          + Create Widget
        </Link>
      </div>

      {loading && (
        <div className="my-4">
          {/* ShimmerPostList shows a modern skeleton UI while content is loading. */}
          <ShimmerPostList postStyle="STYLE_FOUR" col={2} row={1} gap={20} />
        </div>
      )}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {!loading && !widgets.length && (
        <div className="mt-8">
          {/* DaisyUI hero + card style empty state to gently guide the user. */}
          <div className="hero bg-gradient-to-br from-base-200 to-base-300 rounded-3xl border border-base-content/10 shadow-xl overflow-hidden py-12">
            <div className="hero-content flex-col lg:flex-row text-center lg:text-left">
              <div className="max-w-md">
                <h2 className="text-3xl font-extrabold mb-4">You have zero chatbots! 🥺</h2>
                <p className="py-2 text-base opacity-80 mb-6 font-medium">
                  Let's fix that. Create your first widget, customize its colors, and embed it on your website in under 60 seconds.
                </p>
                <Link to="/dashboard/widgets/new" className="btn btn-primary btn-wide rounded-full shadow-lg hover:-translate-y-1 transition-transform">
                  Create your first widget
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {widgets.map((w) => (
          <div key={w._id} className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-200 group">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-bold group-hover:text-primary transition-colors">{w.name}</h2>
              <p className="text-sm opacity-80 mb-2">Bot name: {w.botName}</p>
              <div className="flex gap-4 text-sm mb-2">
                <div>
                  <span className="font-semibold">
                    {w.metrics?.totalConversations ?? 0}
                  </span>{" "}
                  conversations
                </div>
                <div>
                  <span className="font-semibold">
                    {w.metrics?.totalMessages ?? 0}
                  </span>{" "}
                  messages
                </div>
              </div>
              <div className="card-actions justify-between items-center mt-4 pt-2 border-t">
                {/* Button to go to the new Analytics page */}
                <Link
                  to={`/dashboard/widgets/${w._id}/analytics`}
                  className="btn btn-sm btn-secondary"
                >
                  Analytics
                </Link>
                {/* Button to configure the widget colors/text */}
                <Link
                  to={`/dashboard/widgets/${w._id}`}
                  className="btn btn-sm btn-outline"
                >
                  Configure
                </Link>
                {/* The snippet button that copies the embed code */}
                <EmbedSnippet widgetId={w._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Small helper that shows and copies the script tag for embedding the widget on any page.
 */
function EmbedSnippet({ widgetId }) {
  const snippet = `<script src="${window.location.origin}/embed/chatbot.js" data-widget-id="${widgetId}" async></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      // Ignored in this simple demo.
    }
  };

  return (
    <button type="button" className="btn btn-sm btn-ghost" onClick={handleCopy}>
      Copy embed code
    </button>
  );
}

