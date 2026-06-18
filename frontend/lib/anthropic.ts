import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.PROXYAPI_KEY,
  baseURL: "https://api.proxyapi.ru/openai/v1",
});

export const MODEL = "gpt-5-mini";
