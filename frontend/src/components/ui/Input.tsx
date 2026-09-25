import React from "react";
import { themes, defaultTheme, type ThemeName } from "../theme/theme";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  themeColor?: ThemeName; // Optional override
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      themeColor,
      icon,
      iconPosition = "left",
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const activeTokens = themes[themeColor || defaultTheme];
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`space-y-1.5 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-400"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <span className="absolute left-3 top-3 text-slate-500 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-slate-950 border rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-colors py-2.5 
            ${error ? "border-red-500 focus:border-red-500" : `border-slate-800 ${activeTokens.ring}`} 
            ${icon && iconPosition === "left" ? "pl-10 pr-4" : ""} 
            ${icon && iconPosition === "right" ? "pl-4 pr-10" : ""} 
            ${!icon ? "px-4" : ""} 
            ${className}`}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <span className="absolute right-3 top-3 text-slate-500 pointer-events-none">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
