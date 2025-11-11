"use client";
import React from "react";

type CardProps = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

export default function Card({ title, actions, className = "", children }: CardProps) {
  return (
    <div className={["rounded-xl border border-gray-200 bg-white shadow-sm", className].join(" ")}> 
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}