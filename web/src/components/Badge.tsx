"use client";
import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "gray";
  className?: string;
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  gray: "bg-gray-100 text-gray-700 ring-gray-200",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

