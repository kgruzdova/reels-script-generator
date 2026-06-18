"use client";

import { ScriptOutput } from "@/types/script";
import CopyButton from "./CopyButton";

interface Props {
  script: ScriptOutput;
}

function formatScriptAsText(script: ScriptOutput): string {
  const lines: string[] = [];
  lines.push(`ЗАГОЛОВОК: ${script.title}`);
  lines.push(`\nХУК (0-5 сек): ${script.hook}`);
  lines.push("\nСЦЕНЫ:");
  script.scenes.forEach((scene) => {
    lines.push(`\n[Сцена ${scene.number} — ${scene.duration}]`);
    lines.push(`Действие: ${scene.action}`);
    if (scene.frameText) lines.push(`Текст на экране: ${scene.frameText}`);
    lines.push(`Закадровый текст: ${scene.voiceover}`);
  });
  lines.push(`\nCTA: ${script.cta}`);
  return lines.join("\n");
}

export default function ScriptResult({ script }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Готовый сценарий</h2>
        <CopyButton text={formatScriptAsText(script)} />
      </div>

      {/* Title */}
      <div className="bg-indigo-50 rounded-lg p-4">
        <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide mb-1">
          Заголовок
        </p>
        <p className="text-gray-900 font-semibold">{script.title}</p>
      </div>

      {/* Hook */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">
          Хук — первые 3-5 секунд
        </p>
        <p className="text-gray-900">{script.hook}</p>
      </div>

      {/* Scenes */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          Сцены
        </p>
        <div className="space-y-3">
          {script.scenes.map((scene) => (
            <div
              key={scene.number}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  Сцена {scene.number}
                </span>
                <span className="text-xs text-gray-400">{scene.duration}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-xs text-gray-400 uppercase">
                    Действие:{" "}
                  </span>
                  <span className="text-gray-700">{scene.action}</span>
                </div>
                {scene.frameText && (
                  <div>
                    <span className="text-xs text-gray-400 uppercase">
                      Текст на экране:{" "}
                    </span>
                    <span className="text-gray-700 font-medium">
                      {scene.frameText}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-400 uppercase">
                    Закадровый текст:{" "}
                  </span>
                  <span className="text-gray-700">{scene.voiceover}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
          Призыв к действию
        </p>
        <p className="text-gray-900 font-medium">{script.cta}</p>
      </div>
    </div>
  );
}
