import React from "react";
import { Loader2 } from "lucide-react";
import { themes, defaultTheme, type ThemeName } from "../theme/theme";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  themeColor?: ThemeName; // Optional override
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      themeColor,
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = "left",
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const activeTokens = themes[themeColor || defaultTheme];

    const baseStyles =
      "font-semibold transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg disabled:opacity-50 cursor-pointer";

    const variants = {
      primary: activeTokens.primary,
      secondary:
        "bg-slate-800 hover:bg-slate-700 text-slate-200 shadow-slate-900/20",
      danger: "bg-red-500 hover:bg-red-400 text-slate-950 shadow-red-500/20",
      outline: `bg-transparent ${activeTokens.primaryOutline}`,
      ghost: `bg-transparent hover:bg-slate-800/40 ${activeTokens.accent} shadow-none`,
    };

    const sizes = {
      sm: "py-1.5 px-3 text-xs",
      md: "py-2.5 px-4 text-sm",
      lg: "py-3.5 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : "w-auto"} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <Loader2
              size={size === "sm" ? 14 : size === "lg" ? 20 : 16}
              className="animate-spin"
            />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && icon}
            {children}
            {icon && iconPosition === "right" && icon}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
