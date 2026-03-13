import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatWidget from "./widget/ChatWidget";

/**
 * Public embed page loaded inside an iframe by the embed script.
 * It isolates styles from the host page and only renders the chat widget.
 */
export default function EmbedWidget() {
  const { widgetId } = useParams();
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/public/widgets/${widgetId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load widget");
        }
        setConfig(data.data);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [apiBase, widgetId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm">
        Failed to load widget: {error}
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-end justify-end p-4 bg-transparent">
      <ChatWidget config={config} widgetId={widgetId} />
    </div>
  );
}

