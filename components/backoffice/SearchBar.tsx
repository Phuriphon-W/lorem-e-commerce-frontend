"use client";

import React from "react";
import { Input } from "antd";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "large" | "middle" | "small";
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
  size = "middle",
}: SearchBarProps) {
  // Map size to matching tailwind height class so wrapper and inner inputs align perfectly
  const heightClass = size === "large" ? "h-10" : size === "small" ? "h-6" : "h-8";

  return (
    <Input.Search
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onSearch={onSearch}
      allowClear
      className={`${heightClass} rounded-lg border-gray-200 ${className}`}
      size={size}
    />
  );
}
