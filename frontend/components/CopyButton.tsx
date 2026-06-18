"use client";

import { useState } from "react";

interface Props {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
        copied
          ? "border-green-400 text-green-600 bg-green-50"
          : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
      } ${className}`}
    >
      {copied ? "Скопировано" : "Копировать"}
    </button>
  );
}
