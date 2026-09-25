import React, { useState } from "react";
import { Send, AlertCircle, CheckCircle2, Layers } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { themes, defaultTheme, type ThemeName } from "../theme/theme";

export interface ActionField {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

export interface ActionCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  fields?: ActionField[];
  submitButtonText?: string;
  themeColor?: ThemeName;
  onSubmit?: (data: Record<string, string>) => Promise<void> | void;
  onDataAdded?: () => void;
}

export function ActionCard({
  title = "Deploy New Module",
  subtitle = "Register service build into orchestration pipeline.",
  icon,
  fields = [
    {
      name: "name",
      label: "Module / Service Name",
      placeholder: "e.g., auth-service-v2",
      required: true,
    },
    {
      name: "tag",
      label: "Release Tag",
      placeholder: "e.g., prod-2026.04",
      required: false,
    },
  ],
  submitButtonText = "Trigger Deployment",
  themeColor,
  onSubmit,
  onDataAdded,
}: ActionCardProps) {
  const activeTokens = themes[themeColor || defaultTheme];

  const initialFormState = fields.reduce(
    (acc, f) => ({ ...acc, [f.name]: "" }),
    {},
  );
  const [formData, setFormData] =
    useState<Record<string, string>>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Fallback default API call
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:5000/api/deployments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Request failed.");
        }
      }

      setSuccess("Submitted successfully!");
      setFormData(initialFormState);
      if (onDataAdded) onDataAdded();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-slate-900 border ${activeTokens.border} rounded-2xl p-6 shadow-xl ${activeTokens.glow} transition-all`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <div
          className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${activeTokens.accent}`}
        >
          {icon || <Layers size={18} />}
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Dynamic Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            type={field.type || "text"}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            themeColor={themeColor}
            required={field.required}
          />
        ))}

        <Button
          type="submit"
          loading={loading}
          themeColor={themeColor}
          icon={<Send size={15} />}
          className="mt-2"
        >
          {submitButtonText}
        </Button>
      </form>
    </div>
  );
}
