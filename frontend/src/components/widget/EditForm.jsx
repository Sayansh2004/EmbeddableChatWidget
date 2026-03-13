import React from "react";
import { ShimmerContentBlock } from "react-shimmer-effects";

// EditForm renders the left-hand side form for configuring a widget.
// All state is passed in via props so this component stays purely presentational
// and easy to test.
export default function EditForm({
  isNew,
  loading,
  saving,
  error,
  form,
  setForm,
  onSubmit,
}) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="bg-base-100 p-8 rounded-3xl shadow-xl border border-base-200">
      <h1 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
        {isNew ? "Create Widget" : "Edit Widget"}
      </h1>

      {loading && (
        <div className="my-4">
          {/* Shimmer skeleton while the existing widget configuration is loading. (DaisyUI + react-shimmer-effects) */}
          <ShimmerContentBlock
            title
            text
            cta
            thumbnailWidth={300}
            thumbnailHeight={180}
          />
        </div>
      )}
      {error && (
        <div className="alert alert-error mb-3">
          <span>{error}</span>
        </div>
      )}

      {!loading && (
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="label">
              <span className="label-text">Widget Name</span>
            </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Bot Name</span>
            </label>
            <input
              type="text"
              name="botName"
              className="input input-bordered w-full"
              value={form.botName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Welcome Message</span>
            </label>
            <textarea
              name="welcomeMessage"
              className="textarea textarea-bordered w-full"
              rows={3}
              value={form.welcomeMessage}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Avatar URL</span>
            </label>
            <input
              type="url"
              name="avatarUrl"
              className="input input-bordered w-full"
              value={form.avatarUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">
                <span className="label-text">Primary Color</span>
              </label>
              <input
                type="color"
                name="primaryColor"
                className="input input-bordered w-full h-10"
                value={form.primaryColor}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Accent Color</span>
              </label>
              <input
                type="color"
                name="accentColor"
                className="input input-bordered w-full h-10"
                value={form.accentColor}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Background Color</span>
              </label>
              <input
                type="color"
                name="backgroundColor"
                className="input input-bordered w-full h-10"
                value={form.backgroundColor}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <select
                name="position"
                className="select select-bordered w-full"
                value={form.position}
                onChange={handleChange}
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
          </div>

          {/* Capsule / suggestions configuration (only shown once the widget has loaded). */}
          <div className="mt-2">
            <label className="label">
              <span className="label-text">Suggestions section title</span>
            </label>
            <input
              type="text"
              name="suggestionTitle"
              className="input input-bordered w-full"
              placeholder="ABOUT ME, SUPPORT, ABOUT THIS WEBSITE, etc."
              value={form.suggestionTitle}
              onChange={handleChange}
            />

            <label className="label mt-3">
              <span className="label-text">Suggestion capsules (editable)</span>
            </label>
            <p className="text-xs opacity-70 mb-1">
              These become clickable buttons in the widget. Users can still type any
              free-form questions; these just give them a starting point.
            </p>
            <div className="space-y-2">
              {form.suggestionItems?.map((q, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="input input-bordered input-sm flex-1"
                    value={q}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((prev) => {
                        const next = [...(prev.suggestionItems || [])];
                        next[index] = value;
                        return { ...prev, suggestionItems: next };
                      });
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-xs btn-ghost"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        suggestionItems: prev.suggestionItems.filter(
                          (_q, i) => i !== index
                        ),
                      }))
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    suggestionItems: [...(prev.suggestionItems || []), ""],
                  }))
                }
              >
                + Add suggestion
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <label className="label cursor-pointer gap-2">
              <span className="label-text">Open by default</span>
              <input
                type="checkbox"
                name="openByDefault"
                className="toggle"
                checked={form.openByDefault}
                onChange={handleChange}
              />
            </label>
            <label className="label cursor-pointer gap-2">
              <span className="label-text">Show branding</span>
              <input
                type="checkbox"
                name="showBranding"
                className="toggle"
                checked={form.showBranding}
                onChange={handleChange}
              />
            </label>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full mt-6 rounded-full shadow-lg hover:shadow-primary/40 transition-all ${saving ? "loading" : ""}`}
            disabled={saving}
          >
            {isNew ? "Create Widget" : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}

