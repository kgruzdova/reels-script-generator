export type VideoStyle = "expert" | "sales" | "entertainment" | "educational";

export interface ScriptInput {
  topic: string;
  product: string;
  audience: string;
  style: VideoStyle;
}

export interface Scene {
  number: number;
  duration: string;
  action: string;
  frameText: string;
  voiceover: string;
}

export interface ScriptOutput {
  title: string;
  hook: string;
  scenes: Scene[];
  cta: string;
}
