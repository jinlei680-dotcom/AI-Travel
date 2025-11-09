"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const base = "inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

const variantClass: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100",
  danger:
    "bg-red-600 text-white hover:bg-red-500",
};

const sizeClass: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2.5 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const cls = [base, variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

