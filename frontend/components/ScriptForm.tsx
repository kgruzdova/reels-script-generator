"use client";

import { useState } from "react";
import { ScriptInput, VideoStyle } from "@/types/script";

const styles: { value: VideoStyle; label: string }[] = [
  { value: "expert", label: "Экспертный" },
  { value: "sales", label: "Продающий" },
  { value: "entertainment", label: "Развлекательный" },
  { value: "educational", label: "Образовательный" },
];

interface Props {
  onSubmit: (data: ScriptInput) => void;
  loading: boolean;
}

export default function ScriptForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<ScriptInput>({
    topic: "",
    product: "",
    audience: "",
    style: "expert",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Тема видео
        </label>
        <input
          name="topic"
          value={form.topic}
          onChange={handleChange}
          required
          placeholder="Например: как выбрать CRM для малого бизнеса"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Продукт / услуга
        </label>
        <input
          name="product"
          value={form.product}
          onChange={handleChange}
          required
          placeholder="Например: CRM-система для малого бизнеса"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Целевая аудитория
        </label>
        <input
          name="audience"
          value={form.audience}
          onChange={handleChange}
          required
          placeholder="Например: владельцы малого бизнеса, 25-45 лет"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Стиль видео
        </label>
        <select
          name="style"
          value={form.style}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        >
          {styles.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 px-6 rounded-lg transition-colors text-sm"
      >
        {loading ? "Генерирую сценарий..." : "Сгенерировать сценарий"}
      </button>
    </form>
  );
}
