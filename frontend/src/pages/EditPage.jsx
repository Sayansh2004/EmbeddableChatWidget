import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { upsertWidget } from "../utils/widgetsSlice";
import EditForm from "../components/widget/EditForm";
import WidgetLivePreview from "../components/widget/WidgetLivePreview";


export default function EditPage() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiBase = "http://localhost:3000";

  const [form, setForm] = useState({
    name: "",
    botName: "Chatbot",
    welcomeMessage: "Hi! How can I help you today?",
    avatarUrl: "",
    position: "bottom-right",
    primaryColor: "#570DF8",
    accentColor: "#F000B8",
    backgroundColor: "#FFFFFF",
    openByDefault: true,
    showBranding: true,
    suggestionTitle: "",
    suggestionItems: [],
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing widget data when editing an existing one.
  // useEffect with an empty dependency array plus stable values is a common pattern
  // for "run once on mount" behavior in React.
  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        setError(null);
        const res = await fetch(`${apiBase}/widgets/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load widget");
        }
        setForm((prev) => ({ ...prev, ...data.data }));
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Failed to load widget");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [apiBase, id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? `${apiBase}/widgets` : `${apiBase}/widgets/${id}`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save widget");
      }

      dispatch(upsertWidget(data.data));
      toast.success(isNew ? "Widget created successfully" : "Widget updated successfully");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to save widget");
    } finally {
      setSaving(false);
    }
  };

  const previewConfig = useMemo(
    () => ({
      botName: form.botName,
      welcomeMessage: form.welcomeMessage,
      avatarUrl: form.avatarUrl,
      primaryColor: form.primaryColor,
      accentColor: form.accentColor,
      backgroundColor: form.backgroundColor,
      position: form.position,
      openByDefault: form.openByDefault,
      showBranding: form.showBranding,
      suggestionTitle: form.suggestionTitle,
      suggestionItems: form.suggestionItems,
    }),
    [form]
  );

  return (
    <div className="p-4 max-w-6xl mx-auto grid gap-6 lg:grid-cols-2">
      <EditForm
        isNew={isNew}
        loading={loading}
        saving={saving}
        error={error}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
      />
      <WidgetLivePreview config={previewConfig} />
    </div>
  );
}

