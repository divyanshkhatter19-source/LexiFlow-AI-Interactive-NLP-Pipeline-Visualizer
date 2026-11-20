// src/algorithms/semanticEmbeddings.ts
import { TokenInfo } from "../types";

/**
 * Very simple deterministic semantic feature extraction.
 * Features used:
 *   1. token length
 *   2. number of unique characters
 *   3. ASCII code of first character (mod 100)
 * This gives a 3‑dimensional vector that loosely varies with meaning
 * (e.g., related words often share length and characters).
 */
export function semanticVector(token: string): [number, number, number] {
  const lowered = token.toLowerCase();
  const length = lowered.length;
  const uniqueChars = new Set(lowered).size;
  const firstCode = lowered.charCodeAt(0) % 100;
  return [length, uniqueChars, firstCode];
}

export function generateSemanticEmbeddings(tokens: TokenInfo[]): Record<string, [number, number, number]> {
  const map: Record<string, [number, number, number]> = {};
  tokens.forEach((t) => {
    map[t.text] = semanticVector(t.text);
  });
  return map;
}
