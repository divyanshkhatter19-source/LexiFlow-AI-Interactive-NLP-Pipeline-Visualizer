// src/algorithms/spellingEmbeddings.ts
import { TokenInfo } from "../types";

/**
 * Generate a simple deterministic character‑feature vector for a token.
 * Features:
 *   1. token length
 *   2. number of vowels (a,e,i,o,u)
 *   3. number of consonants
 * This already yields a 3‑dimensional vector, so no PCA needed.
 */
export function spellingVector(token: string): [number, number, number] {
  const lowered = token.toLowerCase();
  const length = lowered.length;
  const vowels = lowered.match(/[aeiou]/g)?.length ?? 0;
  const consonants = length - vowels;
  return [length, vowels, consonants];
}

export function generateSpellingEmbeddings(tokens: TokenInfo[]): Record<string, [number, number, number]> {
  const map: Record<string, [number, number, number]> = {};
  tokens.forEach((t) => {
    map[t.text] = spellingVector(t.text);
  });
  return map;
}
