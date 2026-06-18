"use client";

import { useState } from "react";
import ScriptForm from "@/components/ScriptForm";
import ScriptResult from "@/components/ScriptResult";
import { ScriptInput, ScriptOutput } from "@/types/script";

export default function Home() {
  const [script, setScript] = useState<ScriptOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(data: ScriptInput) {
    setLoading(true);
    setError(null);
    setScript(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
      const res = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.detail || json.error || "Что-то пошло не так");
        return;
      }

      setScript(json);
    } catch {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Автогенератор сценариев
          </h1>
          <p className="text-gray-500 text-sm">
            Reels · Shorts · TikTok — готовый сценарий за 30 секунд
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <ScriptForm onSubmit={handleGenerate} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-16 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        )}

        {script && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <ScriptResult script={script} />
          </div>
        )}
      </div>
    </main>
  );
}
