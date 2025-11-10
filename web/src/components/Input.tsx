"use client";
import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <label className="block">
        {label && <span className="mb-1 block text-sm text-gray-700">{label}</span>}
        <input
          ref={ref}
          className={[
            "w-full rounded-md border px-3 py-2 text-sm shadow-sm",
            error ? "border-red-400 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500",
            "focus:outline-none focus:ring-2",
            className,
          ].join(" ")}
          {...props}
        />
        {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      </label>
    );
  }
);

Input.displayName = "Input";
export default Input;