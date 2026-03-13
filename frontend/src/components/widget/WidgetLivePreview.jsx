import React from "react";
import ChatWidget from "./ChatWidget";

// WidgetLivePreview renders the right-hand side live preview card.
// It receives the already-prepared `config` object from the parent page,
// and simply passes it into the reusable ChatWidget.
export default function WidgetLivePreview({ config }) {
  return (
    <div className="lg:pl-4">
      <h2 className="text-xl font-semibold mb-2">Live Preview</h2>
      <p className="text-sm opacity-80 mb-3">
        This is how your chatbot will look when embedded on a website.
      </p>
      <div className="border rounded-xl bg-base-100 h-[520px] flex items-end justify-end p-4">
        {/* DaisyUI card styling is applied here so the preview visually matches the real widget. */}
        <ChatWidget config={config} isPreview />
      </div>
    </div>
  );
}

