import { NextRequest, NextResponse } from "next/server";
import { openai, MODEL } from "@/lib/anthropic";
import { buildPrompt } from "@/lib/prompts";
import { ScriptInput, ScriptOutput } from "@/types/script";

export async function POST(req: NextRequest) {
  try {
    const body: ScriptInput = await req.json();

    if (!body.topic || !body.product || !body.audience || !body.style) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: buildPrompt(body),
        },
      ],
    });

    const choice = response.choices[0];
    console.log("finish_reason:", choice.finish_reason);
    console.log("content:", JSON.stringify(choice.message));
    const rawText = choice.message.content ?? "";

    let script: ScriptOutput;
    try {
      script = JSON.parse(rawText);
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("No JSON found in response:", rawText);
        return NextResponse.json(
          { error: "Не удалось разобрать ответ модели" },
          { status: 500 }
        );
      }
      script = JSON.parse(jsonMatch[0]);
    }

    return NextResponse.json(script);
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Ошибка генерации сценария" },
      { status: 500 }
    );
  }
}
